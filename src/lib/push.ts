// Notificações no celular (Web Push). A chave pública é pública por natureza; a privada fica no Supabase.

const VAPID_PUBLICA =
  'BNO9q7Iwa0DPfwgRZ49y0EX9Ke8yhqQffRceKtH4Z8Fo3a4I1wDZc3drzIRH72IsODncz5uCJm1s9AreDfdVF6I'

export type InscricaoPush = { endpoint: string; p256dh: string; auth: string }

export const suportaPush = () =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window

/** iPhone só recebe notificação com o ORA instalado na tela de início. */
export function precisaInstalarNoIphone(): boolean {
  const iphone = /iPhone|iPad|iPod/.test(navigator.userAgent)
  const instalado =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iphone && !instalado
}

const chave = (base64: string) => {
  const b = atob(
    base64.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (base64.length % 4)) % 4),
  )
  return Uint8Array.from(b, (c) => c.charCodeAt(0))
}

/** Inscrição atual deste aparelho, se houver. */
export async function inscricaoAtual(): Promise<InscricaoPush | null> {
  if (!suportaPush()) return null
  const reg = await navigator.serviceWorker.getRegistration('/app/')
  const sub = await reg?.pushManager.getSubscription()
  return sub ? paraInscricao(sub) : null
}

function paraInscricao(sub: PushSubscription): InscricaoPush {
  const j = sub.toJSON()
  return { endpoint: sub.endpoint, p256dh: j.keys?.p256dh ?? '', auth: j.keys?.auth ?? '' }
}

/** Pede permissão e inscreve este aparelho; devolve null se ela não permitir. */
export async function inscreverAparelho(): Promise<InscricaoPush | null> {
  if (!suportaPush()) return null
  if ((await Notification.requestPermission()) !== 'granted') return null
  const reg =
    (await navigator.serviceWorker.getRegistration('/app/')) ??
    (await navigator.serviceWorker.ready)
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: chave(VAPID_PUBLICA),
    }))
  return paraInscricao(sub)
}

/** Cancela a inscrição deste aparelho. */
export async function desinscreverAparelho(): Promise<string | null> {
  const reg = await navigator.serviceWorker.getRegistration('/app/')
  const sub = await reg?.pushManager.getSubscription()
  if (!sub) return null
  await sub.unsubscribe()
  return sub.endpoint
}
