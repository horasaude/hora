import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Campo } from '@/components/ui'
import { useSalvarPrimeiroAcesso } from '../hooks/useSalvarPrimeiroAcesso'
import { esquemaApelido } from '../schemas/apelido'
import { textos } from '../textos'
import { Moldura } from './Moldura'

const titulo = 'text-[2rem] leading-tight font-bold tracking-tight text-verde-escuro'

function Aceite({ aceito, aoMudar }: { aceito: boolean; aoMudar: (v: boolean) => void }) {
  const t = textos.saude
  return (
    <>
      <h1 className={titulo}>{t.titulo}</h1>
      <p className="text-base leading-relaxed text-tinta">{t.texto}</p>
      <label className="flex items-start gap-3 rounded-[22px] bg-white p-4 text-sm text-tinta shadow-cartao has-checked:ring-2 has-checked:ring-verde-vivo/45">
        <input
          type="checkbox"
          checked={aceito}
          onChange={(e) => aoMudar(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-ora"
        />
        {t.aceite}
      </label>
      <Link
        to="/privacidade"
        target="_blank"
        className="min-h-11 self-start text-sm text-ora underline underline-offset-4"
      >
        {t.politica}
      </Link>
    </>
  )
}

/** Primeiro acesso: boas-vindas, apelido do ranking e aceite do uso dos dados de saúde. */
export function PrimeiroAcesso({ apelidoAtual }: { apelidoAtual?: string | null }) {
  const [passo, setPasso] = useState(1)
  const [apelido, setApelido] = useState(apelidoAtual ?? '')
  const [tocou, setTocou] = useState(false)
  const [aceito, setAceito] = useState(false)
  const salvar = useSalvarPrimeiroAcesso()
  const validado = esquemaApelido.safeParse(apelido)
  const comum = { total: 3, passo }
  if (passo === 1)
    return (
      <Moldura {...comum} podeSeguir aoContinuar={() => setPasso(2)}>
        <img
          src="/logo-ora.png"
          alt="ORA"
          width={482}
          height={189}
          className="h-14 w-auto self-start"
        />
        <h1 className={titulo}>{textos.boasVindas.titulo}</h1>
        <p className="text-base leading-relaxed text-tinta">{textos.boasVindas.texto}</p>
      </Moldura>
    )
  if (passo === 2)
    return (
      <Moldura {...comum} podeSeguir={validado.success} aoContinuar={() => setPasso(3)}>
        <h1 className={titulo}>{textos.apelido.titulo}</h1>
        <Campo
          rotulo={textos.apelido.campo}
          name="apelido"
          placeholder={textos.apelido.exemplo}
          autoCapitalize="none"
          autoComplete="nickname"
          value={apelido}
          onChange={(e) => setApelido(e.target.value)}
          onBlur={() => setTocou(true)}
          erro={tocou && !validado.success ? validado.error.issues[0]?.message : undefined}
        />
        <p className="text-sm text-suave">{textos.apelido.nota}</p>
      </Moldura>
    )
  return (
    <Moldura
      {...comum}
      podeSeguir={aceito && validado.success}
      ocupado={salvar.isPending}
      erro={salvar.isError ? textos.erro : undefined}
      aoContinuar={() => validado.success && salvar.mutate(validado.data)}
    >
      <Aceite aceito={aceito} aoMudar={setAceito} />
    </Moldura>
  )
}
