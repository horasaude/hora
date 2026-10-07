import { BotaoBrilho, EtiquetaBrilho } from '@/components/ui'
import { mascararTelefone } from '@/lib/telefone'
import { Estado } from '../../components/Estado'
import { celula, Tabela } from '../../components/Tabela'
import type { Parceiro } from '../api/loja.api'
import { useLinksFotos, useParceiros } from '../hooks/useLoja'
import { t } from '../textos'
import { Miniatura } from './Miniatura'

const contato = (p: Parceiro) =>
  [p.whatsapp && mascararTelefone(p.whatsapp), p.site_url?.replace(/^https:\/\//, '')]
    .filter(Boolean)
    .join(' · ') || '-'

/** Parceiros: logo, nome, descrição, cupom geral, contato, produtos e ativo; a linha abre a janela. */
export function AbaParceiros({
  editar,
  criar,
}: {
  editar: (p: Parceiro) => void
  criar: () => void
}) {
  const parceiros = useParceiros()
  const logos =
    useLinksFotos((parceiros.data ?? []).flatMap((p) => (p.logo_path ? [p.logo_path] : []))).data ??
    {}
  if (parceiros.isPending) return <Estado tipo="carregando" />
  if (parceiros.isError) return <Estado tipo="erro" tentar={() => parceiros.refetch()} />
  if (parceiros.data.length === 0)
    return (
      <Estado
        tipo="vazio"
        texto={t.vazioParceiros}
        acao={
          <BotaoBrilho tom="dourado" onClick={criar}>
            {t.novoParceiro}
          </BotaoBrilho>
        }
      />
    )
  return (
    <Tabela colunas={t.colunasParceiros}>
      {parceiros.data.map((p) => (
        <tr
          key={p.id}
          onClick={() => editar(p)}
          className="cursor-pointer border-b border-[#F4F5F4] last:border-b-0 hover:bg-[#F8FAF9]"
        >
          <td className={celula}>
            <button
              type="button"
              onClick={() => editar(p)}
              className="flex items-center gap-3 text-left"
            >
              <Miniatura src={p.logo_path ? logos[p.logo_path] : undefined} />
              <span>
                <span className="block font-bold">{p.nome}</span>
                <span className="block max-w-xs text-xs text-suave">{p.descricao}</span>
              </span>
            </button>
          </td>
          <td className={`${celula} font-bold tracking-wide`}>{p.cupom ?? '-'}</td>
          <td className={celula}>{contato(p)}</td>
          <td className={celula}>{p.loja_produtos?.[0]?.count ?? 0}</td>
          <td className="px-3.5 py-3">
            <EtiquetaBrilho tom={p.ativo ? 'verde' : 'cinza'}>
              {p.ativo ? t.ativo : t.inativo}
            </EtiquetaBrilho>
          </td>
        </tr>
      ))}
    </Tabela>
  )
}
