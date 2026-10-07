import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BotaoBrilho, EtiquetaBrilho } from '@/components/ui'
import { ESPECIALIDADES, type Especialidade } from '@/domain/forum'
import { Avatar } from '@/features/forum'
import { formatarData } from '@/lib/datas'
import { Estado } from '../components/Estado'
import { Quadro } from '../components/Quadro'
import { celula, Tabela } from '../components/Tabela'
import { MenuAcoes } from '../plano/components/MenuAcoes'
import { novoLinkDeAcesso, type Profissional } from './api/equipe.api'
import { LinkAcesso } from './components/LinkAcesso'
import { ProfissionalJanela } from './components/ProfissionalJanela'
import { TirarAcesso } from './components/TirarAcesso'
import { useAcaoEquipe, useEquipe } from './hooks/useEquipe'
import { t } from './textos'

type Aberta =
  | { tipo: 'nova' }
  | { tipo: 'editar' | 'tirar'; p: Profissional }
  | { tipo: 'link'; nome: string; link: string }

const esp = (e: string | null) =>
  e && e in ESPECIALIDADES ? ESPECIALIDADES[e as Especialidade] : '-'

function Linha({ p, abrir }: { p: Profissional; abrir: (a: Aberta) => void }) {
  const link = useAcaoEquipe(novoLinkDeAcesso)
  const acoes = [
    { nome: t.editar, aoEscolher: () => abrir({ tipo: 'editar', p }) },
    {
      nome: t.gerarLink,
      aoEscolher: () =>
        link.mutate(p.id, { onSuccess: (l) => abrir({ tipo: 'link', nome: p.nome, link: l }) }),
    },
  ]
  if (!p.eu) acoes.push({ nome: t.tirarAcesso, aoEscolher: () => abrir({ tipo: 'tirar', p }) })
  return (
    <tr className="border-b border-[#F4F5F4] last:border-b-0">
      <td className={celula}>
        <span className="flex items-center gap-3">
          <Avatar nome={p.nome} foto={p.foto_path} />
          <span>
            <span className="block font-bold">
              {p.nome}
              {p.eu && <span className="font-normal text-suave"> ({t.voce})</span>}
            </span>
            <span className="block text-xs text-suave">{p.titulo_profissional}</span>
          </span>
        </span>
      </td>
      <td className={celula}>{p.email}</td>
      <td className={celula}>{esp(p.especialidade)}</td>
      <td className={celula}>
        <EtiquetaBrilho tom={p.convite_pendente ? 'dourado' : 'verde'}>
          {p.convite_pendente ? t.pendente : t.ativa}
        </EtiquetaBrilho>
        <span className="mt-1 block text-xs text-suave">
          {p.ultimo_acesso ? t.ultimoAcesso(formatarData(new Date(p.ultimo_acesso))) : t.nunca}
        </span>
        {link.isError && (
          <span role="alert" className="mt-1 block text-xs text-terracota-escuro">
            {t.erros.falha}
          </span>
        )}
      </td>
      <td className="w-12 px-2 py-2">
        <MenuAcoes nome={p.nome} acoes={acoes} />
      </td>
    </tr>
  )
}

/** Equipe: profissionais com acesso ao painel, convite com link, editar e tirar acesso. */
export function EquipePage() {
  const equipe = useEquipe()
  const [aberta, setAberta] = useState<Aberta | null>(null)
  const fechar = () => setAberta(null)
  const lista = equipe.data ?? []
  const pendentes = lista.filter((p) => p.convite_pendente).length
  return (
    <Quadro
      titulo={t.titulo}
      acao={
        <BotaoBrilho tom="dourado" onClick={() => setAberta({ tipo: 'nova' })}>
          {t.convidar}
        </BotaoBrilho>
      }
      numeros={[
        {
          valor: equipe.data ? String(lista.length - pendentes) : '-',
          rotulo: t.cartoes.ativas,
          tom: 'salvia',
        },
        {
          valor: equipe.data ? String(pendentes) : '-',
          rotulo: t.cartoes.pendentes,
          tom: 'salvia',
        },
      ]}
    >
      <Link
        to="/app/admin/configuracoes"
        className="self-start text-sm text-suave underline underline-offset-4"
      >
        {t.voltar}
      </Link>
      {equipe.isPending ? (
        <Estado tipo="carregando" />
      ) : equipe.isError ? (
        <Estado tipo="erro" tentar={() => equipe.refetch()} />
      ) : (
        <Tabela colunas={t.colunas}>
          {lista.map((p) => (
            <Linha key={p.id} p={p} abrir={setAberta} />
          ))}
        </Tabela>
      )}
      {(aberta?.tipo === 'nova' || aberta?.tipo === 'editar') && (
        <ProfissionalJanela
          p={aberta.tipo === 'editar' ? aberta.p : null}
          aoFechar={fechar}
          aoConvidar={(nome, link) => setAberta({ tipo: 'link', nome, link })}
        />
      )}
      {aberta?.tipo === 'tirar' && <TirarAcesso p={aberta.p} aoFechar={fechar} />}
      {aberta?.tipo === 'link' && (
        <LinkAcesso nome={aberta.nome} link={aberta.link} aoFechar={fechar} />
      )}
    </Quadro>
  )
}
