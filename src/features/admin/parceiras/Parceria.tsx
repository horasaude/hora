import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { ParceiraJanela } from './ParceiraJanela'
import { t } from './textos'
import { useReenviarEmail } from './useParceiras'

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

/** Ficha da parceira: reenviar o e-mail com o botão de criar a senha. */
export function ReenviarEmail({ perfil }: { perfil: string }) {
  const reenviar = useReenviarEmail()
  const aviso = reenviar.isError || reenviar.data === false ? t.erros.reenviar : t.reenviado
  return (
    <section className="flex flex-col gap-2 border-t border-linha pt-5">
      <h3 className="text-sm font-semibold text-suave">{t.secao}</h3>
      <BotaoBrilho
        tom="cinza"
        className="self-start"
        disabled={reenviar.isPending}
        onClick={() => reenviar.mutate(perfil)}
      >
        {reenviar.isPending ? t.reenviando : t.reenviar}
      </BotaoBrilho>
      {(reenviar.isSuccess || reenviar.isError) && (
        <p role="status" className="text-sm text-tinta">
          {aviso}
        </p>
      )}
    </section>
  )
}
