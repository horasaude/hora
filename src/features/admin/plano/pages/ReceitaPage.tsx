import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BotaoBrilho, Janela } from '@/components/ui'
import { porPorcao } from '@/domain/nutricao'
import { Estado } from '../../components/Estado'
import type { ReceitaCompleta } from '../api/receitas.api'
import { BarraTopo } from '../components/BarraTopo'
import { Confirmar } from '../components/Confirmar'
import { ReceitaLateral, ReceitaPrincipal } from '../components/ReceitaCampos'
import { ReceitaVisual } from '../components/ReceitaVisual'
import { LISTA_RECEITAS, useEditorReceita } from '../hooks/useEditorReceita'
import { useReceita } from '../hooks/usePlano'
import { textos } from '../textos'
import { tReceitas as t } from '../textos2'

type Ed = ReturnType<typeof useEditorReceita>

/** Visualizar (como a aluna vê) e confirmar remoção. */
function Janelas({
  janela,
  fechar,
  e,
}: {
  janela: 'ver' | 'remover' | null
  fechar: () => void
  e: Ed
}) {
  const { f } = e
  if (janela === 'remover')
    return <Confirmar nome={f.nome} aoConfirmar={e.remover} aoFechar={fechar} />
  if (janela !== 'ver') return null
  return (
    <Janela
      titulo={textos.visualizar}
      aoFechar={fechar}
      rotuloFechar={textos.fechar}
      rodape={
        <BotaoBrilho tom="cinza" onClick={fechar}>
          {textos.fechar}
        </BotaoBrilho>
      }
    >
      <ReceitaVisual
        nome={f.nome}
        foto={f.foto_path}
        porcoes={f.porcoes}
        ingredientes={f.ingredientes}
        preparo={f.preparo}
        kcal={f.calcular ? porPorcao(f.itens, f.porcoes).kcal : undefined}
      />
    </Janela>
  )
}

function Editor({ receita }: { receita?: ReceitaCompleta }) {
  const e = useEditorReceita(receita)
  const { f } = e
  const [janela, setJanela] = useState<'ver' | 'remover' | null>(null)
  const fechar = () => setJanela(null)
  return (
    <div className="flex flex-col gap-5">
      <BarraTopo
        voltar={LISTA_RECEITAS}
        titulo={f.nome || t.nova}
        aviso={e.alterado ? textos.naoSalvo : undefined}
      >
        <BotaoBrilho tom="cinza" disabled={!receita} onClick={e.duplicar}>
          {textos.duplicar}
        </BotaoBrilho>
        <BotaoBrilho tom="cinza" onClick={() => setJanela('ver')}>
          {textos.visualizar}
        </BotaoBrilho>
        <BotaoBrilho tom="coral" disabled={!receita} onClick={() => setJanela('remover')}>
          {textos.remover}
        </BotaoBrilho>
        <BotaoBrilho
          tom={f.publicado ? 'coral' : 'verde'}
          disabled={e.salvando}
          onClick={() => e.gravar({ ...f, publicado: !f.publicado })}
        >
          {f.publicado ? textos.tirarDoAr : textos.publicar}
        </BotaoBrilho>
        <BotaoBrilho disabled={e.salvando} onClick={() => e.gravar(f)}>
          {e.salvando ? textos.salvando : textos.salvar}
        </BotaoBrilho>
      </BarraTopo>
      {e.erro === 'salvar' && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {textos.erro}
        </p>
      )}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ReceitaPrincipal f={f} mudar={e.mudar} erroNome={e.erro === 'nome'} />
        <ReceitaLateral f={f} mudar={e.mudar} />
      </div>
      <Janelas janela={janela} fechar={fechar} e={e} />
    </div>
  )
}

/** Receita em página inteira (nova ou existente). */
export function ReceitaPage() {
  const { receitaId } = useParams()
  const receita = useReceita(receitaId)
  if (receitaId && receita.isPending) return <Estado tipo="carregando" />
  if (receitaId && receita.isError) return <Estado tipo="erro" tentar={() => receita.refetch()} />
  return <Editor key={receitaId ?? 'nova'} receita={receita.data} />
}
