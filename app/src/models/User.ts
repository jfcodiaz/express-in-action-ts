import bcrypt from 'bcrypt-nodejs'
import mongoose, { Schema } from 'mongoose'

const SALT_FACTOR = 10

type callbackCheckPassword = (error: Error, result: boolean) => void

interface IUser {
  username: string
  password: string
  createdAt: Date
  displayName: string
  bio: string
  name: () => string
  checkPassword: (rawPassword: string, done: callbackCheckPassword) => void
}

interface IUserModel extends IUser, mongoose.Document {
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    requred: true,
    unique: true
  },
  password: {
    type: String,
    requre: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  displayName: String,
  bio: String
})

userSchema.pre<IUserModel>('save', function (done: CallableFunction) {
  if (!this.isModified('password')) {
    return done()
  }
  bcrypt.genSalt(SALT_FACTOR, (error: Error, salt: string) => {
    if (error !== null) {
      return done(error)
    }
    bcrypt.hash(
      this.password,
      salt,
      () => {},
      (error: Error, hashedPassoword: string) => {
        if (error !== null) {
          return done(error)
        }
        this.password = hashedPassoword
        done()
      })
  })
})

userSchema
  .methods
  .checkPassword = function (guess: string, done: callbackCheckPassword) {
    bcrypt.compare(guess, this.password, function (err, isMatch) {
      done(err, isMatch)
    })
  }

userSchema.methods.name = function<IUserModel>() {
  return this.displayName !== undefined ? this.displayName : this.username
}

export default mongoose.model<IUserModel>('User', userSchema)
export {
  IUserModel,
  IUser,
  callbackCheckPassword
}
