import { useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { salvarMateriaisTema } from '../api/materiais.api'
import { TEMA, useMateriais } from '../hooks/useMateriais'
import { textos } from '../textos'
import { doTema as t } from '../textos/doTema'
import { MateriaisAula } from './MateriaisAula'

/** Janela dos arquivos do tema (PDF, Word, imagem): a aluna baixa na aba Materiais do tema. */
export function MateriaisTemaJanela({ tema, aoFechar }: { tema: string; aoFechar: () => void }) {
  const m = useMateriais(`${TEMA}${tema}`)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const salvar = async () => {
    if (m.enviando) return setErro(textos.arquivos.esperar)
    setSalvando(true)
    try {
      await salvarMateriaisTema(tema, m.paraSalvar, m.removidos)
      aoFechar()
    } catch {
      setErro(textos.erroSalvar)
    } finally {
      setSalvando(false)
    }
  }
  return (
    <Janela
      titulo={t.editarMateriais}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {textos.cancelar}
          </BotaoBrilho>
          <BotaoBrilho onClick={salvar} disabled={salvando}>
            {salvando ? textos.salvando : textos.salvar}
          </BotaoBrilho>
        </>
      }
    >
      <MateriaisAula m={m} />
      {erro && (
        <p role="alert" className="mt-3 text-sm text-terracota-escuro">
          {erro}
        </p>
      )}
    </Janela>
  )
}
