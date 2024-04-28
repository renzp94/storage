import { isJson, isString, isUnDef } from '@renzp/utils'

export default {
  get: <T = unknown>(key: string): T | null => {
    const data = window.localStorage.getItem(key)
    return isJson(data) ? JSON.parse(data as string) : data
  },
  set: <T = unknown>(key: string, data: T): void => {
    if (!isUnDef(key) && !isUnDef(data)) {
      const payload = !isString(data) ? JSON.stringify(data) : data
      window.localStorage.setItem(key, payload)
    }
  },
  remove: (key: string): void => window.localStorage.removeItem(key),
}
