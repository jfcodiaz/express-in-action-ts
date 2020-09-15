/* eslint-disable @typescript-eslint/no-floating-promises */
import passport from 'passport'
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local'
import User, { IUserModel } from './models/User'
import { NativeError } from 'mongoose'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default () => {
  passport.serializeUser((user: IUserModel, done: CallableFunction) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}

const login: VerifyFunction = function (username: string, password: string, done: CallableFunction) {
  User.findOne({ username: username }, (err: NativeError, user: IUserModel) => {
    if (err !== null) {
      return done(err)
    }
    if (user === null) {
      return done(null, false, { message: 'No user has that username!' })
    }
    user.checkPassword(password, (err: Error, isMatch: boolean) => {
      if (err !== null) {
        return done(err)
      }

      if (isMatch !== null) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Invalid Password' })
      }
    })
  })
}

passport.use('login', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  }, login)
)
