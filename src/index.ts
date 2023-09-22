const isUndef = (v: unknown) => v === undefined || v === null

export default {
  get: <T = unknown>(key: string): T => {
    const data: string | null = window.localStorage.getItem(key)
    try {
      return data === null ? data : JSON.parse(data)
    } catch {
      return data as T
    }
  },
  set: (key: string, data: unknown): void => {
    if (!isUndef(key) && !isUndef(data)) {
      let payload = data as string

      if (typeof data !== 'string') {
        payload = JSON.stringify(data)
      }

      window.localStorage.setItem(key, payload)
    }
  },
  remove: (key: string): void => window.localStorage.removeItem(key),
}
