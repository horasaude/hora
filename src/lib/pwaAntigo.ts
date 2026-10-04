/**
 * Remove o service worker antigo, registrado com escopo "/" antes da página de vendas.
 * Ele guardava o index.html e podia mostrar uma versão velha de "/" depois de um deploy.
 */
export async function removerPwaAntigo() {
  if (!('serviceWorker' in navigator)) return
  const registros = await navigator.serviceWorker.getRegistrations()
  await Promise.all(
    registros.filter((r) => new URL(r.scope).pathname === '/').map((r) => r.unregister()),
  )
}
