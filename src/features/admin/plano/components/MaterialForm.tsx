import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormAgenda, type CampoDef } from '../../components/FormAgenda'
import { useSalvar } from '../../hooks/usePainel'
import { textos } from '../../textos'
import { salvarMaterialNutricao, type MaterialNutricao } from '../api/materiais.api'
import { materiais as t } from '../textosMateriais'

const esquema = z.object({
  titulo: z.string().trim().min(1, textos.erros.titulo).max(160, textos.erros.titulo),
  texto: z.string().trim().min(1, textos.erros.texto).max(20000, textos.erros.texto),
})
type Entrada = z.input<typeof esquema>

const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'titulo', rotulo: t.campoTitulo, largura: 'inteira' },
  { nome: 'texto', rotulo: t.campoTexto, tipo: 'area', linhas: 16 },
]

/** Janela de criar ou editar material. Ao criar, abre o material novo na lista. */
export function MaterialForm({
  material,
  aoFechar,
}: {
  material?: MaterialNutricao
  aoFechar: () => void
}) {
  const salvar = useSalvar(salvarMaterialNutricao)
  const navegar = useNavigate()
  return (
    <FormAgenda<Entrada, z.output<typeof esquema>>
      titulo={material ? t.editar : t.novo}
      campos={CAMPOS}
      inicial={{ titulo: material?.titulo ?? '', texto: material?.texto ?? '' }}
      resolver={zodResolver(esquema)}
      aoCancelar={aoFechar}
      aoSalvar={async (d) => {
        const salvo = await salvar.mutateAsync({ ...d, id: material?.id })
        if (material) aoFechar()
        else navegar(`/app/admin/plano/materiais/${salvo.id}`)
      }}
    />
  )
}
