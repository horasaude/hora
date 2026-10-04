/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_MP_LINK_PIX?: string
  readonly VITE_MP_LINK_PARCELADO?: string
  readonly VITE_MP_LINK_RECORRENTE?: string
  readonly VITE_WHATSAPP_NUMERO?: string
}
