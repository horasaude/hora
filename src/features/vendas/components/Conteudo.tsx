import { textos } from '../textos'
import { Secao } from './Secao'

export function OQueE() {
  const t = textos.oQueE
  return (
    <Secao titulo={t.titulo} fundo="areia">
      <div className="flex flex-col gap-4 text-lg">
        {t.paragrafos.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </Secao>
  )
}

const iniciais = (nome: string) =>
  nome
    .replace('Dra. ', '')
    .split(' ')
    .map((parte) => parte[0])
    .join('')

export function Profissionais() {
  const t = textos.profissionais
  return (
    <Secao titulo={t.titulo}>
      <ul className="flex flex-col gap-6 sm:grid sm:grid-cols-3">
        {t.pessoas.map((p) => (
          <li key={p.nome} className="flex gap-4 sm:flex-col">
            <div
              aria-hidden="true"
              className="flex size-20 shrink-0 items-center justify-center rounded-full bg-areia font-titulo text-2xl text-salvia sm:size-24"
            >
              {iniciais(p.nome)}
            </div>
            <div>
              <p className="font-semibold text-tinta">{p.nome}</p>
              <p className="text-sm text-terracota">{p.papel}</p>
              <p className="mt-2 text-suave">{p.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </Secao>
  )
}

export function ComoFunciona() {
  const t = textos.comoFunciona
  return (
    <Secao titulo={t.titulo} fundo="areia">
      <ol className="flex flex-col gap-5 sm:grid sm:grid-cols-2">
        {t.itens.map((item, i) => (
          <li key={item.titulo} className="border-t border-linha pt-4">
            <span className="font-titulo text-ocre">{String(i + 1).padStart(2, '0')}</span>
            <p className="mt-1 font-semibold text-tinta">{item.titulo}</p>
            <p className="mt-1 text-suave">{item.texto}</p>
          </li>
        ))}
      </ol>
    </Secao>
  )
}
