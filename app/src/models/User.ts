
import bcrypt from 'bcrypt-nodejs'
import mongoose, { Schema, HookDoneFunction } from 'mongoose'

const SALT_FACTOR = 10;

type callbackCheckPasswor = (error: Error, result: boolean) => void;

interface IUser {
  username: string,
  password: string,
  createdAt: Date,
  displayName: string,
  bio: string,
  name: () => string, 
  checkPassword: (rawPassword: string, done: callbackCheckPasswor ) => void
}

interface IUserModel extends IUser, mongoose.Document { 
  
}

const userSchema:Schema = new Schema({
  username: {
    type: String,
    requred: true, 
    unique:true,
  },
  password: {
    type: String,
    requre:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  displayName: String,
  bio: String
})

userSchema.pre<IUserModel>('save', function(done: CallableFunction) {
  const user = this;
  console.log(user)
  if (!user.isModified('password')){
    return done()
  }
  bcrypt.genSalt(SALT_FACTOR, (error:Error, salt:string) => {
    if (error) {
      return done(error);
    }
    bcrypt.hash(user.password, salt, () => {}, function(error: Error, hashedPassoword: string) {
      if(error) {
        return done(error)
      }
      user.password = hashedPassoword
      done();
    })
  })
})

userSchema.methods.checkPassword = function(guess:string, done: callbackCheckPasswor) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        console.log('isMatch', err, isMatch)
        done(err, isMatch);
    });
};

userSchema.methods.name = function<IUserModel>() {
    return this.displayName || this.username
}

export default mongoose.model<IUserModel>('User', userSchema)

export {
    IUserModel,
    callbackCheckPasswor
};