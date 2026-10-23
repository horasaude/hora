import { BotaoBrilho, Campo, Janela } from '@/components/ui'
import { CampoArea } from '../../components/CampoArea'
import type { Anamnese, AreaAnamnese } from '../api/anamnese.api'
import { useAnamneseForm } from '../hooks/useAnamneseForm'
import { t } from '../textos'
import { PerguntaEditor } from './PerguntaEditor'

function Rodape({ f, aoFechar }: { f: ReturnType<typeof useAnamneseForm>; aoFechar: () => void }) {
  return (
    <>
      <BotaoBrilho tom="cinza" onClick={aoFechar}>
        {t.cancelar}
      </BotaoBrilho>
      <BotaoBrilho onClick={() => f.gravar(false)} disabled={f.salvando}>
        {t.salvarRascunho}
      </BotaoBrilho>
      <BotaoBrilho tom="verde" onClick={() => f.gravar(true)} disabled={f.salvando}>
        {t.publicar}
      </BotaoBrilho>
    </>
  )
}

function BotaoAdicionar({ f }: { f: ReturnType<typeof useAnamneseForm> }) {
  return (
    <button
      type="button"
      disabled={f.perguntas.length >= 60}
      onClick={f.adicionar}
      className="brilho brilho-dourado inline-flex min-h-9 items-center self-start rounded-full px-4 text-[13px] font-bold"
    >
      {t.anamnese.adicionar}
    </button>
  )
}

/** Criar e editar a anamnese: título, abertura e perguntas; Salvar rascunho ou Publicar. */
export function AnamneseJanela({
  anamnese,
  area,
  aoFechar,
}: {
  anamnese?: Anamnese
  area: AreaAnamnese
  aoFechar: () => void
}) {
  const f = useAnamneseForm(anamnese, area, aoFechar)
  const a = t.anamnese
  return (
    <Janela
      titulo={anamnese ? a.editar : a.nova.replace('+ ', '')}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={<Rodape f={f} aoFechar={aoFechar} />}
    >
      <div className="flex flex-col gap-4">
        <Campo
          id="anamnese-titulo"
          rotulo={a.titulo}
          value={f.titulo}
          onChange={(e) => f.setTitulo(e.target.value)}
        />
        <CampoArea
          id="anamnese-descricao"
          rotulo={a.descricao}
          rows={2}
          maxLength={500}
          value={f.descricao}
          onChange={(e) => f.setDescricao(e.target.value)}
        />
        <h3 className="text-sm font-bold text-verde-escuro">{a.perguntas}</h3>
        <ol className="flex flex-col gap-2">
          {f.perguntas.map((p, i) => (
            <PerguntaEditor
              key={p.id}
              p={p}
              i={i}
              total={f.perguntas.length}
              mudar={(x) => f.mudar(i, x)}
              mover={(d) => f.mover(i, d)}
              tirar={() => f.tirar(i)}
            />
          ))}
        </ol>
        <BotaoAdicionar f={f} />
        {f.erro && (
          <p role="alert" className="text-sm text-terracota-escuro">
            {f.erro}
          </p>
        )}
      </div>
    </Janela>
  )
}
