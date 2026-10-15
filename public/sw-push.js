// Notificações do ORA (lembrete de água). Importado pelo service worker gerado pelo vite-plugin-pwa.
self.addEventListener('push', (evento) => {
  let dados = { title: 'ORA', body: '', url: '/app' }
  try {
    dados = { ...dados, ...evento.data.json() }
  } catch {
    dados.body = evento.data ? evento.data.text() : ''
  }
  evento.waitUntil(
    self.registration.showNotification(dados.title, {
      body: dados.body,
      icon: '/icone-192.png',
      badge: '/icone-192.png',
      tag: 'lembrete-agua',
      renotify: true,
      data: { url: dados.url },
    }),
  )
})

self.addEventListener('notificationclick', (evento) => {
  evento.notification.close()
  const url = (evento.notification.data && evento.notification.data.url) || '/app'
  evento.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((janelas) => {
      const aberta = janelas.find((j) => j.url.includes('/app'))
      if (aberta) return aberta.focus().then(() => aberta.navigate(url))
      return self.clients.openWindow(url)
    }),
  )
})
