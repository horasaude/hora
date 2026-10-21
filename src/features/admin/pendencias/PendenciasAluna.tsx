import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatarDataHora } from '@/lib/datas'
import { Etiqueta } from '../components/Tabela'
import { lembrarAluna, listarPendencias, type Pendencia } from './pendencias.api'
import { t } from './textos'

const ORDEM = ['anamnese', 'comece', 'tema', 'treino']
const posicao = (item: string) => ORDEM.findIndex((o) => item.startsWith(o))

function Situacao({ p }: { p: Pendencia }) {
  if (p.feito) return <Etiqueta tom="verde">{t.feito}</Etiqueta>
  if (p.andamento) return <Etiqueta tom="ocre">{t.andamento}</Etiqueta>
  return <Etiqueta tom="neutro">{t.falta}</Etiqueta>
}

/** Ficha da aluna: anamnese, passos do Comece por aqui, tema e treino, com Lembrar no que falta. */
export function PendenciasAluna({ perfil }: { perfil: string }) {
  const cliente = useQueryClient()
  const lista = useQuery({
    queryKey: ['pendencias', perfil],
    queryFn: () => listarPendencias(perfil),
  })
  const lembrar = useMutation({
    mutationFn: lembrarAluna,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['pendencias', perfil] }),
  })
  const itens = [...(lista.data ?? [])].sort((a, b) => posicao(a.item) - posicao(b.item))
  return (
    <section className="flex flex-col gap-2 border-t border-linha pt-5">
      <h3 className="text-sm font-semibold text-suave">{t.titulo}</h3>
      {lista.isSuccess && itens.length === 0 && <p className="text-sm text-suave">{t.vazio}</p>}
      <ul className="flex flex-col divide-y divide-linha">
        {itens.map((p) => (
          <li key={p.item} className="flex flex-wrap items-center gap-2 py-2 text-sm">
            <span className="min-w-0 flex-1 text-tinta">{p.nome}</span>
            <Situacao p={p} />
            {!p.feito && (
              <span className="flex items-center gap-2">
                {p.lembrada_em && (
                  <span className="text-xs text-suave">
                    {t.lembrada(formatarDataHora(new Date(p.lembrada_em)))}
                  </span>
                )}
                <button
                  type="button"
                  disabled={lembrar.isPending}
                  onClick={() => lembrar.mutate({ perfil, item: p.item })}
                  className="brilho brilho-dourado inline-flex min-h-8 items-center rounded-full px-3 text-[12px] font-bold disabled:opacity-50"
                >
                  {lembrar.isPending && lembrar.variables?.item === p.item
                    ? t.lembrando
                    : t.lembrar}
                </button>
              </span>
            )}
          </li>
        ))}
      </ul>
      {lembrar.isError && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {t.erro}
        </p>
      )}
    </section>
  )
}
