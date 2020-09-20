import capitalize from './../src/libs/capitalize'
import { expect } from 'chai'

describe('capitalize', () => {
  it('capitalizes single words', (): void => {
    expect(capitalize('express')).to.equal('Express')
    expect(capitalize('cats')).to.equals('Cats')
  })

  it('makes the rest of the string lowercase', (): void => {
    expect(capitalize('javaScript')).to.equal('Javascript')
  })

  it('leaves empty strings alone', (): void => {
    expect(capitalize('')).to.equal('')
  })

  it('leaves strings with no words alone', (): void => {
    expect(capitalize(' ')).to.equal(' ')
    expect(capitalize('123')).to.equal('123')
  })

  it('capitalizes multiple-word strings', (): void => {
    expect(capitalize('what is Express?')).to.equal('What is express?')
    expect(capitalize('i love lamp')).to.equal('I love lamp')
  })

  it('leaves already-capitalized words alone', (): void => {
    expect(capitalize('Express')).to.equal('Express')
    expect(capitalize('Evan')).to.equal('Evan')
    expect(capitalize('Catman')).to.equal('Catman')
  })

  it('capitalizes String objects without changing their values', (): void => {
    // eslint-disable-next-line no-new-wrappers
    const str = new String('who is JavaScript?')
    expect(capitalize(str)).to.equal('Who is javascript?')
    expect(str.valueOf()).to.equal('who is JavaScript?')
  })

  it('throws an error if passed a number', (): void => {
    expect(() => capitalize(123)).to.throw(Error)
  })

  it('changes the value', (): void => {
    expect(capitalize('foo')).not.to.equal('foo')
  })
})
