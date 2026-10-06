import { Quadro, type Numero } from '../components/Quadro'
import { Tabela } from '../components/Tabela'
import { textos } from '../textos'

export type ModuloVazio = 'pontos' | 'forum' | 'financeiro' | 'loja'

const TONS: Numero['tom'][] = ['salvia', 'ocre', 'terracota']

/** Módulo que ainda não foi ligado: mesmo visual, cartões e tabela vazios. */
export function ModuloVazioPage({ modulo }: { modulo: ModuloVazio }) {
  const m = textos.vazios[modulo]
  const zero = modulo === 'financeiro' ? (i: number) => (i === 1 ? 'R$ 0' : '0') : () => '0'
  return (
    <Quadro
      titulo={m.titulo}
      numeros={m.numeros.map((rotulo, i) => ({ valor: zero(i), rotulo, tom: TONS[i] ?? 'salvia' }))}
    >
      <Tabela colunas={m.colunas}>
        <tr>
          <td colSpan={m.colunas.length} className="px-5 py-16 text-center text-sm text-suave">
            {textos.vazios.mensagem}
          </td>
        </tr>
      </Tabela>
    </Quadro>
  )
}
