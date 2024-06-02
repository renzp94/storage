import { exists, readdir, unlink } from 'node:fs/promises'
import path from 'node:path'
import dts from 'bun-plugin-dts'

/**
 * 删除dist 目录
 */
export const rmDist = async (outDir: string) => {
  const hasDist = await exists(outDir)
  if (hasDist) {
    const distFiles = await readdir(outDir)
    const rmFiles = distFiles.map((file) => {
      return unlink(`${outDir}/${file}`)
    })

    await Promise.all(rmFiles)
  }
}

/**
 * 获取入口文件
 */
const getEntrypoints = async () => {
  const files = await readdir('./src')
  const entrypoints = files
    .filter((file) => !file.includes('_'))
    .map((file) => `./src/${file}`)

  return entrypoints
}

/**
 * 打包
 */
export const build = async () => {
  const outDir = './lib'
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('📦 打包中...')
  await rmDist(outDir)
  const entrypoints = await getEntrypoints()
  return await Bun.build({
    entrypoints,
    outdir: outDir,
    naming: '[name].[ext]',
    splitting: true,
    minify: true,
    format: 'esm',
    plugins: [dts()],
  })
}

/**
 * npm发布
 */
export const npmPublish = async () => {
  await Bun.$`bunx standard-version`
  await Bun.$`npm publish`
}

/**
 * 获取jsr导出路径
 */
const getExports = async () => {
  const files = await readdir('./src')
  const exports = files
    .filter((file) => !file.includes('_'))
    .reduce((prev, file) => {
      if (file === 'index.ts') {
        return { ...prev, '.': './src/index.ts' }
      }

      return {
        ...prev,
        [`./${file.replace('.ts', '')}`]: `./src/${file}`,
      }
    }, {})

  return exports
}

/**
 * jsr发布
 *
 */
export const jsrPublish = async () => {
  const pkg = await Bun.file('./package.json').json()
  const hasJsrJson = await exists('./jsr.json')
  const jsr = hasJsrJson ? await Bun.file('./jsr.json').json() : {}

  if (jsr.version === pkg.version) {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('无新版本发布')
    return
  }

  const exports = await getExports()
  const jsrConfig = {
    name: pkg.name,
    version: pkg.version,
    exports,
  }

  await Bun.write('./jsr.json', JSON.stringify(jsrConfig, null, 2))
  await Bun.$`bunx jsr publish --allow-dirty`
  await Bun.$`git add jsr.json`
  await Bun.$`git commit -m "chore(jsr:${jsrConfig.version}): published"`
}

export interface CoverageOptions {
  label?: string
  tagConfigs?: Array<{ ratio: number; color: string }>
  outDir?: string
}

export const coverage = async (options?: CoverageOptions): Promise<boolean> => {
  const {
    label = 'coverage',
    tagConfigs = [
      { ratio: 0, color: '#ffc245' },
      { ratio: 50, color: '#ffc245' },
      { ratio: 90, color: '#00c48c' },
    ],
    outDir = process.cwd(),
  } = options ?? {}

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="104" height="20">
  <script/>
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="60" height="20" fill="#555"/>
  <rect rx="3" x="50" width="54" height="20" fill="@color@"/>
  <path fill="@color@" d="M64 0h4v20h-4z"/>
  <rect rx="0" x="5" width="50" height="20" fill="#555"/>
  <rect rx="3" width="104" height="20" fill="url(#a)"/>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="27" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="27" y="14">${label}</text>
    <text x="80" y="15" fill="#010101" fill-opacity=".3">@ratio@</text>
    <text x="80" y="14">@ratio@</text>
  </g>
</svg>
`.trim()
  try {
    const result = await Bun.$`bun test --coverage`
    const text = result.stderr.toString()
    const lines = text.trim().split('\n')
    // 获取All files行
    const line = lines.find((line) => line.includes('All files'))
    if (!line) {
      throw new Error('未找到All files行')
    }

    // 截取覆盖率(以Lines为准)
    const ratio = Number(
      line.split('|')[2].trim().split(' ')[0].replace('%', ''),
    )
    if (ratio > 100 || ratio < 0) {
      throw new Error('覆盖率范围为0~100')
    }

    const ratioTarget = tagConfigs
      .sort((a, b) => b.ratio - a.ratio)
      .find((item) => ratio >= item.ratio)

    const badge = svg
      .replace(/@ratio@/g, `${ratio}%`)
      .replace(/@color@/g, ratioTarget?.color ?? '555')

    await Bun.write(path.resolve(outDir, `${label}.svg`), badge)
    let lineIndex = lines.findIndex((line) => line.includes('All files'))
    let endIndex = lines.findIndex((line) => line.includes('tests across'))

    if (lineIndex > -1) {
      lineIndex = lineIndex - 2
    }

    if (endIndex > -1) {
      endIndex = endIndex - 5
    }

    let md = `# ${label}\n\n`

    md += lines.slice(lineIndex, endIndex).join('\n')
    await Bun.write(path.resolve(outDir, `${label}.md`), md)
    return true
  } catch {
    return false
  }
}
