import { useEffect } from 'react'
import { guardarUtms } from '@/lib/utm'
import { Hero, Numeros, Problema } from '../components/Abertura'
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
  return (
    <CompraProvider>
      <Hero />
      <main>
        <Numeros />
        <Problema />
        <OQueE />
        <ComoFunciona />
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
