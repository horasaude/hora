import { useId, useState } from 'react'
import { tReceitas as t } from '../textos2'

/** Campo do endereço do link, aberto pelo botão de link do editor. */
export function BarraLink({ aoAplicar }: { aoAplicar: (url: string) => void }) {
  const id = useId()
  const [url, setUrl] = useState('https://')
  const [erro, setErro] = useState(false)
  const aplicar = () => {
    if (!/^https:\/\/[^\s]+\.[^\s]+/.test(url.trim())) return setErro(true)
    aoAplicar(url.trim())
  }
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#F0F2F1] px-3 py-2">
      <label htmlFor={id} className="text-xs text-suave">
        {t.enderecoLink}
      </label>
      <input
        id={id}
        value={url}
        inputMode="url"
        onChange={(e) => {
          setUrl(e.target.value)
          setErro(false)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            aplicar()
          }
        }}
        aria-invalid={erro}
        className="min-h-9 min-w-0 flex-1 rounded-lg border border-linha px-3 text-sm focus:border-ora focus:outline-none"
      />
      <button
        type="button"
        onClick={aplicar}
        className="min-h-9 rounded-full px-3 text-xs font-bold text-verde-escuro underline"
      >
        {t.aplicarLink}
      </button>
      {erro && (
        <p role="alert" className="w-full text-xs text-terracota-escuro">
          {t.linkInvalido}
        </p>
      )}
    </div>
  )
}
