import express, { Application, Request, Response } from 'express'
import fs from 'fs'
import https from 'https'

const HTTPS_PORT = 4433
const HTTP_PORT = 8081

const app: Application = express()

app.get('/', (req: Request, res: Response) => {
  res.send('You jus sent a GET request, friend')
})

app.post('/', (req: Request, res: Response) => {
  res.send('A POST request? nice!')
})

app.put('/', (req: Request, res: Response) => {
  res.send('I don\'t see a lot of PUT requests anymore')
})

app.delete('/', (req: Request, res: Response) => {
  res.send('hoy my, a DELETE')
})

app.listen(HTTP_PORT, () => console.log(`HTTP server listening on port ${HTTP_PORT}`))

https.createServer({
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt')
}, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}...`)
})
