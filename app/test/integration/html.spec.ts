/* eslint-disable @typescript-eslint/no-floating-promises */
import app from './../../src/app'
import supertest, { Response, Test } from 'supertest'
import { Done } from 'mocha'
import cheerio from 'cheerio'

describe('html response', (): void => {
  let request: Test
  beforeEach((): void => {
    request = supertest(app)
      .get('/user-agent')
      .set('User-Agent', 'A cool browser')
      .set('Accept', 'text/html')
  })

  it('returns an HTML response', (done: Done) => {
    request
      .expect('Content-type', /html/)
      .expect(200)
      .end(done)
  })

  it('returns your User Agent', (done: Done) => {
    request
      .expect((res: Response) => {
        const htmlResponse = res.text
        const $ = cheerio.load(htmlResponse)
        const userAgent = ($('.user-agent').html() as string).trim()
        if (userAgent !== 'A cool browser') {
          throw new Error('User Agent not found')
        }
      })
      .end(done)
  })
})
