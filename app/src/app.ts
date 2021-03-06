import express, { Request, Response, Express, Application } from 'express'
import path from 'path'
import fs from 'fs'
import https from 'https'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'
import passport from 'passport'
import mongoose from 'mongoose'
import setUpPassport from './setuppassport'
import routes from './routes'
import { Server } from 'http'

const HTTPS_PORT = 4333
const HTTP_PORT = 8081

// eslint-disable-next-line no-void
void mongoose.connect('mongodb://mongo:27017/express_ts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

const app: Application = express()
setUpPassport()
app.set('port', process.env.PORT != null ? process.env.PORT : 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: 'TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.get('/user-agent', (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'] !== null ?
    req.headers['user-agent'] : 'none'

  if (req.accepts('html') === 'html') {
    res.render('user-agent', { userAgent })
  } else {
    res.type('text')
    res.send(userAgent)
  }
})

export const server: Server = app.listen(
  HTTP_PORT,
  () => console.log(`HTTP server listening on port ${HTTP_PORT}`)
)

https.createServer({
  key: fs.readFileSync(path.resolve(__dirname, '../ssl/private.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../ssl/certificate.crt'))
}, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}...`)
})

export default app
