import { useId, useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { CATEGORIAS, ehCategoria, type Categoria } from '@/domain/forum'
import { perguntar } from '../api/forum.api'
import { useAcaoForum } from '../hooks/useForum'
import { textos as t } from '../textos'

const campo = 'rounded-xl border border-linha bg-white px-4 focus:border-ora focus:outline-none'

function Formulario({ aula, aoFechar, id }: { aula?: string; aoFechar: () => void; id: string }) {
  const [texto, setTexto] = useState('')
  const [cat, setCat] = useState<Categoria>('alimentacao')
  const [erro, setErro] = useState('')
  const acao = useAcaoForum(perguntar)
  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (texto.trim().length < 3) return setErro(t.erroTexto)
    acao.mutate(
      { texto: texto.trim(), categoria: cat, aula },
      {
        onSuccess: aoFechar,
        onError: (e) =>
          setErro((e as { code?: string }).code === '54000' ? t.erroLimite : t.erroEnviar),
      },
    )
  }
  return (
    <form id={id} onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{t.campoDuvida}</span>
        <textarea
          rows={6}
          maxLength={2000}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className={`${campo} py-3 text-[15px]`}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm sm:max-w-xs">
        <span className="font-medium">{t.campoCategoria}</span>
        <select
          value={cat}
          onChange={(e) => ehCategoria(e.target.value) && setCat(e.target.value)}
          className={`${campo} min-h-12`}
        >
          {Object.entries(CATEGORIAS).map(([v, n]) => (
            <option key={v} value={v}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-suave">{t.prazo}</p>
      {erro && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {erro}
        </p>
      )}
    </form>
  )
}

/** Botão Enviar dúvida e a janela com o texto e a categoria. */
export function EnviarDuvida({ aula }: { aula?: string }) {
  const [aberta, setAberta] = useState(false)
  const id = useId()
  return (
    <>
      <BotaoBrilho tom="dourado" onClick={() => setAberta(true)}>
        {t.enviar}
      </BotaoBrilho>
      {aberta && (
        <Janela
          titulo={t.enviar}
          aoFechar={() => setAberta(false)}
          rotuloFechar={t.fechar}
          rodape={
            <>
              <BotaoBrilho tom="cinza" onClick={() => setAberta(false)}>
                {t.cancelar}
              </BotaoBrilho>
              <BotaoBrilho type="submit" form={id}>
                {t.enviar}
              </BotaoBrilho>
            </>
          }
        >
          <Formulario aula={aula} aoFechar={() => setAberta(false)} id={id} />
        </Janela>
      )}
    </>
  )
}
