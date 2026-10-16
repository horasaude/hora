import { BotaoBrilho } from '@/components/ui'
import { ErroMeet } from '../api/meet.api'
import { useCriarSala } from '../hooks/useMeet'
import { meet } from '../textos/meet'

/** Live sem link: cria a sala do Meet na conta Google da ORA. */
export function SalaMeet({ live }: { live: string }) {
  const criar = useCriarSala()
  const erro =
    criar.error instanceof ErroMeet && criar.error.message === 'sem_conexao'
      ? meet.semConexao
      : meet.falha
  return (
    <>
      <BotaoBrilho tom="dourado" onClick={() => criar.mutate(live)} disabled={criar.isPending}>
        {criar.isPending ? meet.criando : meet.criarSala}
      </BotaoBrilho>
      {criar.isError && (
        <p role="alert" className="w-full text-sm text-terracota-escuro">
          {erro}
        </p>
      )}
    </>
  )
}
