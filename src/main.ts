import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const head = createHead()

// Plugins
app.use(router)
app.use(head)

// Mount app
app.mount('#app')

// Service Worker
registerSW({
  immediate: true,
  onRegistered(r) {
    r &&
      setInterval(
        () => {
          r.update()
        },
        60 * 10 * 1000
      )
  }
})
