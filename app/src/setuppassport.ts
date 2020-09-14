import passport from 'passport'
import {Strategy as LocalStrategy, VerifyFunction} from 'passport-local'
import User, { IUserModel } from './models/User'
import { NativeError } from 'mongoose'

export default () => {
    passport.serializeUser((user:IUserModel, done: CallableFunction) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

const login:VerifyFunction = function(username:string, password: string, done: CallableFunction){
    console.log("logi verify function")    
    User.findOne({username: username}, (err: NativeError, user: IUserModel) => {
        if(err) {
            return done(err)
        }
        if(!user) {
            return done(null, false, { message: 'No user has that username!'})
        }
        
        user.checkPassword(password, (err:Error, isMatch:boolean) => {
            if(err) { 
                return done(err)
            }
            if(isMatch) {
                console.log("is Here", user)
                return done(null, user)
            } else {
                return done(null, false, {message: 'Invalid Password'})
            }
        })
    })
}
  


passport.use('login', new LocalStrategy(
  {
     usernameField: 'username',
     passwordField: 'password',
  }, login)
);