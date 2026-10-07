import { BotaoBrilho, Janela } from '@/components/ui'
import { removerProfissional, type Profissional } from '../api/equipe.api'
import { useAcaoEquipe } from '../hooks/useEquipe'
import { t } from '../textos'

/** Confirma tirar o acesso ao painel (a conta volta a ser de aluna, sem acesso). */
export function TirarAcesso({ p, aoFechar }: { p: Profissional; aoFechar: () => void }) {
  const acao = useAcaoEquipe(removerProfissional)
  return (
    <Janela
      titulo={t.tirarAcesso}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {t.cancelar}
          </BotaoBrilho>
          <BotaoBrilho
            tom="coral"
            disabled={acao.isPending}
            onClick={() => acao.mutate(p.id, { onSuccess: aoFechar })}
          >
            {t.tirarAcesso}
          </BotaoBrilho>
        </>
      }
    >
      <p className="text-[15px] text-tinta">{t.confirmarTirar(p.nome)}</p>
      {acao.isError && (
        <p role="alert" className="mt-2 text-sm text-terracota-escuro">
          {t.erros.falha}
        </p>
      )}
    </Janela>
  )
}
