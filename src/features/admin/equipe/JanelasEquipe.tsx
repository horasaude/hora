import { BotaoBrilho, Janela } from '@/components/ui'
import type { Profissional } from './api/equipe.api'
import { LinkAcesso } from './components/LinkAcesso'
import { ProfissionalJanela } from './components/ProfissionalJanela'
import { SenhaJanela } from './components/SenhaJanela'
import { TirarAcesso } from './components/TirarAcesso'
import { t } from './textos'

export type Aberta =
  | { tipo: 'nova' }
  | { tipo: 'editar' | 'tirar' | 'senha'; p: Profissional }
  | { tipo: 'link'; nome: string; link: string }
  | { tipo: 'pronto'; nome: string; email: string }

function Pronto({ nome, email, aoFechar }: { nome: string; email: string; aoFechar: () => void }) {
  return (
    <Janela
      titulo={t.pronto}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={<BotaoBrilho onClick={aoFechar}>{t.fechar}</BotaoBrilho>}
    >
      <p role="status" className="text-sm text-tinta">
        {t.prontoTexto(nome, email)}
      </p>
    </Janela>
  )
}

/** Janelas da tela Equipe: adicionar, editar, definir senha, tirar acesso, link e o aviso de pronto. */
export function JanelasEquipe({
  aberta,
  abrir,
}: {
  aberta: Aberta | null
  abrir: (a: Aberta | null) => void
}) {
  const fechar = () => abrir(null)
  const setAberta = abrir
  return (
    <>
      {(aberta?.tipo === 'nova' || aberta?.tipo === 'editar') && (
        <ProfissionalJanela
          p={aberta.tipo === 'editar' ? aberta.p : null}
          aoFechar={fechar}
          aoCadastrar={(nome, email) => setAberta({ tipo: 'pronto', nome, email })}
        />
      )}
      {aberta?.tipo === 'tirar' && <TirarAcesso p={aberta.p} aoFechar={fechar} />}
      {aberta?.tipo === 'senha' && <SenhaJanela p={aberta.p} aoFechar={fechar} />}
      {aberta?.tipo === 'pronto' && (
        <Pronto nome={aberta.nome} email={aberta.email} aoFechar={fechar} />
      )}
      {aberta?.tipo === 'link' && (
        <LinkAcesso nome={aberta.nome} link={aberta.link} aoFechar={fechar} />
      )}
    </>
  )
}
