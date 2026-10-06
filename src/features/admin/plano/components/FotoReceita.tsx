import { useId, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { enviarFoto, linkFoto } from '../api/receitas.api'
import { textos } from '../textos'
import { tReceitas as t } from '../textos2'

/** Foto da receita no espaço privado: mostra por link assinado e troca enviando outra imagem. */
export function FotoReceita({
  caminho,
  aoMudar,
}: {
  caminho: string | null
  aoMudar: (c: string) => void
}) {
  const id = useId()
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(false)
  const url = useQuery({
    queryKey: ['foto', caminho],
    queryFn: () => linkFoto(caminho ?? ''),
    enabled: Boolean(caminho),
  })
  const escolher = async (arquivo?: File) => {
    if (!arquivo) return
    setEnviando(true)
    setErro(false)
    try {
      aoMudar(await enviarFoto(arquivo))
    } catch {
      setErro(true)
    } finally {
      setEnviando(false)
    }
  }
  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="font-medium">{t.foto}</span>
      <div className="flex items-center gap-4">
        <div className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-2xl bg-trilho">
          {url.data && <img src={url.data} alt="" className="size-full object-cover" />}
        </div>
        <label
          htmlFor={id}
          className="brilho brilho-cinza inline-flex min-h-9 cursor-pointer items-center rounded-full px-4 text-[13px] font-bold"
        >
          {enviando ? textos.salvando : caminho ? t.trocarFoto : t.escolherFoto}
        </label>
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => escolher(e.target.files?.[0])}
        />
      </div>
      {erro && (
        <p role="alert" className="text-terracota-escuro">
          {textos.erro}
        </p>
      )}
    </div>
  )
}
