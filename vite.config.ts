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
      manifest: {
        name: 'HORA',
        short_name: 'HORA',
        description: 'Comunidade HORA',
        lang: 'pt-BR',
        theme_color: '#2C4C44',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/app',
        scope: '/app/',
        icons: [{ src: '/icone.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})
