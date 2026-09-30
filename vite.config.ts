import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// The Vite entry is app.html so the repository root index.html can hold the
// deployed single-file build that GitHub Pages serves.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-app-html-at-root',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const [pathname] = (req.url || '/').split('?')
          if (pathname === '/' || pathname === '/index.html') {
            req.url = '/app.html' + (req.url || '').slice(pathname.length)
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
