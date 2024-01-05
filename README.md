<p align="center"><a href="https://github.com/renzp94/storage" target="_blank" rel="noopener noreferrer"><img width="200" src="./logo.png" alt="storage logo"></a></p>
<p align="center">
  <a href="https://codecov.io/github/@renzp/storage"><img src="https://img.shields.io/codecov/c/github/@renzp/storage.svg?sanitize=true" alt="Coverage Status"></a>
  <a href="https://npmcharts.com/compare/@renzp/storage?minimal=true"><img src="https://img.shields.io/npm/dm/@renzp/storage.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@renzp/storage"><img src="https://img.shields.io/npm/v/@renzp/storage.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@renzp/storage"><img src="https://img.shields.io/bundlejs/size/@renzp/storage?sanitize=true" alt="size"></a>
  <a href="https://www.npmjs.com/package/@renzp/storage"><img src="https://img.shields.io/npm/l/@renzp/storage.svg?sanitize=true" alt="License"></a>
</p>
<p align="center">
  <a href="https://github.com/renzp94/storage/watchers"><img src="https://img.shields.io/github/watchers/renzp94/storage.svg?style=social" alt="watchers"></a>
  <a href="https://github.com/renzp94/storage/stars"><img src="https://img.shields.io/github/stars/renzp94/storage.svg?style=social" alt="stars"></a>
</p>

# storage

一款零依赖、快速灵活、简单易用的localStorage API库

## 安装

```sh
npm install @renzp/storage
```

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