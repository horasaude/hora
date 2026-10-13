import { Carregando, ErroCarregar, Vazio } from '@/components/ui'
import { textos } from '../textos'

type Props = { tipo: 'carregando' | 'erro' | 'vazio'; texto?: string; tentar?: () => void }

/** Estados da tela: carregando, erro com tentar de novo e vazio. */
export function Estado({ tipo, texto, tentar }: Props) {
  if (tipo === 'carregando') return <Carregando texto={textos.estados.carregando} blocos={2} />
  if (tipo === 'erro')
    return (
      <ErroCarregar
        texto={textos.estados.erro}
        tentar={textos.estados.tentar}
        aoTentar={tentar ?? (() => undefined)}
      />
    )
  return <Vazio>{texto}</Vazio>
}
