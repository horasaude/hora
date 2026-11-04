import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { BotaoExcluir } from '../components/BotaoExcluir'
import { ParceiraJanela } from './ParceiraJanela'
import { t } from './textos'
import { useEncerrarParceria, useReenviarEmail } from './useParceiras'

/** Botão dourado no topo de Alunas que abre o cadastro da parceira. */
export function BotaoParceira() {
  const [aberta, setAberta] = useState(false)
  return (
    <>
      <BotaoBrilho tom="dourado" onClick={() => setAberta(true)}>
        {t.botao}
      </BotaoBrilho>
      {aberta && <ParceiraJanela aoFechar={() => setAberta(false)} />}
    </>
  )
}

function ReenviarEmail({ perfil }: { perfil: string }) {
  const reenviar = useReenviarEmail()
  const aviso = reenviar.isError || reenviar.data === false ? t.erros.reenviar : t.reenviado
  return (
    <span className="flex flex-col gap-1">
      <BotaoBrilho
        tom="cinza"
        disabled={reenviar.isPending}
        onClick={() => reenviar.mutate(perfil)}
      >
        {reenviar.isPending ? t.reenviando : t.reenviar}
      </BotaoBrilho>
      {(reenviar.isSuccess || reenviar.isError) && (
        <span role="status" className="text-xs text-tinta">
          {aviso}
        </span>
      )}
    </span>
  )
}

/** Ficha da parceira: com acesso, reenviar o e-mail e encerrar a parceria (dois toques). */
export function SecaoParceria({ perfil, ativa }: { perfil: string; ativa: boolean }) {
  const encerrar = useEncerrarParceria()
  return (
    <section className="flex flex-col gap-2 border-t border-linha pt-5">
      <h3 className="text-sm font-semibold text-suave">{t.secao}</h3>
      {ativa ? (
        <div className="flex flex-wrap items-start gap-2">
          <ReenviarEmail perfil={perfil} />
          <BotaoExcluir
            rotulo={t.encerrar}
            confirmar={t.confirmarEncerrar}
            excluindo={t.encerrando}
            aoExcluir={() => encerrar.mutateAsync(perfil)}
            mensagemDe={() => t.erros.encerrar}
          />
        </div>
      ) : (
        <p className="text-sm text-tinta">{t.encerrada}</p>
      )}
    </section>
  )
}
