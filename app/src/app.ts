import express, { Application, Request, Response } from 'express'
import fs from 'fs'
import https from 'https'
import faker from 'faker'
import User, { IUserModel, callbackCheckPasswor } from './models/User'
import mongoose from 'mongoose'

const HTTPS_PORT = 4333
const HTTP_PORT = 8081

mongoose.connect('mongodb://mongo:27017/express_ts', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true,
});

const app: Application = express()

app.get('/', async (req: Request, res: Response) => {
  const user:IUserModel = new User({
    username: faker.internet.email(),
    password: 'Unpa5swOr#',
    createdAt: new Date(),
    displayName: 'El azul',
    bio: 'Bio mamalona'
  })
  
  await user.save();
  console.log(user.name());
  console.log('password', user.password);
  user.checkPassword('Unpa5swOr#', (err:Error, result:boolean) => {
    console.log(result)
  });
  user.checkPassword('otropassword', (err:Error, result:boolean) => {
    console.log(result)
  });
  console.log('password', user.password);
  res.send(`${user.username} inserted`);
})

app.listen(HTTP_PORT, () => console.log(`HTTP server listening on port ${HTTP_PORT}`))

https.createServer({
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt')
}, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}...`)
})
