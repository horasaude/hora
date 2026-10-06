import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BotaoBrilho, Janela } from '@/components/ui'
import { salvarAlimento, type AlimentoComMedidas } from '../api/alimentos.api'
import { useAcaoPlano } from '../hooks/usePlano'
import { esquemaAlimento, type EntradaAlimento } from '../schemas/plano'
import { tAlimentos as t, textos } from '../textos'
import { CamposBase, CamposMedidas, CamposNutrientes } from './AlimentoCampos'

const texto = (v: number | null | undefined) =>
  v === null || v === undefined ? '' : String(v).replace('.', ',')

function inicial(a?: AlimentoComMedidas): EntradaAlimento {
  return {
    nome: a?.nome ?? '',
    grupo: a?.grupo ?? '',
    kcal: texto(a?.kcal),
    proteina: texto(a?.proteina),
    carboidrato: texto(a?.carboidrato),
    gordura: texto(a?.gordura),
    fibra: texto(a?.fibra),
    medidas: (a?.medidas_caseiras ?? []).map((m) => ({ nome: m.nome, gramas: texto(m.gramas) })),
  }
}

/** Janela de adicionar ou editar alimento próprio: valores por 100 g e medidas caseiras. */
export function AlimentoJanela({
  alimento,
  aoFechar,
}: {
  alimento?: AlimentoComMedidas
  aoFechar: () => void
}) {
  const id = useId()
  const salvar = useAcaoPlano(
    (d: { a: Parameters<typeof salvarAlimento>[0]; m: { nome: string; gramas: number }[] }) =>
      salvarAlimento(d.a, d.m),
  )
  const form = useForm<EntradaAlimento, unknown, ReturnType<typeof esquemaAlimento.parse>>({
    resolver: zodResolver(esquemaAlimento),
    defaultValues: inicial(alimento),
  })
  const erros = form.formState.errors
  const enviar = form.handleSubmit(async ({ medidas: m, ...a }) => {
    try {
      await salvar.mutateAsync({ a: { ...a, id: alimento?.id }, m })
      aoFechar()
    } catch {
      form.setError('root', { message: textos.erro })
    }
  })
  return (
    <Janela
      titulo={alimento ? t.editar : t.adicionar}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {textos.cancelar}
          </BotaoBrilho>
          <BotaoBrilho type="submit" form={id} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? textos.salvando : textos.salvar}
          </BotaoBrilho>
        </>
      }
    >
      <form id={id} onSubmit={enviar} noValidate className="flex flex-col gap-5">
        <CamposBase form={form} id={id} />
        <CamposNutrientes form={form} />
        <CamposMedidas form={form} />
        {erros.root && (
          <p role="alert" className="text-sm text-terracota-escuro">
            {erros.root.message}
          </p>
        )}
      </form>
    </Janela>
  )
}
