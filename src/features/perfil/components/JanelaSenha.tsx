import { useState } from 'react'
import { AvisoErro, BotaoBrilho, Campo, Janela, RodapeSalvar } from '@/components/ui'
import { useTrocarSenha } from '../hooks/usePerfil'
import { esquemaSenha } from '../schemas/perfil.schema'
import { textos } from '../textos'

const t = textos.config

/** Trocar senha: nova e repetida. */
export function JanelaSenha({ aoFechar }: { aoFechar: () => void }) {
  const trocar = useTrocarSenha()
  const [senha, setSenha] = useState('')
  const [repetir, setRepetir] = useState('')
  const [aviso, setAviso] = useState<string | null>(null)
  const enviar = () => {
    const r = esquemaSenha.safeParse({ senha, repetir })
    if (!r.success) return setAviso(r.error.issues[0]?.message ?? textos.erroSalvar)
    setAviso(null)
    trocar.mutate(r.data.senha)
  }
  return (
    <Janela
      titulo={t.senha}
      aoFechar={aoFechar}
      rodape={
        trocar.isSuccess ? (
          <BotaoBrilho onClick={aoFechar}>{textos.fechar}</BotaoBrilho>
        ) : (
          <RodapeSalvar
            aoCancelar={aoFechar}
            aoSalvar={enviar}
            salvando={trocar.isPending}
            textos={textos}
          />
        )
      }
    >
      {trocar.isSuccess ? (
        <p role="status" className="text-sm text-tinta">
          {t.senhaOk}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            rotulo={t.senhaNova}
            name="nova-senha"
            type="password"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Campo
            rotulo={t.senhaRepetir}
            name="repetir-senha"
            type="password"
            autoComplete="new-password"
            value={repetir}
            onChange={(e) => setRepetir(e.target.value)}
          />
        </div>
      )}
      <AvisoErro texto={aviso ?? (trocar.isError ? textos.erroSalvar : null)} />
    </Janela>
  )
}
