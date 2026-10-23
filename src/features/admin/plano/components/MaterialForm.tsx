import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormAgenda, type CampoDef } from '../../components/FormAgenda'
import { useSalvar, useTemas } from '../../hooks/usePainel'
import { textos } from '../../textos'
import { salvarMateriaisApoio } from '../../api/materiais.api'
import { MateriaisAula } from '../../components/MateriaisAula'
import { APOIO, useMateriais } from '../../hooks/useMateriais'
import { salvarMaterialNutricao, type MaterialNutricao } from '../api/materiais.api'
import { caminhoMateriais, type AreaMaterial } from '../areaMaterial'
import { materiais as t } from '../textosMateriais'

const esquema = z.object({
  titulo: z.string().trim().min(1, textos.erros.titulo).max(160, textos.erros.titulo),
  texto: z.string().trim().max(20000, textos.erros.texto),
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

/** Janela de criar ou editar material: texto (opcional) e anexos (PDF, Word, foto ou link de vídeo). Ao criar na lista, abre o material novo; dentro do tema, só fecha. */
export function MaterialForm({
  material,
  temaId,
  area = 'nutricao',
  aoFechar,
}: {
  material?: MaterialNutricao
  temaId?: string
  area?: AreaMaterial
  aoFechar: () => void
}) {
  const salvar = useSalvar(salvarMaterialNutricao)
  const navegar = useNavigate()
  const temas = useTemas().data ?? []
  const anexos = useMateriais(`${APOIO}${material?.id ?? ''}`)
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
      extra={<MateriaisAula m={anexos} />}
      aoSalvar={async (d) => {
        if (anexos.enviando) throw new Error(textos.arquivos.esperar)
        const salvo = await salvar.mutateAsync({ ...d, id: material?.id, area })
        await salvarMateriaisApoio(salvo.id, anexos.paraSalvar, anexos.removidos)
        if (material || temaId) aoFechar()
        else navegar(`${caminhoMateriais(area)}/${salvo.id}`)
      }}
    />
  )
}
