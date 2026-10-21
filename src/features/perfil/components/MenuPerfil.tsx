import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { JanelaMinhasMedidas } from '@/features/evolucao'
import { textos } from '../textos'
import {
  IconeCelular,
  IconeEngrenagem,
  IconePrancheta,
  IconePresente,
  IconeRegua,
  IconeSeta,
} from './IconesPerfil'
import { JanelaInstalar } from './JanelaInstalar'

const t = textos.menu
const item =
  'flex min-h-14 w-full items-center gap-3 rounded-[16px] border border-linha bg-white px-3.5 py-2.5 text-left text-[15px] font-bold text-tinta transition hover:shadow-menu'

function Conteudo({ icone, cor, nome }: { icone: ReactNode; cor: string; nome: string }) {
  return (
    <>
      <span className={`grid size-[34px] shrink-0 place-items-center rounded-[11px] ${cor}`}>
        {icone}
      </span>
      <span className="flex-1">{nome}</span>
      <IconeSeta className="size-4 text-suave" />
    </>
  )
}

/** Menu do perfil: Avaliações, Indique e ganhe, Minhas medidas, Instalar o app e Minha conta. */
export function MenuPerfil() {
  const [janela, setJanela] = useState<'medidas' | 'instalar' | null>(null)
  const fechar = () => setJanela(null)
  return (
    <nav aria-label={t.rotulo}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link to="/app/avaliacoes" className={item}>
            <Conteudo
              icone={<IconePrancheta />}
              cor="bg-[#fde7df] text-[#c2461f]"
              nome={t.avaliacoes}
            />
          </Link>
        </li>
        <li>
          <Link to="/app/perfil/indique" className={item}>
            <Conteudo
              icone={<IconePresente />}
              cor="bg-[#fdf1d8] text-[#a86d05]"
              nome={t.indique}
            />
          </Link>
        </li>
        <li>
          <button type="button" className={item} onClick={() => setJanela('medidas')}>
            <Conteudo
              icone={<IconeRegua />}
              cor="bg-ora-suave text-verde-escuro"
              nome={t.medidas}
            />
          </button>
        </li>
        <li>
          <button type="button" className={item} onClick={() => setJanela('instalar')}>
            <Conteudo
              icone={<IconeCelular />}
              cor="bg-[#eee9fb] text-[#6a4fbd]"
              nome={t.instalar}
            />
          </button>
        </li>
        <li>
          <Link to="/app/perfil/conta" className={item}>
            <Conteudo icone={<IconeEngrenagem />} cor="bg-trilho text-suave" nome={t.conta} />
          </Link>
        </li>
      </ul>
      {janela === 'medidas' && <JanelaMinhasMedidas aoFechar={fechar} />}
      {janela === 'instalar' && <JanelaInstalar aoFechar={fechar} />}
    </nav>
  )
}
