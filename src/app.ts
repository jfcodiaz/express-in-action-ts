import express, { Application, Request, Response } from 'express'
import path from 'path'

const app: Application = express()
const staticPath = path.join(__dirname, './../public')

app.use(express.static(staticPath))

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express and TypeScript')
})

app.listen(3001, () => console.log('Server Liste 30001'))
