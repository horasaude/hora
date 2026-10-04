import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    env: {
      VITE_SUPABASE_URL: 'http://teste.local',
      VITE_SUPABASE_ANON_KEY: 'teste',
      VITE_MP_LINK_PIX: 'https://mp.teste/pix',
      VITE_MP_LINK_PARCELADO: 'https://mp.teste/parcelado',
      VITE_MP_LINK_RECORRENTE: 'https://mp.teste/recorrente',
    },
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'supabase/functions/**/*.test.ts'],
  },
})
