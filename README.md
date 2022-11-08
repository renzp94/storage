# storage

storage helper

# 使用

```ts
import storage from '@renzp/storage'

const token = 'WEB_TOKEN'

// 设置值
storage.set(token, 'UwhbBh1qzxHXMetSIRI3mQ1X')
// 获取值
const test = storage.get<string>(token)
// 清除值
storage.remove(token)
```