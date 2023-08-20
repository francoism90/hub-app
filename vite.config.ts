import { defineConfig } from 'vite'
import { readFileSync } from 'fs'
import { fileURLToPath, URL } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgLoader(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 4194304,
        navigateFallbackDenylist: [/\/[api,vod]+\/.*/],
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}']
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        id: 'Hub',
        name: 'Hub',
        short_name: 'Hub',
        description: 'Hub',
        theme_color: '#39336c',
        background_color: '#39336c',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    https: {
      cert: readFileSync('/run/secrets/cert.pem'),
      key: readFileSync('/run/secrets/key.pem')
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./node_modules', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1024,
    sourcemap: process.env.SOURCE_MAP === 'true',
    rollupOptions: {
      output: {
        manualChunks: {
          fonts: ['@fontsource-variable/inter', '@fontsource-variable/montserrat'],
          player: ['shaka-player', 'shaka-player/dist/shaka-player.ui'],
          utils: ['axios', 'dayjs', 'laravel-precognition-vue', 'numbro', 'pino', 'qs'],
          ws: ['laravel-echo', 'pusher-js']
        }
      }
    }
  }
})
