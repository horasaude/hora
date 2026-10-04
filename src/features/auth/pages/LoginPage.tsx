import { FormLogin } from '../components/FormLogin'
import { textos } from '../textos'

export function LoginPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-8 px-4">
      <h1 className="font-titulo text-3xl text-ora">{textos.titulo}</h1>
      <FormLogin />
    </main>
  )
}
