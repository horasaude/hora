// Logo do sistema (painel, área da aluna, entrar): a do ORA, a mesma da página de vendas.
// Proporção do SVG: 1919 x 785. A altura sai da largura, então a logo nunca estica.

const PROPORCAO = 785 / 1919

type Props = { largura: number; clara?: boolean; className?: string }

/** clara: versão para fundo verde (logo-ora-clara.svg); senão, para fundo branco (logo-ora.svg). */
export function LogoOra({ largura, clara = false, className = '' }: Props) {
  return (
    <img
      src={clara ? '/logo-ora-clara.svg' : '/logo-ora.svg'}
      alt="ORA"
      width={largura}
      height={Math.round(largura * PROPORCAO)}
      style={{ width: largura, height: 'auto' }}
      className={`block max-w-none ${className}`}
    />
  )
}
