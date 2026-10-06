// Logo da HORA no sistema (painel, área da aluna, entrar). A página de vendas usa a logo do ORA.
// Proporção do SVG: 2385 x 785. A altura sai da largura, então a logo nunca estica.

const PROPORCAO = 785 / 2385

type Props = { largura: number; clara?: boolean; className?: string }

/**
 * clara: para fundo verde. O arquivo logo-hora-clara.svg veio na mesma cor verde da escura,
 * então o filtro deixa a imagem branca; com um arquivo claro de verdade, o filtro pode sair.
 */
export function LogoHora({ largura, clara = false, className = '' }: Props) {
  return (
    <img
      src={clara ? '/logo-hora-clara.svg' : '/logo-hora.svg'}
      alt="HORA"
      width={largura}
      height={Math.round(largura * PROPORCAO)}
      style={{ width: largura, height: 'auto' }}
      className={`block max-w-none ${clara ? 'brightness-0 invert' : ''} ${className}`}
    />
  )
}
