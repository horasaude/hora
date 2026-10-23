import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormAgenda, type CampoDef } from '../../components/FormAgenda'
import { useSalvar, useTemas } from '../../hooks/usePainel'
import { textos } from '../../textos'
import { salvarMaterialNutricao, type MaterialNutricao } from '../api/materiais.api'
import { materiais as t } from '../textosMateriais'

const esquema = z.object({
  titulo: z.string().trim().min(1, textos.erros.titulo).max(160, textos.erros.titulo),
  texto: z.string().trim().min(1, textos.erros.texto).max(20000, textos.erros.texto),
  tema_id: z.string().transform((v) => v || null),
})
type Entrada = z.input<typeof esquema>

const campos = (temas: { id: string; titulo: string }[]): CampoDef<Entrada>[] => [
  { nome: 'titulo', rotulo: t.campoTitulo },
  {
    nome: 'tema_id',
    rotulo: t.campoTema,
    tipo: 'escolha',
    opcoes: [
      { valor: '', nome: t.semTema },
      ...temas.map((x) => ({ valor: x.id, nome: x.titulo })),
    ],
  },
  { nome: 'texto', rotulo: t.campoTexto, tipo: 'area', linhas: 16 },
]

/** Janela de criar ou editar material. Ao criar na lista, abre o material novo; dentro do tema, só fecha. */
export function MaterialForm({
  material,
  temaId,
  aoFechar,
}: {
  material?: MaterialNutricao
  temaId?: string
  aoFechar: () => void
}) {
  const salvar = useSalvar(salvarMaterialNutricao)
  const navegar = useNavigate()
  const temas = useTemas().data ?? []
  return (
    <FormAgenda<Entrada, z.output<typeof esquema>>
      titulo={material ? t.editar : t.novo}
      campos={campos(temas)}
      inicial={{
        titulo: material?.titulo ?? '',
        texto: material?.texto ?? '',
        tema_id: material?.tema_id ?? temaId ?? '',
      }}
      resolver={zodResolver(esquema)}
      aoCancelar={aoFechar}
      aoSalvar={async (d) => {
        const salvo = await salvar.mutateAsync({ ...d, id: material?.id })
        if (material || temaId) aoFechar()
        else navegar(`/app/admin/plano/materiais/${salvo.id}`)
      }}
    />
  )
}
