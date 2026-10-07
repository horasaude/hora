import { useEffect, useId, useState } from 'react'
import { TIPOS_FOTO as TIPOS } from '../formulario'
import { t } from '../textos'

/** Envio de imagem com prévia; a compressão acontece ao salvar. */
export function CampoFoto({
  rotulo,
  atual,
  aoEscolher,
  redonda = false,
}: {
  rotulo: string
  atual?: string
  aoEscolher: (f?: File) => void
  redonda?: boolean
}) {
  const id = useId()
  const [previa, setPrevia] = useState<string>()
  useEffect(
    () => () => {
      if (previa) URL.revokeObjectURL(previa)
    },
    [previa],
  )
  const src = previa ?? atual
  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="font-medium">{rotulo}</span>
      <div
        className={`grid place-items-center overflow-hidden border border-linha bg-trilho ${redonda ? 'size-28 rounded-2xl' : 'aspect-square w-full rounded-[18px]'}`}
      >
        {src ? <img src={src} alt="" className="size-full object-cover" /> : null}
      </div>
      <label
        htmlFor={id}
        className="brilho brilho-cinza inline-flex min-h-9 cursor-pointer items-center self-start rounded-full px-4 text-[13px] font-bold"
      >
        {t.produto.escolherFoto}
      </label>
      <input
        id={id}
        type="file"
        accept={TIPOS.join(',')}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          aoEscolher(f)
          setPrevia(f ? URL.createObjectURL(f) : undefined)
        }}
      />
    </div>
  )
}
