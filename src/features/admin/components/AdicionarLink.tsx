import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { textos } from '../textos'

const t = textos.arquivos
const campo = 'min-h-10 rounded-xl border border-linha bg-white px-3 text-sm'

/** Link de vídeo (YouTube, Drive) ou página junto com os arquivos; entra na lista ao tocar em Adicionar. */
export function AdicionarLink({
  aoAdicionar,
}: {
  aoAdicionar: (link: string, nome: string) => void
}) {
  const [link, setLink] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState(false)
  const adicionar = () => {
    if (!/^https:\/\/\S+\.\S+/.test(link.trim())) return setErro(true)
    aoAdicionar(link, nome)
    setLink('')
    setNome('')
    setErro(false)
  }
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{t.linkCampo}</span>
      <div className="grid gap-2 sm:grid-cols-[1fr_12rem_auto]">
        <input
          aria-label={t.linkCampo}
          placeholder="https://"
          inputMode="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className={campo}
        />
        <input
          aria-label={t.linkNome}
          placeholder={t.linkNome}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={campo}
        />
        <BotaoBrilho tom="cinza" onClick={adicionar}>
          {t.linkAdicionar}
        </BotaoBrilho>
      </div>
      {erro && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {t.linkInvalido}
        </p>
      )}
    </div>
  )
}
