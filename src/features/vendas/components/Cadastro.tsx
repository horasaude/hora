import { Botao, Campo } from '@/components/ui'
import type { Plano } from '@/domain/precos'
import { CAMINHO_CONTRATO } from '@/domain/termos'
import { useCadastro } from '../hooks/useCadastro'
import { textos } from '../textos'
import { EscolhaPlano } from './EscolhaPlano'
import type { OpcaoPreco } from './opcoes'

const t = textos.cadastro

type Props = { opcoes: OpcaoPreco[]; onCadastrado: (plano: Plano) => void }

export function Cadastro({ opcoes, onCadastrado }: Props) {
  const { form, enviar, falhou, whatsapp } = useCadastro(onCadastrado)
  const { register, formState } = form
  const { errors: erros, isSubmitting: enviando } = formState
  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <EscolhaPlano opcoes={opcoes} campo={register('plano')} erro={erros.plano?.message} />
      <Campo rotulo={t.nome} autoComplete="name" erro={erros.nome?.message} {...register('nome')} />
      <Campo
        rotulo={t.email}
        type="email"
        autoComplete="email"
        erro={erros.email?.message}
        {...register('email')}
      />
      <Campo
        rotulo={t.whatsapp}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        erro={erros.whatsapp?.message}
        {...whatsapp}
      />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="site">{t.site}</label>
        <input id="site" type="text" tabIndex={-1} autoComplete="off" {...register('site')} />
      </div>
      <label className="flex min-h-11 items-start gap-3 text-sm">
        <input type="checkbox" className="mt-0.5 size-5 accent-ora" {...register('aceite')} />
        <span>
          {t.aceiteAntes}
          <a href={CAMINHO_CONTRATO} target="_blank" rel="noopener" className="text-ora underline">
            {t.aceiteLink}
          </a>
        </span>
      </label>
      {erros.aceite && <p className="-mt-2 text-sm text-terracota">{erros.aceite.message}</p>}
      {falhou && (
        <p role="alert" className="text-sm text-terracota">
          {t.erros.envio}
        </p>
      )}
      <Botao type="submit" disabled={enviando} className="min-h-12">
        {enviando ? t.enviando : t.botao}
      </Botao>
    </form>
  )
}
