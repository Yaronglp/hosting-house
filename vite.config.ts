import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isTest = mode === 'test' || process.env.NODE_ENV === 'test'
  
  return {
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
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#111827',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
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
