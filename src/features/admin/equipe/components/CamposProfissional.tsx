import { Campo, CampoSenha } from '@/components/ui'
import { ESPECIALIDADES } from '@/domain/forum'
import { t } from '../textos'
import { ehEsp, type Valores } from './valoresProfissional'

function CampoEspecialidade({ v, mudar }: { v: Valores; mudar: (p: Partial<Valores>) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{t.campos.especialidade}</span>
      <select
        className="min-h-12 rounded-xl border border-linha bg-white px-4"
        value={v.especialidade ?? ''}
        onChange={(e) => mudar({ especialidade: ehEsp(e.target.value) ? e.target.value : null })}
      >
        <option value="">{t.campos.nenhuma}</option>
        {Object.entries(ESPECIALIDADES).map(([k, n]) => (
          <option key={k} value={k}>
            {n}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Campos({
  v,
  mudar,
  comEmail,
}: {
  v: Valores
  mudar: (p: Partial<Valores>) => void
  comEmail: boolean
}) {
  return (
    <>
      <Campo
        rotulo={t.campos.nome}
        maxLength={120}
        value={v.nome}
        onChange={(e) => mudar({ nome: e.target.value })}
      />
      {comEmail && (
        <>
          <Campo
            id="equipe-email"
            rotulo={t.campos.email}
            type="email"
            autoComplete="off"
            value={v.email}
            onChange={(e) => mudar({ email: e.target.value })}
          />
          <CampoSenha
            id="equipe-senha"
            rotulo={t.campos.senha}
            autoComplete="new-password"
            value={v.senha}
            onChange={(e) => mudar({ senha: e.target.value })}
          />
        </>
      )}
      <CampoEspecialidade v={v} mudar={mudar} />
      <Campo
        rotulo={t.campos.titulo}
        maxLength={80}
        value={v.titulo}
        onChange={(e) => mudar({ titulo: e.target.value })}
      />
    </>
  )
}
