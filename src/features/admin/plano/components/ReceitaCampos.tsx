import { Campo } from '@/components/ui'
import type { FormReceita } from '../receitaForm'
import { tReceitas as t } from '../textos2'
import { Bloco } from './BarraTopo'
import { EditorTexto } from './EditorTexto'
import { FotoReceita } from './FotoReceita'
import { IngredientesCalculados } from './IngredientesCalculados'
import { ReceitaMarcas } from './ReceitaMarcas'

type Props = { f: FormReceita; mudar: (p: Partial<FormReceita>) => void; erroNome: boolean }

/** Coluna principal: nome, foto, ingredientes e modo de preparo. */
export function ReceitaPrincipal({ f, mudar, erroNome }: Props) {
  return (
    <Bloco>
      <Campo
        rotulo={t.campoNome}
        value={f.nome}
        onChange={(e) => mudar({ nome: e.target.value })}
        erro={erroNome ? t.campoNome : undefined}
      />
      <FotoReceita caminho={f.foto_path} aoMudar={(foto_path) => mudar({ foto_path })} />
      <EditorTexto
        rotulo={t.ingredientes}
        valor={f.ingredientes}
        aoMudar={(ingredientes) => mudar({ ingredientes })}
      />
      <EditorTexto rotulo={t.preparo} valor={f.preparo} aoMudar={(preparo) => mudar({ preparo })} />
    </Bloco>
  )
}

/** Coluna lateral: rendimento, tags e o cálculo pelos alimentos cadastrados. */
export function ReceitaLateral({ f, mudar }: Omit<Props, 'erroNome'>) {
  return (
    <Bloco className="lg:sticky lg:top-6">
      <div className="grid grid-cols-2 gap-3">
        <Campo
          rotulo={t.tempo}
          type="number"
          min={1}
          inputMode="numeric"
          value={f.tempo}
          onChange={(e) => mudar({ tempo: e.target.value })}
        />
        <Campo
          rotulo={t.porcoes}
          type="number"
          min={1}
          max={100}
          value={f.porcoes}
          onChange={(e) => mudar({ porcoes: Number(e.target.value) })}
        />
        <Campo
          rotulo={t.tags}
          placeholder={t.tagsAjuda}
          value={f.tags}
          onChange={(e) => mudar({ tags: e.target.value })}
        />
      </div>
      <ReceitaMarcas f={f} mudar={mudar} />
      <label className="flex items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          className="size-5 accent-ora"
          checked={f.calcular}
          onChange={(e) => mudar({ calcular: e.target.checked })}
        />
        {t.calcular}
      </label>
      {f.calcular && (
        <IngredientesCalculados
          itens={f.itens}
          porcoes={f.porcoes}
          aoMudar={(itens) => mudar({ itens })}
        />
      )}
    </Bloco>
  )
}
