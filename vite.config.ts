import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Served from the /automotive_web/ path on GitHub Pages, so the base matches
// that prefix and every emitted URL is absolute under it.
const BASE = '/automotive_web/'

// The Vite entry is app.html so the repository root index.html can hold the
// deployed single-file build that GitHub Pages serves.
export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-app-html-at-root',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const [pathname] = (req.url || '/').split('?')
          const query = (req.url || '').slice(pathname.length)
          if ([BASE, `${BASE}index.html`, '/', '/index.html'].includes(pathname)) {
            req.url = `${BASE}app.html${query}`
          }
          next()
        })
      },
    },
  ],
  build: {
    rollupOptions: {
      input: fileURLToPath(new URL('./app.html', import.meta.url)),
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
