import type { ReactNode } from 'react'
import { MateriaisPage } from '../plano/pages/MateriaisPage'
import { Anamneses } from '../treinos/pages/AnamnesesPage'
import { Quadro } from '../components/Quadro'
import { saude as t } from '../textos/saude'

/** Saúde > Materiais: orientações da Dra. Clara, cada uma ligada a um tema. */
export function SaudeMateriaisPage() {
  return <MateriaisPage area="saude" />
}

function MolduraSaude({ acao, children }: { acao: ReactNode; children: ReactNode }) {
  return (
    <Quadro titulo={t.anamnesePagina} acao={acao} numeros={[]}>
      {children}
    </Quadro>
  )
}

/** Saúde > Anamnese: questionário de saúde da Dra. Clara; as três sócias veem as respostas. */
export function SaudeAnamnesePage() {
  return <Anamneses area="saude" moldura={MolduraSaude} />
}
