import { useId } from 'react'

type Foto = {
  rotulo: string
  escolhida: boolean
  aoEscolher: (f: File | null) => void
  /** Abre a câmera traseira no celular (no computador, a escolha de arquivo). */
  camera?: boolean
  desligado?: boolean
  tom?: 'escuro' | 'verde' | 'cinza'
}

/** Botão de vidro que abre a câmera ou a escolha de imagem; cinza depois de escolhida. */
export function EscolherFoto({
  rotulo,
  escolhida,
  aoEscolher,
  camera = true,
  desligado,
  tom = 'escuro',
}: Foto) {
  const id = useId()
  return (
    <>
      <label
        htmlFor={id}
        aria-disabled={desligado}
        className={`brilho ${escolhida ? 'brilho-cinza' : `brilho-${tom}`} inline-flex min-h-9 cursor-pointer items-center self-start rounded-full px-4 text-[13px] font-bold ${desligado ? 'pointer-events-none opacity-50' : ''}`}
      >
        {rotulo}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        capture={camera ? 'environment' : undefined}
        disabled={desligado}
        className="sr-only"
        onChange={(e) => aoEscolher(e.target.files?.[0] ?? null)}
      />
    </>
  )
}

/** Mensagem de erro do formulário, lida pelo leitor de tela. */
export function AvisoErro({ texto }: { texto: string | null | undefined }) {
  if (!texto) return null
  return (
    <p role="alert" className="mt-4 text-sm text-terracota-escuro">
      {texto}
    </p>
  )
}

type Pag = {
  pagina: number
  paginas: number
  tamanho: number
  aoMudar: (pagina: number, tamanho: number) => void
  textos: {
    porPagina: string
    anterior: string
    proxima: string
    pagina: (p: number, de: number) => string
  }
}

const botao =
  'min-h-8 rounded-full border border-linha bg-white px-3 text-xs font-bold text-verde-escuro disabled:opacity-40'

/** Paginação de lista longa: 10 por página, com 25, 50 ou 100. */
export function Paginacao({ pagina, paginas, tamanho, aoMudar, textos: t }: Pag) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-suave">
      <label className="flex items-center gap-2">
        {t.porPagina}
        <select
          value={tamanho}
          onChange={(e) => aoMudar(1, Number(e.target.value))}
          className="min-h-8 rounded-full border border-linha bg-white px-2"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={botao}
          disabled={pagina <= 1}
          onClick={() => aoMudar(pagina - 1, tamanho)}
        >
          {t.anterior}
        </button>
        <span>{t.pagina(pagina, paginas)}</span>
        <button
          type="button"
          className={botao}
          disabled={pagina >= paginas}
          onClick={() => aoMudar(pagina + 1, tamanho)}
        >
          {t.proxima}
        </button>
      </div>
    </div>
  )
}
