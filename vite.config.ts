import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // O service worker cuida só da área da aluna e é registrado por ela (src/lib/pwa.ts).
      // Assim a página de vendas vem sempre da rede e não baixa o app em segundo plano.
      injectRegister: false,
      scope: '/app/',
      // A página do app vem sempre da rede quando há internet (cache só sem conexão).
      // Antes ela vinha do cache e uma versão velha mandava endereços novos para a página de vendas.
      workbox: {
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: { cacheName: 'paginas', networkTimeoutSeconds: 4 },
          },
        ],
      },
      manifest: {
        name: 'ORA',
        short_name: 'ORA',
        description: 'Comunidade ORA',
        lang: 'pt-BR',
        theme_color: '#2C4C44',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/app',
        scope: '/app/',
        icons: [
          { src: '/icone-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icone-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/icone.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})
