import { useState } from 'react'
import { BoasVindas } from '../components/BoasVindas'
import { FormEsqueci } from '../components/FormEsqueci'
import { FormLogin } from '../components/FormLogin'
import { textos } from '../textos'

/** /entrar: boas-vindas com a foto das profissionais (em cima no celular, à esquerda no computador) e o formulário. */
export function LoginPage() {
  const [esqueci, setEsqueci] = useState(false)
  return (
    <main className="min-h-svh bg-areia lg:grid lg:grid-cols-[1.15fr_1fr]">
      <BoasVindas />
      <div className="flex justify-center px-4 py-8 lg:items-center lg:px-12">
        <div className="flex w-full max-w-sm flex-col gap-6">
          {!esqueci && <h2 className="font-titulo text-[26px] text-ora">{textos.titulo}</h2>}
          {esqueci ? (
            <FormEsqueci aoVoltar={() => setEsqueci(false)} />
          ) : (
            <FormLogin aoEsquecer={() => setEsqueci(true)} />
          )}
        </div>
      </div>
    </main>
  )
}
