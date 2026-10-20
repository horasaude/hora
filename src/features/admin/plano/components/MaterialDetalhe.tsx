import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BotaoBrilho } from '@/components/ui'
import { BotaoPublicar } from '../../components/BotaoPublicar'
import { CartaoDetalhe, Dados } from '../../components/CartaoDetalhe'
import { Situacao } from '../../components/Tabela'
import { useSalvar } from '../../hooks/usePainel'
import { textos } from '../../textos'
import { excluirMaterialNutricao, type MaterialNutricao } from '../api/materiais.api'
import { materiais as t } from '../textosMateriais'
import { MaterialForm } from './MaterialForm'

/** Material aberto: texto, editar, publicar e excluir (excluir pede confirmação). */
export function MaterialDetalhe({ material }: { material: MaterialNutricao }) {
  const [editando, setEditando] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const excluir = useSalvar(excluirMaterialNutricao)
  const navegar = useNavigate()
  return (
    <CartaoDetalhe titulo={material.titulo}>
      <Dados itens={[[textos.status, <Situacao key="s" publicado={material.publicado} />]]} />
      <p className="text-[13px] leading-relaxed whitespace-pre-line text-[#40504B]">
        {material.texto}
      </p>
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho onClick={() => setEditando(true)}>{textos.editar}</BotaoBrilho>
        <BotaoPublicar
          tabela="materiais_nutricao"
          id={material.id}
          publicado={material.publicado}
        />
        <BotaoBrilho
          tom="coral"
          disabled={excluir.isPending}
          onClick={() =>
            confirmar
              ? excluir.mutate(material.id, {
                  onSuccess: () => navegar('/app/admin/plano/materiais'),
                })
              : setConfirmar(true)
          }
        >
          {confirmar ? t.confirmarExcluir : t.excluir}
        </BotaoBrilho>
      </div>
      {editando && <MaterialForm material={material} aoFechar={() => setEditando(false)} />}
    </CartaoDetalhe>
  )
}
