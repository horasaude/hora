/** Sai do site (link de pagamento). Separado para os testes conseguirem observar. */
export function irPara(url: string): void {
  window.location.assign(url)
}
