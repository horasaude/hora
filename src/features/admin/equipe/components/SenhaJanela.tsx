import { useId, useState } from 'react'
import { BotaoBrilho, CampoSenha, Janela } from '@/components/ui'
import { RodapeForm } from '../../components/RodapeForm'
import { definirSenhaProfissional, type Profissional } from '../api/equipe.api'
import { useAcaoEquipe } from '../hooks/useEquipe'
import { t } from '../textos'

/** Nova senha para quem já está na equipe; depois de salvar, avisa que ela já pode entrar. */
export function SenhaJanela({ p, aoFechar }: { p: Profissional; aoFechar: () => void }) {
  const id = useId()
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [salva, setSalva] = useState(false)
  const salvar = useAcaoEquipe(definirSenhaProfissional)
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (senha.length < 8 || senha.length > 72) return setErro(t.erros.senha)
    try {
      await salvar.mutateAsync({ perfil: p.id, senha })
      setSalva(true)
    } catch {
      setErro(t.erros.falha)
    }
  }
  return (
    <Janela
      titulo={t.senhaDe(p.nome)}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={
        salva ? (
          <BotaoBrilho onClick={aoFechar}>{t.fechar}</BotaoBrilho>
        ) : (
          <RodapeForm formId={id} salvando={salvar.isPending} aoCancelar={aoFechar} />
        )
      }
    >
      {salva ? (
        <p role="status" className="text-sm text-tinta">
          {t.senhaSalva(p.nome)}
        </p>
      ) : (
        <form id={id} onSubmit={enviar} noValidate className="flex flex-col gap-3">
          <CampoSenha
            id="equipe-nova-senha"
            rotulo={t.campos.senha}
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && (
            <p role="alert" className="text-sm text-terracota-escuro">
              {erro}
            </p>
          )}
        </form>
      )}
    </Janela>
  )
}
