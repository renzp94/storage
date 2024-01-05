import { expect, test } from 'bun:test'
import storage from '../src/index'

const USER_INFO = 'TEST_USER_INFO'
const TOKEN = 'TEST_TOKEN'

const testUserInfo = {
  name: 'renzp94',
  github: 'https://github.com/renzp94',
  bio: '我，象征着，不可理喻的偏执',
}
const testToken = 'https://github.com/renzp94'

test('set storage', () => {
  storage.set(USER_INFO, testUserInfo)
  const userInfo = window.localStorage.getItem(USER_INFO)
  expect(userInfo).toEqual(JSON.stringify(testUserInfo))
})

test('get storage', () => {
  const userInfo = storage.get(USER_INFO)
  expect(userInfo).toEqual(testUserInfo)
})

test('remove', () => {
  storage.set(USER_INFO, testUserInfo)
  storage.set(TOKEN, testToken)
  storage.remove(USER_INFO)
  const userInfo = storage.get(USER_INFO)
  expect(userInfo).toBeNull()
  const token = storage.get(TOKEN)
  expect(token).toEqual(testToken)
})
