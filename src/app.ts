import express, { Application, Request, Response } from 'express'

const app: Application = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express and TypeScript')
})

app.listen(3001, () => console.log('Server Liste 30001'))
