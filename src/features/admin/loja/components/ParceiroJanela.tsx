import { useId, useState } from 'react'
import { Campo, Janela } from '@/components/ui'
import { mascararTelefone, soDigitos } from '@/lib/telefone'
import { RodapeForm } from '../../components/RodapeForm'
import { salvarParceiro, type Parceiro } from '../api/loja.api'
import { useAcaoLoja, useLinksFotos } from '../hooks/useLoja'
import { inicialParceiro, validarParceiro, type ValoresParceiro as Valores } from '../formulario'
import { t } from '../textos'
import { CampoFoto } from './CampoFoto'
import { Marcar, Texto } from './Campos'

const tp = t.parceiro

function Campos({ v, mudar }: { v: Valores; mudar: (x: Partial<Valores>) => void }) {
  return (
    <div className="grid content-start gap-4 sm:grid-cols-2">
      <Campo
        rotulo={tp.nome}
        maxLength={80}
        value={v.nome}
        onChange={(e) => mudar({ nome: e.target.value })}
      />
      <Campo
        rotulo={tp.cupom}
        maxLength={40}
        value={v.cupom}
        onChange={(e) => mudar({ cupom: e.target.value })}
      />
      <Texto
        rotulo={tp.descricao}
        valor={v.descricao}
        linhas={3}
        aoMudar={(descricao) => mudar({ descricao: descricao.slice(0, 300) })}
      />
      <Campo
        rotulo={tp.whatsapp}
        inputMode="tel"
        value={v.whatsapp}
        onChange={(e) => mudar({ whatsapp: mascararTelefone(e.target.value) })}
      />
      <Campo
        rotulo={tp.site}
        type="url"
        placeholder="https://"
        value={v.site}
        onChange={(e) => mudar({ site: e.target.value })}
      />
      <Marcar rotulo={tp.ativo} valor={v.ativo} aoMudar={(ativo) => mudar({ ativo })} />
    </div>
  )
}

/** Cadastro de parceiro em janela grande: logo, nome, descrição, cupom geral, contato e ativo. */
export function ParceiroJanela({ p, aoFechar }: { p: Parceiro | null; aoFechar: () => void }) {
  const id = useId()
  const [v, setV] = useState<Valores>(() => inicialParceiro(p))
  const [arquivo, setArquivo] = useState<File>()
  const [erro, setErro] = useState('')
  const salvar = useAcaoLoja(salvarParceiro)
  const logo = useLinksFotos(p?.logo_path ? [p.logo_path] : []).data ?? {}
  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const problema = validarParceiro(v, arquivo)
    if (problema) return setErro(problema)
    salvar.mutate(
      {
        id: p?.id,
        nome: v.nome.trim(),
        descricao: v.descricao.trim(),
        cupom: v.cupom.trim() || null,
        whatsapp: soDigitos(v.whatsapp) || null,
        site_url: v.site.trim() || null,
        ativo: v.ativo,
        arquivo,
      },
      { onSuccess: aoFechar, onError: () => setErro(t.erros.salvar) },
    )
  }
  return (
    <Janela
      larga
      titulo={p ? tp.editar(p.nome) : tp.novo}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={<RodapeForm formId={id} salvando={salvar.isPending} aoCancelar={aoFechar} />}
    >
      <form
        id={id}
        onSubmit={enviar}
        noValidate
        className="grid gap-6 md:grid-cols-[10rem_minmax(0,1fr)]"
      >
        <CampoFoto
          rotulo={tp.logo}
          redonda
          atual={p?.logo_path ? logo[p.logo_path] : undefined}
          aoEscolher={setArquivo}
        />
        <Campos v={v} mudar={(x) => setV((a) => ({ ...a, ...x }))} />
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro md:col-span-2">
            {erro}
          </p>
        )}
      </form>
    </Janela>
  )
}
