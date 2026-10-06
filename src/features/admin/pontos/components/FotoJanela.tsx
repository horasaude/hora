import { useState } from 'react'
import { BotaoBrilho, EtiquetaBrilho, Janela } from '@/components/ui'
import { formatarDataHora } from '@/lib/datas'
import { CartaoDetalhe, Dados } from '../../components/CartaoDetalhe'
import { invalidarFoto, type Foto } from '../api/pontos.api'
import { useAcaoPontos } from '../hooks/usePontos'
import { t } from '../textos'

const f = t.fotos

function Detalhe({
  foto,
  confirmando,
  motivo,
  setMotivo,
}: {
  foto: Foto
  confirmando: boolean
  motivo: string
  setMotivo: (m: string) => void
}) {
  const p = foto.perfis
  return (
    <CartaoDetalhe titulo={f.tipos[foto.tipo] ?? foto.tipo}>
      <Dados
        itens={[
          [f.dados.aluna, p?.apelido ? `${p.nome} (${p.apelido})` : (p?.nome ?? '-')],
          [f.dados.data, formatarDataHora(new Date(foto.created_at))],
          ...(foto.tipo_treino ? [[f.dados.treino, foto.tipo_treino] as [string, string]] : []),
        ]}
      />
      <div className="flex flex-wrap gap-1.5">
        {foto.invalidado_em && <EtiquetaBrilho tom="coral">{f.invalidada}</EtiquetaBrilho>}
        {foto.denuncias_checkin.length > 0 && (
          <EtiquetaBrilho tom="dourado">
            {f.denunciada(foto.denuncias_checkin.length)}
          </EtiquetaBrilho>
        )}
      </div>
      {foto.motivo_invalidacao && (
        <p className="text-[13px] text-suave">{foto.motivo_invalidacao}</p>
      )}
      {confirmando && !foto.invalidado_em && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{f.motivo}</span>
          <input
            className="min-h-10 rounded-xl border border-linha px-3"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </label>
      )}
    </CartaoDetalhe>
  )
}

/** Foto aberta grande, com os dados e o "Invalidar foto" (estorna os pontos do check-in). */
export function FotoJanela({ foto, aoFechar }: { foto: Foto; aoFechar: () => void }) {
  const invalidar = useAcaoPontos(invalidarFoto)
  const [confirmando, setConfirmando] = useState(false)
  const [motivo, setMotivo] = useState('')
  const clicar = async () => {
    if (!confirmando) return setConfirmando(true)
    await invalidar.mutateAsync({ id: foto.id, motivo: motivo.trim() || f.motivoPadrao })
    aoFechar()
  }
  return (
    <Janela
      larga
      titulo={foto.perfis?.nome ?? '-'}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {t.fechar}
          </BotaoBrilho>
          {!foto.invalidado_em && (
            <BotaoBrilho tom="coral" disabled={invalidar.isPending} onClick={clicar}>
              {confirmando ? f.confirmar : f.invalidar}
            </BotaoBrilho>
          )}
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_17rem]">
        {foto.url && (
          <img
            src={foto.url}
            alt=""
            className="max-h-[65vh] w-full rounded-2xl bg-trilho object-contain"
          />
        )}
        <Detalhe foto={foto} confirmando={confirmando} motivo={motivo} setMotivo={setMotivo} />
      </div>
    </Janela>
  )
}
