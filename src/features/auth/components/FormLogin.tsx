import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Botao, Campo } from '@/components/ui'
import { loginSchema, type LoginDados } from '../schemas/login.schema'
import { useLogin } from '../hooks/useLogin'
import { textos } from '../textos'

export function FormLogin({ aoEsquecer }: { aoEsquecer: () => void }) {
  const login = useLogin()
  const { register, handleSubmit, formState } = useForm<LoginDados>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit((dados) => login.mutate(dados))} className="flex flex-col gap-4">
      <Campo
        rotulo={textos.email}
        type="email"
        autoComplete="email"
        erro={formState.errors.email?.message}
        {...register('email')}
      />
      <Campo
        rotulo={textos.senha}
        type="password"
        autoComplete="current-password"
        erro={formState.errors.senha?.message}
        {...register('senha')}
      />
      <button
        type="button"
        onClick={aoEsquecer}
        className="min-h-11 self-end text-sm text-ora underline underline-offset-2"
      >
        {textos.esqueci.abrir}
      </button>
      {login.isError && (
        <p role="alert" className="text-sm text-terracota">
          {textos.erroCredenciais}
        </p>
      )}
      <Botao type="submit" disabled={login.isPending}>
        {login.isPending ? textos.entrando : textos.entrar}
      </Botao>
    </form>
  )
}
