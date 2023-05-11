import { fileURLToPath } from 'node:url'
import consolji from 'consolji'
import { loadConfig } from '../src'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

async function main() {
   const fixtureDir = r('../test/fixture')
   const config = await loadConfig({ cwd: fixtureDir, dotenv: true })
   consolji.log(config)
}

main().catch(console.error)
