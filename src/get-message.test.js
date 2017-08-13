import * as assert from 'assert'
import getMessage from './get-message'

describe('get-message', function () {
  it('should return Hello World2!', function () {
    assert.strictEqual(getMessage(), 'Hello World2!')
  })
})
