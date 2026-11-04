import { useId, useState } from 'react'
import { BotaoBrilho, Campo, Janela } from '@/components/ui'
import { ErroForm } from '../components/RodapeForm'
import { ErroParceira } from './parceiras.api'
import { PRAZOS, t, type Prazo } from './textos'
import { useCadastrarParceira } from './useParceiras'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function mensagem(e: unknown): string {
  const c = e instanceof ErroParceira ? e.message : ''
  return c === 'ja_tem_acesso' || c === 'equipe' ? t.erros[c] : t.erros.falha
}

function EscolherPrazo({ valor, mudar }: { valor: Prazo; mudar: (p: Prazo) => void }) {
  return (
    <fieldset className="flex flex-col gap-2 text-sm sm:col-span-2">
      <legend className="mb-1 font-medium">{t.prazo}</legend>
      <div className="flex flex-wrap gap-2">
        {PRAZOS.map((p) => (
          <BotaoBrilho
            key={p}
            tom={p === valor ? 'verde' : 'cinza'}
            aria-pressed={p === valor}
            onClick={() => mudar(p)}
          >
            {t.meses(p)}
          </BotaoBrilho>
        ))}
      </div>
    </fieldset>
  )
}

type PropsRodape = { feito: boolean; formId: string; salvando: boolean; aoFechar: () => void }

function Rodape({ feito, formId, salvando, aoFechar }: PropsRodape) {
  if (feito) return <BotaoBrilho onClick={aoFechar}>{t.fechar}</BotaoBrilho>
  return (
    <>
      <BotaoBrilho tom="cinza" onClick={aoFechar}>
        {t.fechar}
      </BotaoBrilho>
      <BotaoBrilho type="submit" form={formId} disabled={salvando}>
        {salvando ? t.cadastrando : t.cadastrar}
      </BotaoBrilho>
    </>
  )
}

/** Cadastrar parceira: nome, e-mail e prazo; ao salvar, a conta nasce com acesso e ela recebe o e-mail. */
export function ParceiraJanela({ aoFechar }: { aoFechar: () => void }) {
  const id = useId()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [meses, setMeses] = useState<Prazo>(12)
  const [erro, setErro] = useState('')
  const [feito, setFeito] = useState('')
  const cadastrar = useCadastrarParceira()
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    const limpo = email.trim().toLowerCase()
    if (!nome.trim()) return setErro(t.erros.nome)
    if (!EMAIL.test(limpo)) return setErro(t.erros.email)
    setErro('')
    try {
      const enviado = await cadastrar.mutateAsync({ nome: nome.trim(), email: limpo, meses })
      setFeito(enviado ? t.pronto(limpo) : t.semEmail(limpo))
    } catch (err) {
      setErro(mensagem(err))
    }
  }
  const rodape = (
    <Rodape feito={Boolean(feito)} formId={id} salvando={cadastrar.isPending} aoFechar={aoFechar} />
  )
  return (
    <Janela titulo={t.titulo} aoFechar={aoFechar} rotuloFechar={t.fechar} rodape={rodape}>
      {feito ? (
        <p role="status" className="text-tinta">
          {feito}
        </p>
      ) : (
        <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
          <Campo
            rotulo={t.nome}
            name="parceira-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Campo
            rotulo={t.email}
            name="parceira-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <EscolherPrazo valor={meses} mudar={setMeses} />
          <ErroForm mensagem={erro} />
        </form>
      )}
    </Janela>
  )
}
