import express, { Application, Request, Response, NextFunction } from 'express'
import path from 'path'

const app: Application = express()
const staticPath = path.join(__dirname, './../public')

app.use(express.static(staticPath))

app.get('/', (req: Request, res: Response) => {
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

app.listen(3001, () => console.log('Server Liste 30001'))
