/**
 * Movimento ao rolar: elementos com data-revelar sobem e aparecem quando entram na tela.
 * Sem IntersectionObserver (navegador antigo, testes), tudo aparece de uma vez.
 */
export function iniciarRevelar(raiz: ParentNode = document): () => void {
  const alvos = [...raiz.querySelectorAll<HTMLElement>('[data-revelar]')]
  if (typeof IntersectionObserver === 'undefined') {
    alvos.forEach((a) => a.classList.add('revelado'))
    return () => {}
  }
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue
        e.target.classList.add('revelado')
        observador.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  )
  alvos.forEach((a) => observador.observe(a))
  return () => observador.disconnect()
}
