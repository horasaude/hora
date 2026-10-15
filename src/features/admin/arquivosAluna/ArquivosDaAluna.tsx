import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatarTamanho } from '@/domain/arquivos'
import { formatarData } from '@/lib/datas'
import { Confirmar } from '../plano/components/Confirmar'
import { textos } from '../textos'
import { linkDoArquivo, listarArquivosAluna, type ArquivoAluna } from './arquivosAluna.api'
import { useEnviarArquivo } from './useEnviarArquivo'

const t = textos.arquivosAluna

async function abrir(caminho: string) {
  const aba = window.open('', '_blank')
  const link = await linkDoArquivo(caminho)
  if (aba && link) aba.location.href = link
  else aba?.close()
}

function Linha({ a, remover }: { a: ArquivoAluna; remover: () => void }) {
  return (
    <li className="flex items-center gap-2 rounded-xl bg-trilho px-3 py-2 text-sm">
      <button
        type="button"
        onClick={() => abrir(a.caminho)}
        className="flex-1 truncate text-left font-bold text-verde-escuro underline"
      >
        {a.nome}
      </button>
      <span className="shrink-0 text-xs text-suave">
        {formatarTamanho(a.tamanho)} · {formatarData(new Date(a.created_at))}
      </span>
      <button
        type="button"
        onClick={remover}
        aria-label={textos.arquivos.remover(a.nome)}
        className="grid size-8 shrink-0 place-items-center rounded-full text-terracota-escuro"
      >
        ×
      </button>
    </li>
  )
}

/** Cartão da aluna: arquivos que a equipe mandou só para ela (plano, dieta, exame). */
export function ArquivosDaAluna({ perfil }: { perfil: string }) {
  const lista = useQuery({
    queryKey: ['arquivos-aluna', perfil],
    queryFn: () => listarArquivosAluna(perfil),
  })
  const e = useEnviarArquivo(perfil)
  const [tirar, setTirar] = useState<ArquivoAluna | null>(null)
  return (
    <section className="flex flex-col gap-2 border-t border-linha pt-5">
      <h3 className="text-sm font-semibold text-suave">{t.titulo}</h3>
      {(lista.data ?? []).length === 0 ? (
        <p className="text-sm text-suave">{t.vazio}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {(lista.data ?? []).map((a) => (
            <Linha key={a.id} a={a} remover={() => setTirar(a)} />
          ))}
        </ul>
      )}
      <label className="brilho brilho-dourado inline-flex min-h-9 cursor-pointer items-center self-start rounded-full px-4 text-[13px] font-bold">
        {e.pct === null ? t.enviar : textos.arquivos.enviando(e.pct)}
        <input
          type="file"
          className="sr-only"
          disabled={e.pct !== null}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
          onChange={(ev) => {
            const f = ev.target.files?.[0]
            ev.target.value = ''
            if (f) void e.enviar(f)
          }}
        />
      </label>
      <p className="text-xs text-suave">{textos.arquivos.dicaMateriais}</p>
      {e.aviso && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {e.aviso}
        </p>
      )}
      {tirar && (
        <Confirmar
          nome={tirar.nome}
          aoConfirmar={() => e.remover.mutateAsync(tirar)}
          aoFechar={() => setTirar(null)}
        />
      )}
    </section>
  )
}
