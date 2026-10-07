import { useId, useState } from 'react'
import { textos } from '../textos'

const t = textos.arquivos

type Props = {
  aceita: string
  multiplos?: boolean
  dica: string
  aoEscolher: (arquivos: File[]) => void
}

/** Caixa de arrastar e soltar com o botão Escolher arquivos. */
export function AreaArquivos({ aceita, multiplos = true, dica, aoEscolher }: Props) {
  const id = useId()
  const [sobre, setSobre] = useState(false)
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setSobre(true)
      }}
      onDragLeave={() => setSobre(false)}
      onDrop={(e) => {
        e.preventDefault()
        setSobre(false)
        aoEscolher([...e.dataTransfer.files])
      }}
      className={`flex flex-col items-center gap-2 rounded-[16px] border-2 border-dashed px-4 py-6 text-center transition ${sobre ? 'border-ora bg-salvia-suave' : 'border-linha bg-[#FAFBFA]'}`}
    >
      <p className="text-sm text-tinta">{multiplos ? t.arraste : t.arrasteUm}</p>
      <label
        htmlFor={id}
        className="brilho brilho-escuro inline-flex min-h-9 cursor-pointer items-center rounded-full px-4 text-[13px] font-bold"
      >
        {t.escolher}
      </label>
      <input
        id={id}
        type="file"
        accept={aceita}
        multiple={multiplos}
        className="sr-only"
        onChange={(e) => {
          aoEscolher([...(e.target.files ?? [])])
          e.target.value = ''
        }}
      />
      <p className="text-xs text-suave">{dica}</p>
    </div>
  )
}
