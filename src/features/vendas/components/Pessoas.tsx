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
    return <img src={foto} alt={nome} className="aspect-[4/5] w-full rounded-2xl object-cover" />
  }
  return (
    <div
      aria-hidden="true"
      className="grid aspect-[4/5] w-full place-items-center rounded-2xl bg-salvia font-titulo text-6xl text-white"
    >
      {iniciais(nome)}
    </div>
  )
}

export function Profissionais() {
  const t = textos.profissionais
  return (
    <Secao titulo={t.titulo}>
      <ul className="grid gap-12 sm:grid-cols-3 sm:gap-6">
        {t.pessoas.map((p) => (
          <li key={p.nome}>
            <Foto nome={p.nome} foto={p.foto} />
            <p className="mt-5 font-titulo text-3xl font-semibold text-ora">{p.nome}</p>
            <p className="mt-1 text-sm font-bold tracking-wide text-terracota uppercase">
              {p.papel}
            </p>
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
    <Secao titulo={t.titulo} fundo="areia">
      <ul className="grid gap-6 sm:grid-cols-2">
        {t.itens.map((d) => (
          <li key={d.nome} className="rounded-2xl bg-white p-6">
            <blockquote className="text-lg leading-relaxed text-tinta">{d.texto}</blockquote>
            <p className="mt-4 font-bold text-ora">{d.nome}</p>
          </li>
        ))}
      </ul>
    </Secao>
  )
}
