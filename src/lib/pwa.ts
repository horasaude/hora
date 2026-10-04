import { registerSW } from 'virtual:pwa-register'

/** Registra o service worker da área da aluna. O escopo /app/ vem do vite.config.ts. */
export function registrarPwa() {
  if ('serviceWorker' in navigator) registerSW({ immediate: true })
}
