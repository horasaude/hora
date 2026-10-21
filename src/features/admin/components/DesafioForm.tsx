import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { salvarDesafio, type Desafio } from '../api/modulos.api'
import { useSalvar, useTemas } from '../hooks/usePainel'
import { esquemaDesafio } from '../schemas/modulos'
import { textos } from '../textos'
import { FormAgenda, type CampoDef } from './FormAgenda'

const t = textos.desafios
type Entrada = z.input<typeof esquemaDesafio>
const opcoes = (o: Record<string, string>) =>
  Object.entries(o).map(([valor, nome]) => ({ valor, nome }))
const ehNumero = (v: Entrada) => v.tipo_checkin === 'numero'
const geral = (v: Entrada) => v.tema_id === ''
const campos = (temas: { id: string; titulo: string }[]): CampoDef<Entrada>[] => [
  {
    nome: 'tema_id',
    rotulo: t.campoTema,
    tipo: 'escolha',
    opcoes: [{ valor: '', nome: t.geral }, ...temas.map((x) => ({ valor: x.id, nome: x.titulo }))],
    largura: 'inteira',
  },
  { nome: 'nome', rotulo: t.campoNome },
  { nome: 'descricao', rotulo: t.campoDescricao, tipo: 'area' },
  { nome: 'inicio', rotulo: t.campoInicio, tipo: 'data', quando: geral },
  { nome: 'fim', rotulo: t.campoFim, tipo: 'data', quando: geral },
  { nome: 'tipo_checkin', rotulo: t.campoTipo, tipo: 'escolha', opcoes: opcoes(t.tipos) },
  { nome: 'unidade', rotulo: t.campoUnidade, quando: ehNumero },
  { nome: 'meta_diaria', rotulo: t.campoMetaDiaria, tipo: 'numero', quando: ehNumero },
  { nome: 'meta_dias', rotulo: t.campoMetaDias, tipo: 'numero' },
  { nome: 'pontos_por_dia', rotulo: t.campoPontos, tipo: 'numero' },
  { nome: 'bonus_conclusao', rotulo: t.campoBonus, tipo: 'numero' },
  { nome: 'premio', rotulo: t.campoPremio },
  { nome: 'premio_surpresa', rotulo: t.campoSurpresa, tipo: 'marcar' },
  { nome: 'publico', rotulo: t.campoPublico, tipo: 'escolha', opcoes: opcoes(t.publicos) },
]

function inicial(d?: Desafio, tema?: string): Entrada {
  return {
    tema_id: d ? (d.tema_id ?? '') : (tema ?? ''),
    nome: d?.nome ?? '',
    descricao: d?.descricao ?? '',
    inicio: d?.tema_id ? '' : (d?.inicio ?? ''),
    fim: d?.tema_id ? '' : (d?.fim ?? ''),
    tipo_checkin: d?.tipo_checkin ?? 'sim_nao',
    unidade: d?.unidade ?? '',
    meta_diaria: d?.meta_diaria ? String(d.meta_diaria) : '',
    meta_dias: String(d?.meta_dias ?? ''),
    pontos_por_dia: String(d?.pontos_por_dia ?? 10),
    bonus_conclusao: String(d?.bonus_conclusao ?? 0),
    premio: d?.premio ?? '',
    premio_surpresa: d?.premio_surpresa ?? false,
    publico: d?.publico ?? 'todas',
  }
}

/** Janela de criar ou editar desafio. Ao criar, abre o desafio novo na lista. */
export function DesafioForm({
  desafio,
  aoFechar,
  temaId,
}: {
  desafio?: Desafio
  aoFechar: () => void
  temaId?: string
}) {
  const salvar = useSalvar(salvarDesafio)
  const temas = useTemas().data ?? []
  const navegar = useNavigate()
  return (
    <FormAgenda<Entrada, z.output<typeof esquemaDesafio>>
      titulo={desafio ? t.editar : t.novo}
      campos={campos(temas)}
      inicial={inicial(desafio, temaId)}
      resolver={zodResolver(esquemaDesafio)}
      aoCancelar={aoFechar}
      aoSalvar={async (d) => {
        const salvo = await salvar.mutateAsync({ ...d, id: desafio?.id })
        if (desafio) aoFechar()
        else navegar(`/app/admin/desafios/${salvo.id}`)
      }}
    />
  )
}
