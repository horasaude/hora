import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { formatarDataHora, paraCampoBrasilia } from '@/lib/datas'
import { salvarAviso, type Aviso } from '../api/agenda.api'
import { useSalvar } from '../hooks/usePainel'
import { esquemaAviso } from '../schemas/formularios'
import { textos } from '../textos'
import { BotaoPublicar } from './BotaoPublicar'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { FormAgenda, type CampoDef } from './FormAgenda'
import { Situacao } from './Tabela'

const t = textos.avisos
type Entrada = z.input<typeof esquemaAviso>
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'titulo', rotulo: t.campoTitulo },
  { nome: 'texto', rotulo: t.campoTexto, tipo: 'area' },
  { nome: 'publicar_em', rotulo: t.campoPublicarEm, tipo: 'datahora' },
]

/** Cartão do aviso aberto (ou novo): dados, publicar e o formulário. */
export function AvisoDetalhe({ aviso }: { aviso?: Aviso }) {
  const salvar = useSalvar(salvarAviso)
  const navegar = useNavigate()
  const [agora] = useState(() => new Date())
  const inicial: Entrada = {
    titulo: aviso?.titulo ?? '',
    texto: aviso?.texto ?? '',
    publicar_em: paraCampoBrasilia(aviso ? new Date(aviso.publicar_em) : agora),
  }
  return (
    <CartaoDetalhe titulo={aviso ? aviso.titulo : t.novo}>
      {aviso && (
        <>
          <Dados
            itens={[
              [t.colunaData, formatarDataHora(new Date(aviso.publicar_em))],
              [textos.status, <Situacao key="s" publicado={aviso.publicado} />],
            ]}
          />
          <BotaoPublicar tabela="avisos" id={aviso.id} publicado={aviso.publicado} />
          <hr className="border-linha" />
        </>
      )}
      <FormAgenda<Entrada, z.output<typeof esquemaAviso>>
        campos={CAMPOS}
        inicial={inicial}
        resolver={zodResolver(esquemaAviso)}
        aoCancelar={() => navegar('/app/admin/avisos')}
        aoSalvar={async (d) => {
          const salvo = await salvar.mutateAsync({ ...d, id: aviso?.id })
          navegar(`/app/admin/avisos/${salvo.id}`)
        }}
      />
    </CartaoDetalhe>
  )
}
