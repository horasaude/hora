import { useSearchParams } from 'react-router-dom'
import { BotaoBrilho } from '@/components/ui'
import { useConectarGoogle, useContaGoogle } from '../hooks/useMeet'
import { meet } from '../textos/meet'
import { Etiqueta } from './Tabela'

/** Topo das Lives: conta Google conectada com Trocar conta, ou o botão de conectar; avisa o resultado da volta do Google. */
export function ConectarMeet() {
  const conta = useContaGoogle()
  const conectar = useConectarGoogle()
  const [busca] = useSearchParams()
  const volta = busca.get('google')
  return (
    <div className="flex flex-col items-end gap-1">
      {conta.isSuccess && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {conta.data && <Etiqueta tom="neutro">{meet.conectado(conta.data)}</Etiqueta>}
          <BotaoBrilho
            tom={conta.data ? 'cinza' : undefined}
            onClick={() => conectar.mutate()}
            disabled={conectar.isPending}
          >
            {conectar.isPending ? meet.conectando : conta.data ? meet.reconectar : meet.conectar}
          </BotaoBrilho>
        </div>
      )}
      {volta && (
        <p role="status" className="text-sm text-tinta">
          {volta === 'ok' ? meet.conectou : meet.naoConectou}
        </p>
      )}
      {conectar.isError && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {meet.naoConectou}
        </p>
      )}
    </div>
  )
}
