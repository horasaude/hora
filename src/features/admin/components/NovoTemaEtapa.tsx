import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { salvarTema } from '../api/conteudo.api'
import { useSalvar } from '../hooks/usePainel'
import { esquemaNovoTema } from '../schemas/formularios'
import { textos } from '../textos'
import { liberacao as tl } from '../textos/liberacao'
import { FormAgenda, type CampoDef } from './FormAgenda'

const c = textos.conteudo
type EntradaTema = z.input<typeof esquemaNovoTema>

const CAMPOS: CampoDef<EntradaTema>[] = [
  { nome: 'titulo', rotulo: textos.temas.campoTitulo },
  { nome: 'descricao', rotulo: c.campoFrase, largura: 'inteira' },
  { nome: 'cor', rotulo: c.campoCor, tipo: 'escolha', opcoes: c.cores },
  { nome: 'dias', rotulo: tl.campoDias, tipo: 'numero' },
]

/** Novo tema: nome, frase, cor e dias. Entra em rascunho, no fim da sequência, e abre à direita. */
export function NovoTema({ aoFechar }: { aoFechar: () => void }) {
  const salvar = useSalvar(salvarTema)
  const navegar = useNavigate()
  return (
    <FormAgenda<EntradaTema, z.output<typeof esquemaNovoTema>>
      titulo={textos.temas.novo}
      campos={CAMPOS}
      inicial={{ titulo: '', descricao: '', cor: 'verde', dias: '30' }}
      resolver={zodResolver(esquemaNovoTema)}
      aoCancelar={aoFechar}
      aoSalvar={async (d) => {
        const tema = await salvar.mutateAsync({ ...d, tipo: 'tema' })
        aoFechar()
        navegar(`/app/admin/conteudo/${tema.id}`)
      }}
    />
  )
}
