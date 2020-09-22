import hello from '../../src/libs/hello'
import { expect } from 'chai'

describe('Hello Mocha and chai with TS! ', (): void => {
  it('should return hello world', () => {
    const result = hello()
    expect(result).to.equal('Hello Mocha and chai with TS!')
  })
})
