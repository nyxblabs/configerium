import { fileURLToPath } from 'node:url'
import consolji from 'consolji'
import { watchConfig } from '../src'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

async function main() {
   const fixtureDir = r('../test/fixture')
   const config = await watchConfig({
      cwd: fixtureDir,
      dotenv: true,
      packageJson: ['configerium', 'configerium-alt'],
      globalRc: true,
      envName: 'test',
      extend: {
         extendKey: ['theme', 'extends'],
      },
      onWatch: (event) => {
         consolji.log('[watcher]', event.type, event.path)
      },
      acceptHMR({ oldConfig, newConfig, getDiff }) {
         const diff = getDiff()
         if (diff.length === 0) {
            consolji.log('No config changed detected!')
            return true // No changes!
         }
      },
      onUpdate({ oldConfig, newConfig, getDiff }) {
         const diff = getDiff()
         consolji.log(`Config updated:\n${diff.map(i => i.toJSON()).join('\n')}`)
      },
   })
   consolji.log('watching config files:', config.watchingFiles)
   consolji.log('initial config', config.config)
}

main().catch(console.error)
