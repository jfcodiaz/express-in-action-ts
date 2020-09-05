import express, { Application, Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'
import https from 'https'
import zipdb from 'zippity-do-dah'
import weather from 'openweather-apis'

const HTTPS_PORT = 4433
const HTTP_PORT = 8081

const app: Application = express()
const staticPath = path.join(__dirname, './../public')

interface zipCodeInterface {
  latitude?: string
  longitude?: string
}

app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(staticPath))

app.get('/', (req: Request, res: Response) => {
  res.render('index')
})

app.get(/^\/(\d{5})$/, function (req: Request, res: Response, next: NextFunction) {
  const zipCode = req.params[0]
  const zipCodeInfo: zipCodeInterface = zipdb.zipcode(zipCode)
  if (zipCodeInfo.latitude === undefined) {
    next()
    return
  }
  weather.setAPPID('604a4b703aea0c3ef8228659beafb8e0')
  weather.setCoordinate(zipCodeInfo.latitude, zipCodeInfo.longitude)
  weather.getTemperature((_err: any, temp: object) => {
    if (_err !== null) {
      next()
      return
    }
    res.json({
      zipcode: zipCode,
      temperature: temp
    })
  })
})

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404)
  res.send('404')
})

app.listen(HTTP_PORT, () => console.log(`HTTP server listening on port ${HTTP_PORT}`))

https.createServer({
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt')
}, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}...`)
})
