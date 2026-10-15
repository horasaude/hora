import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CATEGORIAS, NIVEIS } from '@/domain/treinos'
import { salvarTreino, type ItemTreino, type Treino } from '../api/treinos.api'
import type { EntradaTreino } from '../components/CamposTreino'
import { t } from '../textos'
import { useAcaoTreinos } from './useTreinosPainel'

const esquema = z.object({
  nome: z.string().trim().min(2, t.erros.nome).max(120, t.erros.nome),
  tema_id: z.string().min(1, t.erros.tema),
  nivel: z.string().refine((v) => v in NIVEIS),
  local: z.string().refine((v) => ['casa', 'academia'].includes(v)),
  duracao: z
    .string()
    .trim()
    .refine(
      (v) => v === '' || (/^\d{1,3}$/.test(v) && Number(v) >= 1 && Number(v) <= 300),
      t.erros.duracao,
    ),
  descricao: z.string().trim().max(500),
  aquecimento: z.string().trim().max(2000),
  alongamento: z.string().trim().max(2000),
  orientacoes: z.string().trim().max(3000),
  categoria: z.string().refine((v) => v in CATEGORIAS),
})

const inicial = (x?: Treino): EntradaTreino => ({
  nome: x?.nome ?? '',
  tema_id: x?.tema_id ?? '',
  nivel: x?.nivel ?? 'iniciante',
  local: x?.local ?? 'casa',
  duracao: x?.duracao_minutos ? String(x.duracao_minutos) : '',
  descricao: x?.descricao ?? '',
  aquecimento: x?.aquecimento ?? '',
  alongamento: x?.alongamento ?? '',
  orientacoes: x?.orientacoes ?? '',
  categoria: x?.categoria ?? 'musculacao',
})

/** Estado da janela do treino: formulário, exercícios e o salvar (rascunho, publicar ou cópia). */
export function useTreinoForm(
  treino: Treino | undefined,
  itensIniciais: ItemTreino[],
  aoFechar: () => void,
) {
  const salvar = useAcaoTreinos(salvarTreino)
  const [itens, setItens] = useState<ItemTreino[]>(itensIniciais)
  const form = useForm<EntradaTreino>({
    resolver: zodResolver(esquema),
    defaultValues: inicial(treino),
  })
  const gravar = (publicado: boolean, copia = false) =>
    form.handleSubmit(async ({ duracao, ...d }) => {
      try {
        await salvar.mutateAsync({
          treino: {
            ...d,
            nome: copia ? t.copia(d.nome) : d.nome,
            duracao_minutos: duracao ? Number(duracao) : null,
            id: copia ? undefined : treino?.id,
            publicado,
          },
          itens,
        })
        aoFechar()
      } catch {
        form.setError('root', { message: t.erros.salvar })
      }
    })
  return { form, itens, setItens, gravar }
}
