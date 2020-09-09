import { Router, Request, Response } from 'express'

const api = Router()

api.get('/timezone', (req: Request, res: Response) => {
  res.send('API 2:Sample response for /timezone')
})

export default api
