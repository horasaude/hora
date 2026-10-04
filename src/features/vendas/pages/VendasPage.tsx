import { ComoFunciona, OQueE, Profissionais } from '../components/Conteudo'
import { Garantia, Perguntas, Rodape } from '../components/Final'
import { Precos } from '../components/Precos'
import { Topo } from '../components/Topo'

export function VendasPage() {
  return (
    <>
      <Topo />
      <main>
        <OQueE />
        <Profissionais />
        <ComoFunciona />
        <Precos />
        <Garantia />
        <Perguntas />
      </main>
      <Rodape />
    </>
  )
}
