import { EtiquetaBrilho } from '@/components/ui'
import { formatarDataHora } from '@/lib/datas'
import { curtir, fotoEquipe, type RespostaForum } from '../api/forum.api'
import { useAcaoForum } from '../hooks/useForum'
import { textos as t } from '../textos'
import { Denunciar } from './Denunciar'

/** Foto da profissional; sem foto, a inicial do nome. */
export function Avatar({ nome, foto }: { nome: string; foto?: string | null }) {
  if (foto)
    return (
      <img src={fotoEquipe(foto)} alt="" className="size-10 shrink-0 rounded-full object-cover" />
    )
  return (
    <span
      aria-hidden
      className="grid size-10 shrink-0 place-items-center rounded-full bg-terracota-suave text-sm font-bold text-terracota-escuro"
    >
      {nome[0]?.toUpperCase()}
    </span>
  )
}

function Curtir({ r, painel }: { r: RespostaForum; painel: boolean }) {
  const acao = useAcaoForum(curtir)
  if (painel) return <span className="text-xs text-suave">{t.curtir(r.curtidas)}</span>
  return (
    <button
      type="button"
      aria-pressed={r.curti}
      disabled={acao.isPending}
      onClick={() => acao.mutate({ resposta: r.id, curtir: !r.curti })}
      className={`text-xs font-bold ${r.curti ? 'text-terracota-escuro' : 'text-suave hover:text-tinta'}`}
    >
      {r.curti ? t.curtida(r.curtidas) : t.curtir(r.curtidas)}
    </button>
  )
}

/** Resposta: a das profissionais vem destacada, com foto, nome, especialidade e Resposta útil. */
export function Resposta({
  r,
  util,
  painel = false,
}: {
  r: RespostaForum
  util: boolean
  painel?: boolean
}) {
  const caixa = r.da_equipe
    ? 'rounded-[18px] border border-[#D5E8DC] bg-[#F1F8F3] p-4'
    : 'border-l-2 border-[#ECEFED] py-1 pl-4'
  return (
    <li className={`flex flex-col gap-2 ${caixa} ${r.oculto ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3">
        {r.da_equipe && <Avatar nome={r.autora} foto={r.foto} />}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-tinta">
            {r.autora}
            {r.titulo && <span className="font-normal text-suave"> · {r.titulo}</span>}
          </p>
          <p className="text-xs text-suave">{formatarDataHora(new Date(r.created_at))}</p>
        </div>
        {r.da_equipe && util && <EtiquetaBrilho tom="verde">{t.util}</EtiquetaBrilho>}
      </div>
      <p className="text-[15px] leading-relaxed whitespace-pre-line text-tinta">{r.texto}</p>
      <div className="flex items-center gap-4">
        <Curtir r={r} painel={painel} />
        {!painel && !r.minha && !r.da_equipe && <Denunciar resposta={r.id} />}
      </div>
    </li>
  )
}
