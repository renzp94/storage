import { build } from './common'

const result = await build()

if (result.success) {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('📦 打包成功 🎉🎉🎉')
} else {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('📦 打包失败 🚨\n')
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(result.logs)
}
