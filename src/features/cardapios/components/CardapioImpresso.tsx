import type { Item, Refeicao } from '@/domain/nutricao'
import { rotuloOpcao } from '@/domain/nutricao'
import { sanitizarHtml } from '@/lib/html'
import type { ReceitaImpressa } from '../api/receitas.api'
import { textos } from '../textos'

const t = textos.impresso
const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

type Props = {
  titulo: string
  descricao: string
  /** Texto do topo de cada página, à direita (ex.: nome do tema). */
  guia: string
  refeicoes: Refeicao[]
  texto: boolean
  receitas?: ReceitaImpressa[]
}

const itens = (lista: Item[]) =>
  lista.map((i) => i.opcoes.map((o) => `${o.nome} (${rotuloOpcao(o)})`).join(` ${textos.ou} `))

/** Opções da refeição: a principal e as substitutas, em "Opção I — ...". Sem substitutas, um item por linha. */
function Opcoes({ r, texto }: { r: Refeicao; texto: boolean }) {
  const principal = texto ? [r.texto] : [itens(r.itens).join(' + ')]
  const trocas = r.substitutas.map((s) => (texto ? s.texto : itens(s.itens).join(' + ')))
  const linhas = trocas.length
    ? [...principal, ...trocas]
    : texto
      ? r.texto.split('\n')
      : itens(r.itens)
  return (
    <>
      {linhas.filter(Boolean).map((l, i) => (
        <p key={i} className="impresso-linha">
          {trocas.length ? `${t.opcao} ${ROMANOS[i] ?? i + 1} — ${l}` : l}
        </p>
      ))}
    </>
  )
}

function Receitas({ lista }: { lista: ReceitaImpressa[] }) {
  return (
    <section className="impresso-receitas">
      <h1 className="impresso-titulo">{t.receitas}</h1>
      <p className="impresso-sub">{t.receitasSub}</p>
      {lista.map((r, i) => (
        <article key={r.id} className="impresso-bloco">
          <h3 className="impresso-receita">{`${String(i + 1).padStart(2, '0')} · ${r.nome}`}</h3>
          <div className="impresso-rico">
            <strong>{t.ingredientes}</strong>
            <div dangerouslySetInnerHTML={{ __html: sanitizarHtml(r.ingredientes) }} />
          </div>
          <div className="impresso-rico">
            <strong>{t.preparo}</strong>
            <div dangerouslySetInnerHTML={{ __html: sanitizarHtml(r.preparo) }} />
          </div>
        </article>
      ))}
    </section>
  )
}

/**
 * Cardápio para o papel, no modelo dos guias da ORA: logo e guia no topo de cada página,
 * título grande, refeições com as opções e, no fim, as receitas usadas. O topo se repete por página
 * (thead) e o rodapé é fixo no pé de cada página; margem zero no @page para o navegador não
 * imprimir o endereço da página (src/styles/index.css).
 */
export function CardapioImpresso(p: Props) {
  return (
    <div className="area-impressao impresso">
      <table className="impresso-folha">
        <thead>
          <tr>
            <td>
              <div className="impresso-topo">
                <img src="/logo-ora.svg" alt="ORA" className="impresso-logo" />
                <span>{`${t.guias}  /  ${p.guia.toUpperCase()}`}</span>
              </div>
            </td>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td />
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td>
              <p className="impresso-chapeu">{t.chapeu}</p>
              <h1 className="impresso-titulo">{p.titulo}</h1>
              {p.descricao && <p className="impresso-sub">{p.descricao}</p>}
              <hr className="impresso-traco" />
              {p.refeicoes.map((r) => (
                <section key={r.id} className="impresso-bloco">
                  <h2 className="impresso-refeicao">
                    {r.nome}
                    {r.horario && <span className="impresso-hora">{` · ${r.horario}`}</span>}
                  </h2>
                  <Opcoes r={r} texto={p.texto} />
                  {r.observacao && <p className="impresso-obs">{r.observacao}</p>}
                </section>
              ))}
              {p.receitas && p.receitas.length > 0 && <Receitas lista={p.receitas} />}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="impresso-rodape">{t.rodape}</div>
    </div>
  )
}
