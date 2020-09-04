import express, { Application, Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'
import https from 'https'
import zipdb from 'zippity-do-dah'

const HTTPS_PORT = 4433
const HTTP_PORT = 8081

const app: Application = express()
const staticPath = path.join(__dirname, './../public')

app.use(express.static(staticPath))

app.get('/', (req: Request, res: Response) => {
  console.log(zipdb.zipcode(87110))
  res.send('Hello Express and TypeScript')
})

app.get('/error', (req: Request, res: Response, next: NextFunction) => {
  const logo = path.join(staticPath, 'logo.png')
  res.sendFile(logo, function (error: Error) {
    if (error !== null) {
      next(new Error('Error sending file!'))
    }
  })
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('We have a error : ', error)
  next(error)
})

// eslint-disable-next-line handle-callback-err
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500)
  res.send('We have a error')
})

app.listen(HTTP_PORT, () => console.log(`HTTP server listening on port ${HTTP_PORT}`))

https.createServer({
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt')
}, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}...`)
})
