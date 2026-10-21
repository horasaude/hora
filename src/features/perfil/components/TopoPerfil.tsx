import { EtiquetaBrilho } from '@/components/ui'
import { useMeuPerfil } from '@/features/auth'
import { FUSO } from '@/lib/datas'
import { textos } from '../textos'
import { Avatar } from './Topo'

/** Mês do início do acesso ("outubro"); de outro ano, com o ano ("outubro de 2025"). */
function mesDoInicio(inicio: string): string {
  const data = new Date(inicio)
  const ano = (d: Date) =>
    new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, year: 'numeric' }).format(d)
  const mesmoAno = ano(data) === ano(new Date())
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    month: 'long',
    ...(mesmoAno ? {} : { year: 'numeric' }),
  }).format(data)
}

/** Topo da Minha evolução, centrado: foto grande, nome e desde quando ela é assinante. */
export function TopoPerfil() {
  const p = useMeuPerfil().data
  const nome = p?.nome || p?.apelido || ''
  return (
    <header className="flex flex-col items-center gap-1.5 pt-1 text-center">
      <Avatar nome={nome} caminho={p?.avatar_path} tamanho="size-[76px] lg:size-24" />
      <h1 className="mt-1 text-[22px] leading-tight font-bold text-verde-escuro lg:text-[28px]">
        {nome}
      </h1>
      {p?.apelido && <p className="-mt-1 text-[13px] text-suave">@{p.apelido}</p>}
      {p?.acesso_inicio_em && (
        <EtiquetaBrilho tom="verde">
          {textos.assinanteDesde(mesDoInicio(p.acesso_inicio_em))}
        </EtiquetaBrilho>
      )}
    </header>
  )
}
