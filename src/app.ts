import express, { Application, Request, Response } from 'express'
import fs from 'fs'
import https from 'https'

const HTTPS_PORT = 4433
const HTTP_PORT = 8081

const app: Application = express()

app.get('/random/:min/:max', (req: Request, res: Response) => {
  const min = parseInt(req.params.min)
  const max = parseInt(req.params.max)
  if (isNaN(min) || isNaN(max)) {
    res.status(400)
    res.json({ error: 'Bad request.' })
    return
  }
  const result = Math.round((Math.random() * (max - min)) + min)
  res.json({
    result
  })
})

app.listen(HTTP_PORT, () => console.log(`HTTP server listening on port ${HTTP_PORT}`))

https.createServer({
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt')
}, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}...`)
})
