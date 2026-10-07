import { useId, useState } from 'react'
import { Campo, Janela } from '@/components/ui'
import { CATEGORIAS_LOJA, ehCategoriaLoja } from '@/domain/loja'
import { RodapeForm } from '../../components/RodapeForm'
import { salvarProduto, type Produto } from '../api/loja.api'
import { useAcaoLoja, useLinksFotos, useParceiros } from '../hooks/useLoja'
import { t } from '../textos'
import {
  inicialProduto,
  precoFinal,
  validarProduto,
  type ValoresProduto as Valores,
} from '../formulario'
import { CampoFoto } from './CampoFoto'
import { CamposPreco } from './CamposPreco'
import { Marcar, Selecao, Texto } from './Campos'

function Campos({ v, mudar }: { v: Valores; mudar: (x: Partial<Valores>) => void }) {
  const parceiros = useParceiros().data ?? []
  return (
    <div className="grid content-start gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Campo
          rotulo={t.produto.nome}
          maxLength={120}
          value={v.nome}
          onChange={(e) => mudar({ nome: e.target.value })}
        />
      </div>
      <Selecao
        rotulo={t.produto.parceiro}
        valor={v.parceiro}
        opcoes={parceiros.map((p) => [p.id, p.nome])}
        aoMudar={(parceiro) => mudar({ parceiro })}
      />
      <Selecao
        rotulo={t.produto.categoria}
        valor={v.categoria}
        opcoes={Object.entries(CATEGORIAS_LOJA)}
        aoMudar={(c) => ehCategoriaLoja(c) && mudar({ categoria: c })}
      />
      <Texto
        rotulo={t.produto.descricao}
        valor={v.descricao}
        aoMudar={(descricao) => mudar({ descricao })}
      />
      <CamposPreco p={v.preco} mudar={(x) => mudar({ preco: { ...v.preco, ...x } })} />
      <Campo
        rotulo={t.produto.cupom}
        maxLength={40}
        value={v.cupom}
        onChange={(e) => mudar({ cupom: e.target.value })}
      />
      <Campo
        rotulo={t.produto.link}
        type="url"
        value={v.link}
        onChange={(e) => mudar({ link: e.target.value })}
      />
      <Marcar
        rotulo={t.produto.destaque}
        valor={v.destaque}
        aoMudar={(destaque) => mudar({ destaque })}
      />
      <Marcar
        rotulo={t.produto.publicado}
        valor={v.publicado}
        aoMudar={(publicado) => mudar({ publicado })}
      />
    </div>
  )
}

/** Cadastro de produto em janela grande: foto à esquerda, campos em duas colunas. */
export function ProdutoJanela({ p, aoFechar }: { p: Produto | null; aoFechar: () => void }) {
  const id = useId()
  const primeiro = useParceiros().data?.[0]?.id ?? ''
  const [v, setV] = useState(() => inicialProduto(p, primeiro))
  const [arquivo, setArquivo] = useState<File>()
  const [erro, setErro] = useState('')
  const salvar = useAcaoLoja(salvarProduto)
  const fotos = useLinksFotos(p?.foto_path ? [p.foto_path] : []).data ?? {}
  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const problema = validarProduto(v, arquivo)
    if (problema) return setErro(problema)
    salvar.mutate(
      {
        id: p?.id,
        nome: v.nome.trim(),
        parceiro_id: v.parceiro,
        categoria: v.categoria,
        descricao: v.descricao.trim(),
        preco_centavos: v.preco.preco,
        preco_final_centavos: precoFinal(v.preco),
        cupom: v.cupom.trim() || null,
        link_url: v.link.trim(),
        destaque: v.destaque,
        publicado: v.publicado,
        arquivo,
      },
      { onSuccess: aoFechar, onError: () => setErro(t.erros.salvar) },
    )
  }
  return (
    <Janela
      larga
      titulo={p ? t.produto.editar(p.nome) : t.produto.novo}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={<RodapeForm formId={id} salvando={salvar.isPending} aoCancelar={aoFechar} />}
    >
      <form
        id={id}
        onSubmit={enviar}
        noValidate
        className="grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)]"
      >
        <CampoFoto
          rotulo={t.produto.foto}
          atual={p?.foto_path ? fotos[p.foto_path] : undefined}
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
