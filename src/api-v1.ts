import { Router, Request, Response } from 'express'

const api = Router()

api.get('/timezone', (req: Request, res: Response) => {
  res.send('Sample response for /timezone')
})

api.get('/all_timezone', (req: Request, res: Response) => {
  res.send('Sample response for /all_timezones')
})

export default api
