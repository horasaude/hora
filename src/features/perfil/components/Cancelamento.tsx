import { useState } from 'react'
import { AvisoErro, BotaoBrilho, Janela } from '@/components/ui'
import { dentroDoArrependimento } from '@/domain/cancelamento'
import { formatarData } from '@/lib/datas'
import type { PedidoDaAluna } from '../api/cancelamento.api'
import { useMeuPedido, usePedirCancelamento } from '../hooks/useCancelamento'
import { textos } from '../textos'

const t = textos.cancelamento
const data = (iso: string | null) => (iso ? formatarData(new Date(iso)) : '-')

function Resultado({
  r,
  fim,
}: {
  r: ReturnType<typeof usePedirCancelamento>['data']
  fim: string
}) {
  if (r?.tipo === 'nao_renovar') return <>{t.naoRenovaOk(fim)}</>
  return <>{r?.estornado ? t.estornoFeito : t.estornoPendente}</>
}

function JanelaCancelar({ pedido, aoFechar }: { pedido: PedidoDaAluna; aoFechar: () => void }) {
  const cancelar = usePedirCancelamento()
  const [motivo, setMotivo] = useState('')
  const [agora] = useState(() => new Date())
  const fim = data(pedido.fim_acesso)
  const dentro = dentroDoArrependimento(new Date(pedido.aprovado_em ?? 0), agora)
  const encerrou = cancelar.data?.tipo === 'arrependimento' && cancelar.data.estornado
  const fechar = encerrou ? () => window.location.assign('/app') : aoFechar
  const rodape = cancelar.isSuccess ? (
    <BotaoBrilho onClick={fechar}>{t.fechar}</BotaoBrilho>
  ) : (
    <div className="flex flex-wrap justify-end gap-2">
      <BotaoBrilho tom="cinza" onClick={aoFechar}>
        {t.voltar}
      </BotaoBrilho>
      <BotaoBrilho
        tom="coral"
        onClick={() => cancelar.mutate(motivo)}
        disabled={cancelar.isPending}
      >
        {cancelar.isPending ? t.cancelando : t.confirmar}
      </BotaoBrilho>
    </div>
  )
  return (
    <Janela titulo={t.titulo} aoFechar={fechar} rodape={rodape}>
      {cancelar.isSuccess ? (
        <p role="status" className="text-sm text-tinta">
          <Resultado r={cancelar.data} fim={fim} />
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-tinta">{dentro ? t.dentro : t.fora(fim)}</p>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{t.motivo}</span>
            <textarea
              rows={3}
              maxLength={500}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="rounded-xl border border-linha bg-white px-4 py-3"
            />
          </label>
        </div>
      )}
      <AvisoErro texto={cancelar.isError ? t.erro : null} />
    </Janela>
  )
}

/** Cancelar inscrição: até 7 dias estorna tudo; depois o plano segue até o fim e não renova. */
export function Cancelamento() {
  const pedido = useMeuPedido().data
  const [aberta, setAberta] = useState(false)
  if (!pedido || pedido.status !== 'aprovado') return null
  if (pedido.cancelamento_pedido_em) {
    const quando = data(pedido.cancelamento_pedido_em)
    const texto =
      pedido.cancelamento_tipo === 'arrependimento'
        ? t.pedidoEstorno(quando)
        : t.pedido(quando, data(pedido.fim_acesso))
    return <p className="text-[13px] text-suave">{texto}</p>
  }
  return (
    <div>
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="text-[13px] text-suave underline underline-offset-2"
      >
        {t.botao}
      </button>
      {aberta && <JanelaCancelar pedido={pedido} aoFechar={() => setAberta(false)} />}
    </div>
  )
}
