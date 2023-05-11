[![cover][cover-src]][cover-href]
[![npm version][npm-version-src]][npm-version-href] 
[![npm downloads][npm-downloads-src]][npm-downloads-href] 
[![bundle][bundle-src]][bundle-href] 
[![License][license-src]][license-href]

# ⚙️ Configerium

> 🔮🛠️ Unleash the power of configuration with Configerium! This state-of-the-art package eliminates the hassle of loading and managing configurations in your projects. With its intelligent capabilities and user-friendly API, you can effortlessly handle various configuration files and environments. 💡🚀 Elevate your application's configuration process with ease and precision using Configerium!

## 🌟 Features

📂 JSON, CJS, TypeScript, and ESM config loader with [nyxblabs/dynot](https://github.com/nyxblabs/dynot)
🎛️ RC config support with [nyxblabs/configorium](https://github.com/nyxblabs/configorium)
🔗 Multiple sources merged with [nyxblabs/CodeBoost/nyxdefaults](https://github.com/nyxblabs/CodeBoost/tree/main/packages/nyxdefaults)
🌍 `.env` support with [dotenv](https://www.npmjs.com/package/dotenv)
📦 Reads config from the nearest `package.json` file
🧩 [Extends configurations](https://github.com/unjs/configerium#extending-configuration) from multiple local or git sources
🔄 Overwrite with [environment-specific configuration](#environment-specific-configuration)
👀 Config watcher with auto-reload and HMR support

## 🚀 Usage

Install:

```sh
# nyxi 
nyxi configerium

# pnpm
pnpm install configerium

# npm
npm install configerium

# yarn
yarn add configerium
```

Import:

```ts
// ESM
import { loadConfig, watchConfig } from "configerium";

// CommonJS
const { loadConfig, watchConfig } = require("configerium");
```

Load configuration:

```ts
// Get loaded config
const { config } = await loadConfig({});

// Get resolved config and extended layers
const { config, configFile, layers } = await loadConfig({});
```

## 📜 Loading priority

Configerium merges config sources with [nyxblabs/CodeBoost/nyxdefaults](https://github.com/nyxblabs/CodeBoost/tree/main/packages/nyxdefaults) in the following order:

1️⃣ Config overrides passed by options
2️⃣ Config file in CWD
3️⃣ RC file in CWD
4️⃣ Global RC file in the user's home directory
5️⃣ Config from `package.json`
6️⃣ Default config passed by options
7️⃣ Extended config layers

## ⚙️ Options

### `cwd`

Resolve configuration from this working directory. The default is `process.cwd()`

### `name`

Configuration base name. The default is `config`.

### `configName`

Configuration file name without extension. Default is generated from `name` (name=foo => `foo.config`).

Set to `false` to avoid loading the config file.

### `rcFile`

RC Config file name. Default is generated from `name` (name=foo => `.foorc`).

Set to `false` to disable loading RC config.

### `globalRC`

Load RC config from the workspace directory and the user's home directory. Only enabled when `rcFile` is provided. Set to `false` to disable this functionality.

### `dotenv`

Loads `.env` file if enabled. It is disabled by default.

### `packageJson`

Loads config from nearest `package.json` file. It is disabled by default.

If `true` value is passed, Configerium uses `name` field from `package.json`.

You can also pass either a string or an array of strings as a value to use those fields.

### `defaults`

Specify default configuration. It has the **lowest** priority and is applied **after extending** config.

### `defaultConfig`

Specify default configuration. It is applied **before** extending config.

### `overrides`

Specify override configuration. It has the **highest** priority and is applied **before extending** config.

### `dynot`

Custom [nyxblabs/dynot](https://github.com/nyxblabs/dynot) instance used to import configuration files.

### `dynotOptions`

Custom [nyxblabs/dynot](https://github.com/nyxblabs/dynot) options to import configuration files.

### `envName`

Environment name used for [environment specific configuration](#environment-specific-configuration).

The default is `process.env.NODE_ENV`. You can set `envName` to `false` or an empty string to disable the feature.

## 🧩 Extending configuration

If resolved config contains an `extends` key, it will be used to extend the configuration.

Extending can be nested, and each layer can extend from one base or more.

The final config is the merged result of extended options and user options with [nyxblabs/CodeBoost/nyxdefaults](https://github.com/nyxblabs/CodeBoost/tree/main/packages/nyxdefaults).

Each item in `extends` is a string that can be either an absolute or relative path to the current config file pointing to a config file for extending or the directory containing the config file.
If it starts with either `github:`, `gitlab:`, `bitbucket:`, or `https:`, Configerium automatically clones it.

For custom merging strategies, you can directly access each layer with the `layers` property.

**Example:**

```ts
// config.ts
export default {
  colors: {
    primary: "user_primary",
  },
  extends: ["./theme"],
};
```

```ts
// config.dev.ts
export default {
  dev: true,
};
```

```ts
// theme/config.ts
export default {
  extends: "../base",
  colors: {
    primary: "theme_primary",
    secondary: "theme_secondary",
  },
};
```

```ts
// base/config.ts
export default {
  colors: {
    primary: 'base_primary',
    text: 'base_text'
  }
}
```

The loaded configuration would look like this:

```ts
{
  dev: true,
  colors: {
    primary: 'user_primary',
    secondary: 'theme_secondary',
    text: 'base_text'
  }
}
```

Layers:

```ts
[
 { config: /* theme config */, configFile: /* path/to/theme/config.ts */, cwd: /* path/to/theme */ },
 { config: /* base  config */, configFile: /* path/to/base/config.ts  */, cwd: /* path/to/base */ },
 { config: /* dev   config */, configFile: /* path/to/config.dev.ts  */, cwd: /* path/ */ },
]
```

## 🌍 Environment-specific configuration

Users can define environment-specific configuration using these config keys:

- `$test: {...}`
- `$development: {...}`
- `$production: {...}`
- `$env: { [env]: {...} }`

configerium tries to match [`envName`](#envname) and override environment config if specified.

**Note:** Environment will be applied when extending each configuration layer. This way layers can provide environment-specific configuration.

**Example:**

```ts
{
  // Default configuration
  logLevel: 'info',

  // Environment overrides
  $test: { logLevel: 'silent' },
  $development: { logLevel: 'warning' },
  $production: { logLevel: 'error' },
  $env: {
    staging: { logLevel: 'debug' }
  }
}
```

## 👁️ Watching Configuration

you can use `watchConfig` instead of `loadConfig` to load config and watch for changes, add and removals in all expected configuration paths and auto reload with new config.

### 🪝 Lifecycle Hooks

- `onWatch`: This function is always called when config is updated, added, or removed before attempting to reload the config.
- `acceptHMR`: By implementing this function, you can compare old and new functions and return `true` if a full reload is not needed.
- `onUpdate`: This function is always called after the new config is updated. If `acceptHMR` returns true, it will be skipped.

```ts
import { watchConfig } from "configerium";

const config = watchConfig({
  cwd: ".",
  // chokidarOptions: {}, // Default is { ignoreInitial: true }
  // debounce: 200 // Default is 100. You can set it to false to disable debounced watcher
  onWatch: (event) => {
    console.log("[watcher]", event.type, event.path);
  },
  acceptHMR({ oldConfig, newConfig, getDiff }) {
    const diff = getDiff();
    if (diff.length === 0) {
      console.log("No config changed detected!");
      return true; // No changes!
    }
  },
  onUpdate({ oldConfig, newConfig, getDiff }) {
    const diff = getDiff();
    console.log("Config updated:\n" + diff.map((i) => i.toJSON()).join("\n"));
  },
});

console.log("watching config files:", config.watchingFiles);
console.log("initial config", config.config);

// Stop watcher when not needed anymore
// await config.unwatch();
```

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `nyxi`
- Run interactive tests using `nyxr dev`

## 📜 License

[MIT](./LICENSE) - Made with 💞

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/configerium?style=flat&colorA=18181B&colorB=14F195
[npm-version-href]: https://npmjs.com/package/configerium
[npm-downloads-src]: https://img.shields.io/npm/dm/configerium?style=flat&colorA=18181B&colorB=14F195
[npm-downloads-href]: https://npmjs.com/package/configerium
[bundle-src]: https://img.shields.io/bundlephobia/minzip/configerium?style=flat&colorA=18181B&colorB=14F195
[bundle-href]: https://bundlephobia.com/result?p=configerium
[license-src]: https://img.shields.io/github/license/nyxblabs/configerium.svg?style=flat&colorA=18181B&colorB=14F195
[license-href]: https://github.com/nyxblabs/configerium/blob/main/LICENSE

<!-- Cover -->
[cover-src]: https://raw.githubusercontent.com/nyxblabs/configerium/main/.github/assets/cover-github-configerium.png
[cover-href]: https://💻nyxb.ws
