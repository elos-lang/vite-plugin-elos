# vite-plugin-elos
The Vite plugin for [ELOS](https://github.com/elos-lang/elos) (Language to create HTML emails)

### Install the plugin
```bash
npm install vite-plugin-elos
```

### Add the plugin to your vite.config.js
```js
import { defineConfig } from 'vite';
import elos from 'vite-plugin-elos';

export default defineConfig({
    plugins: [
        elos()
    ]
});
```