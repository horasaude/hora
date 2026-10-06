import { textos } from '../textos'
import { Secao } from './Secao'

const iniciais = (nome: string) =>
  nome
    .replace(/^Dra?\.\s*/, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

type Cartao = { titulo: string; texto: string }

/** Foto com círculo atrás e um cartão de app flutuando, no estilo da Nutrium. */
function Foto({ nome, foto, cartao }: { nome: string; foto?: string; cartao: Cartao }) {
  return (
    <div className="relative isolate">
      <span
        aria-hidden="true"
        className="absolute -right-3 -bottom-3 -z-10 size-40 rounded-full bg-salvia/20"
      />
      {foto ? (
        <img
          src={foto}
          alt={nome}
          width={800}
          height={1000}
          loading="lazy"
          className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid aspect-[4/5] w-full place-items-center rounded-[1.5rem] bg-salvia font-titulo text-6xl text-creme"
        >
          {iniciais(nome)}
        </div>
      )}
      <div className="flutuar absolute bottom-4 -left-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-ora p-1.5">
          <img src="/logo-ora.png" alt="" className="w-full brightness-0 invert" />
        </span>
        <span className="text-xs leading-tight">
          <b className="block font-semibold text-ora">{cartao.titulo}</b>
          <span className="text-suave">{cartao.texto}</span>
        </span>
      </div>
    </div>
  )
}

export function Profissionais() {
  const t = textos.profissionais
  return (
    <Secao cta={t.cta} etiqueta={t.etiqueta} titulo={t.titulo} fundo="branco">
      <ul className="grid gap-10 sm:grid-cols-3 sm:gap-5">
        {t.pessoas.map((p, i) => (
          <li key={p.nome} data-revelar style={{ transitionDelay: `${i * 140}ms` }}>
            <Foto nome={p.nome} foto={p.foto} cartao={p.cartao} />
            <p className="mt-4 text-[0.7rem] font-medium tracking-[0.22em] text-suave uppercase italic">
              {p.papel}
            </p>
            <p className="mt-2 font-titulo text-4xl text-ora uppercase">{p.nome}</p>
            <p className="mt-3 leading-relaxed text-tinta">{p.frase}</p>
          </li>
        ))}
      </ul>
    </Secao>
  )
}

/** Pronto para receber depoimentos reais. Enquanto a lista estiver vazia, a seção não aparece. */
export function Depoimentos() {
  const t = textos.depoimentos
  if (!t.itens.length) return null
  return (
    <Secao cta={t.cta} etiqueta={t.etiqueta} titulo={t.titulo}>
      <ul className="grid gap-6 sm:grid-cols-2">
        {t.itens.map((d) => (
          <li key={d.nome} className="rounded-[1.5rem] bg-white p-7">
            <blockquote className="text-lg leading-relaxed text-tinta italic">{d.texto}</blockquote>
            <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-ora uppercase">
              {d.nome}
            </p>
          </li>
        ))}
      </ul>
    </Secao>
  )
}
