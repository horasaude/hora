import { textos } from '../textos'
import { Secao } from './Secao'

const iniciais = (nome: string) =>
  nome
    .replace(/^Dra?\.\s*/, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

function Foto({ nome, foto }: { nome: string; foto?: string }) {
  if (foto) {
    return (
      <img
        src={foto}
        alt={nome}
        width={800}
        height={1000}
        loading="lazy"
        className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="grid aspect-[4/5] w-full place-items-center rounded-[1.5rem] bg-salvia font-titulo text-6xl text-creme"
    >
      {iniciais(nome)}
    </div>
  )
}

export function Profissionais() {
  const t = textos.profissionais
  return (
    <Secao etiqueta={t.etiqueta} titulo={t.titulo} fundo="branco">
      <ul className="grid gap-10 sm:grid-cols-3 sm:gap-5">
        {t.pessoas.map((p) => (
          <li key={p.nome}>
            <Foto nome={p.nome} foto={p.foto} />
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
    <Secao etiqueta={t.etiqueta} titulo={t.titulo}>
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
