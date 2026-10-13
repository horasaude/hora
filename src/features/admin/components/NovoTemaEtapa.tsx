import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { salvarEtapa, salvarTema } from '../api/conteudo.api'
import { useSalvar, useTemas } from '../hooks/usePainel'
import { esquemaNovaEtapa, esquemaNovoTema } from '../schemas/formularios'
import { textos } from '../textos'
import { FormAgenda, type CampoDef } from './FormAgenda'

const c = textos.conteudo
type EntradaTema = z.input<typeof esquemaNovoTema>
type EntradaEtapa = z.input<typeof esquemaNovaEtapa>

const comuns = (nome: string): CampoDef<EntradaTema>[] => [
  { nome: 'titulo', rotulo: nome },
  { nome: 'descricao', rotulo: c.campoFrase, largura: 'inteira' },
  { nome: 'cor', rotulo: c.campoCor, tipo: 'escolha', opcoes: c.cores },
  { nome: 'ordem', rotulo: c.campoOrdem, tipo: 'numero', ajuda: c.ajudaOrdem },
]

/** Novo tema: nome, frase, cor e ordem. Entra em rascunho e abre à direita. */
export function NovoTema({ aoFechar }: { aoFechar: () => void }) {
  const salvar = useSalvar(salvarTema)
  const navegar = useNavigate()
  return (
    <FormAgenda<EntradaTema, z.output<typeof esquemaNovoTema>>
      titulo={textos.temas.novo}
      campos={comuns(textos.temas.campoTitulo)}
      inicial={{ titulo: '', descricao: '', cor: 'verde', ordem: '1' }}
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

/** Nova etapa: o tema dela, nome, frase, cor e ordem. */
export function NovaEtapa({ temaId, aoFechar }: { temaId?: string; aoFechar: () => void }) {
  const salvar = useSalvar(salvarEtapa)
  const temas = useTemas().data ?? []
  const navegar = useNavigate()
  const opcoes = temas.map((t) => ({ valor: t.id, nome: t.titulo }))
  const campos: CampoDef<EntradaEtapa>[] = [
    { nome: 'tema_id', rotulo: c.temaDaEtapa, tipo: 'escolha', opcoes, largura: 'inteira' },
    ...(comuns(textos.etapas.campoTitulo) as CampoDef<EntradaEtapa>[]),
  ]
  return (
    <FormAgenda<EntradaEtapa, z.output<typeof esquemaNovaEtapa>>
      titulo={textos.etapas.nova}
      campos={campos}
      inicial={{
        tema_id: temaId ?? temas[0]?.id ?? '',
        titulo: '',
        descricao: '',
        cor: 'verde',
        ordem: '1',
      }}
      resolver={zodResolver(esquemaNovaEtapa)}
      aoCancelar={aoFechar}
      aoSalvar={async (d) => {
        await salvar.mutateAsync(d)
        aoFechar()
        navegar(`/app/admin/conteudo/${d.tema_id}`)
      }}
    />
  )
}
