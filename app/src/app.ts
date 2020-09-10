import express, { Application } from 'express'
import fs from 'fs'
import https from 'https'
import ApiV1 from './api-v1'
import ApiV2 from './api-v2'

const HTTPS_PORT = 4333
const HTTP_PORT = 8081

const app: Application = express()

app.use('/v1', ApiV1)

app.use('/v2', ApiV2)

app.listen(HTTP_PORT, () => console.log(`HTTP server listening on port ${HTTP_PORT}`))

https.createServer({
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt')
}, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}...`)
})
