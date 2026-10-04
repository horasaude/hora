import { useEffect } from 'react'
import { guardarUtms } from '@/lib/utm'
import { ComoFunciona, OQueE, Profissionais } from '../components/Conteudo'
import { Garantia, Perguntas, Rodape } from '../components/Final'
import { Precos } from '../components/Precos'
import { Topo } from '../components/Topo'

export function VendasPage() {
  useEffect(() => guardarUtms(window.location.search), [])
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
