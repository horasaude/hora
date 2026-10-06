import { useEffect } from 'react'
import { iniciarRevelar } from '@/lib/revelar'
import { guardarUtms } from '@/lib/utm'
import { Hero, Numeros, Problema } from '../components/Abertura'
import { PorDentroDoApp } from '../components/app/PorDentroDoApp'
import { BarraTopo } from '../components/BarraTopo'
import { CompraProvider } from '../components/compra/CompraProvider'
import { Perguntas } from '../components/Confianca'
import { Rodape } from '../components/Fechamento'
import { ParaQuem, Recebe } from '../components/Oferta'
import { Preco } from '../components/Preco'
import { Depoimentos, Profissionais } from '../components/Pessoas'
import { ComoFunciona, OQueE } from '../components/Produto'
import { WhatsAppFlutuante } from '../components/WhatsAppFlutuante'

export function VendasPage() {
  useEffect(() => guardarUtms(window.location.search), [])
  useEffect(() => iniciarRevelar(), [])
  return (
    <CompraProvider>
      <BarraTopo />
      <Hero />
      <main>
        <Numeros />
        <Problema />
        <OQueE />
        <ComoFunciona />
        <PorDentroDoApp />
        <Profissionais />
        <Depoimentos />
        <ParaQuem />
        <Recebe />
        <Preco />
        <Perguntas />
      </main>
      <Rodape />
      <WhatsAppFlutuante numero={import.meta.env.VITE_WHATSAPP_NUMERO} />
    </CompraProvider>
  )
}
