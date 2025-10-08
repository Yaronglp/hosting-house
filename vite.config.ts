import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  // Use /hosting-house/ for GitHub Pages, / for dev
  const base = isProduction ? '/hosting-house/' : '/'
  
  return {
    base,
    server: {
      watch: {
        ignored: ['**/tsconfig.tsbuildinfo', '**/node_modules/**']
      }
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'generateSW',
        workbox: {
          navigateFallbackDenylist: [/^\/api\//],
        },
        manifest: {
          name: 'בית מארח',
          short_name: 'בית מארח',
          description: 'תכנון והגרלת סבבים לבית מארח',
          lang: 'he',
          dir: 'rtl',
          start_url: base,
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#111827',
          icons: [
            { src: `${base}icons/house192.png`, sizes: '192x192', type: 'image/png' },
            { src: `${base}icons/house512.png`, sizes: '512x512', type: 'image/png' },
            { src: `${base}icons/house512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
  }
})
