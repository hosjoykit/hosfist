/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import './dayjs'

// Types
import type { App } from 'vue'


const initVersion = () => {
  const _version = localStorage.getItem('hosmora_version')
  if (!_version) {
    localStorage.setItem('hosmora_version', '1.0.0')
  }
}

initVersion()



export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
