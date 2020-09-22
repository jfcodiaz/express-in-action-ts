/* eslint-disable @typescript-eslint/no-floating-promises */
import app from './../../src/app'
import supertest, { Response, Test } from 'supertest'
import { Done } from 'mocha'

describe('plain text response', (): void => {
  let request: Test
  beforeEach((): void => {
    request = supertest(app)
      .get('/user-agent')
      .set('User-Agent', 'My cool browser')
      .set('Accept', 'text/plain')
  })

  it('returns a plain text response', (done: Done) => {
    request.expect('Content-Type', /text\/plain/)
      .expect(200)
      .end(done)
  })

  it('returns your User Agent', (done: Done): void => {
    request.expect((res: Response): void => {
      if (res.text !== 'My cool browser') {
        throw new Error('Response does not contain User Agent')
      }
    }).end(done)
  })
})
