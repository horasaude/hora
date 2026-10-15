import { useQuery } from '@tanstack/react-query'
import { Cartao } from '@/components/ui'
import { formatarData } from '@/lib/datas'
import { linkDoMeuArquivo, listarMeusArquivos } from '../api/avaliacoes.api'
import { textos } from '../textos'

async function baixar(caminho: string) {
  const link = await linkDoMeuArquivo(caminho)
  if (link) window.location.href = link
}

/** Minha evolução: arquivos que a equipe mandou só para ela; some quando não há nenhum. */
export function ArquivosDaEquipe() {
  const q = useQuery({ queryKey: ['meus-arquivos'], queryFn: listarMeusArquivos })
  const lista = q.data ?? []
  if (lista.length === 0) return null
  return (
    <Cartao className="flex flex-col gap-3 font-sistema">
      <h2 className="text-lg font-bold text-verde-escuro">{textos.arquivos}</h2>
      <ul className="flex flex-col gap-2">
        {lista.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-trilho px-4 py-3"
          >
            <span className="min-w-0">
              <span className="block truncate font-bold text-tinta">{a.nome}</span>
              <span className="text-xs text-suave">{formatarData(new Date(a.created_at))}</span>
            </span>
            <button
              type="button"
              onClick={() => void baixar(a.caminho)}
              className="brilho brilho-verde inline-flex min-h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-bold"
            >
              {textos.baixar}
            </button>
          </li>
        ))}
      </ul>
    </Cartao>
  )
}
