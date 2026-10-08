import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Botao, Campo } from '@/components/ui'
import { pedirNovaSenha } from '../api/auth.api'
import { textos } from '../textos'

const t = textos.esqueci
const esquema = z.object({ email: z.string().trim().pipe(z.email('Confira o e-mail')) })
type Dados = z.infer<typeof esquema>

/** Pede o link de nova senha por e-mail; a resposta é a mesma com ou sem conta. */
export function FormEsqueci({ aoVoltar }: { aoVoltar: () => void }) {
  const [resultado, setResultado] = useState<'enviado' | 'muitas' | null>(null)
  const { register, handleSubmit, formState } = useForm<Dados>({ resolver: zodResolver(esquema) })

  const enviar = handleSubmit(async ({ email }) => setResultado(await pedirNovaSenha(email)))

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-ora">{t.titulo}</h2>
      {resultado === 'enviado' ? (
        <p role="status" className="text-tinta">
          {t.enviado}
        </p>
      ) : (
        <>
          <Campo
            rotulo={textos.email}
            type="email"
            autoComplete="email"
            erro={formState.errors.email?.message}
            {...register('email')}
          />
          {resultado === 'muitas' && (
            <p role="alert" className="text-sm text-terracota">
              {t.muitas}
            </p>
          )}
          <Botao type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? t.enviando : t.enviar}
          </Botao>
        </>
      )}
      <button
        type="button"
        onClick={aoVoltar}
        className="min-h-11 text-sm text-ora underline underline-offset-2"
      >
        {t.voltar}
      </button>
    </form>
  )
}
