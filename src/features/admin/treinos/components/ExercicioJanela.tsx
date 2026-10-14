import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EQUIPAMENTOS, GRUPOS, type Equipamento, type Grupo } from '@/domain/treinos'
import { textos } from '../../textos'
import { CapaLive, type EstadoCapa } from '../../components/CapaLive'
import { FormAgenda, type CampoDef } from '../../components/FormAgenda'
import { salvarExercicio, type Exercicio } from '../api/treinos.api'
import { useAcaoTreinos } from '../hooks/useTreinosPainel'
import { t } from '../textos'

const opcoes = (o: Record<string, string>) =>
  Object.entries(o).map(([valor, nome]) => ({ valor, nome }))
const esquema = z.object({
  nome: z.string().trim().min(2, t.erros.nome).max(120, t.erros.nome),
  grupo: z.enum(Object.keys(GRUPOS) as [Grupo, ...Grupo[]]),
  equipamento: z.enum(Object.keys(EQUIPAMENTOS) as [Equipamento, ...Equipamento[]]),
  video_url: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https:\/\/\S+$/.test(v), textos.erros.link),
  instrucoes: z.string().trim().max(3000),
  erros_comuns: z.string().trim().max(3000),
})
type Entrada = z.input<typeof esquema>

const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'nome', rotulo: t.campos.nome, largura: 'inteira' },
  { nome: 'grupo', rotulo: t.campos.grupo, tipo: 'escolha', opcoes: opcoes(GRUPOS) },
  {
    nome: 'equipamento',
    rotulo: t.campos.equipamento,
    tipo: 'escolha',
    opcoes: opcoes(EQUIPAMENTOS),
  },
  {
    nome: 'video_url',
    rotulo: t.campos.video,
    tipo: 'link',
    largura: 'inteira',
    ajuda: t.campos.ajudaVideo,
    previaVideo: true,
  },
  { nome: 'instrucoes', rotulo: t.campos.instrucoes, tipo: 'area' },
  { nome: 'erros_comuns', rotulo: t.campos.erros, tipo: 'area' },
]

/** Exercício da biblioteca: nome, grupo, equipamento, vídeo com prévia, foto e instruções. */
export function ExercicioJanela({ e, aoFechar }: { e?: Exercicio; aoFechar: () => void }) {
  const salvar = useAcaoTreinos(salvarExercicio)
  const [foto, setFoto] = useState<EstadoCapa>({ caminho: e?.foto_path ?? null, enviando: false })
  return (
    <FormAgenda<Entrada, z.output<typeof esquema>>
      titulo={e ? t.editarExercicio : t.novoExercicio.replace('+ ', '')}
      campos={CAMPOS}
      inicial={{
        nome: e?.nome ?? '',
        grupo: (e?.grupo as Grupo) ?? 'quadriceps',
        equipamento: (e?.equipamento as Equipamento) ?? 'sem',
        video_url: e?.video_url ?? '',
        instrucoes: e?.instrucoes ?? '',
        erros_comuns: e?.erros_comuns ?? '',
      }}
      resolver={zodResolver(esquema)}
      aoCancelar={aoFechar}
      extra={
        <CapaLive
          inicial={e?.foto_path ?? null}
          aoMudar={setFoto}
          destino={{
            espaco: 'treinos',
            pasta: 'exercicios',
            titulo: t.campos.foto,
            uso: 'exercicio',
          }}
        />
      }
      aoSalvar={async (d) => {
        if (foto.enviando) throw new Error(textos.arquivos.esperar)
        await salvar.mutateAsync({ ...d, foto_path: foto.caminho, id: e?.id })
        aoFechar()
      }}
    />
  )
}
