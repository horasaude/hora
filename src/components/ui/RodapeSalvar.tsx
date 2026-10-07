import { BotaoBrilho } from './Brilho'
import type { TomBrilho } from './estiloBrilho'

type Props = {
  aoCancelar: () => void
  aoSalvar: () => void
  salvando: boolean
  textos: { cancelar: string; salvar: string; salvando: string }
  tom?: TomBrilho
}

/** Rodapé da Janela: Cancelar cinza e Salvar (verde escuro por padrão). */
export function RodapeSalvar({ aoCancelar, aoSalvar, salvando, textos: t, tom = 'escuro' }: Props) {
  return (
    <>
      <BotaoBrilho tom="cinza" onClick={aoCancelar}>
        {t.cancelar}
      </BotaoBrilho>
      <BotaoBrilho tom={tom} onClick={aoSalvar} disabled={salvando}>
        {salvando ? t.salvando : t.salvar}
      </BotaoBrilho>
    </>
  )
}
