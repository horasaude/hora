import { useEffect } from 'react'
import { AvisoCookies } from '@/components/ui'
import { eventoMeta } from '@/lib/pixelMeta'
import { guardarIndicacao } from '@/lib/indicacao'
import { iniciarRevelar } from '@/lib/revelar'
import { guardarUtms } from '@/lib/utm'
import { CompraProvider } from '../components/compra/CompraProvider'
import { Rodape } from '../components/Fechamento'
import { Bloco, BotaoBlack } from './base'
import { Equipe, Perguntas, Problema, Recebe } from './Blocos'
import { Oferta } from './Oferta'
import { Prova } from './Prova'
import { black, OFERTA_BLACK } from './textos'
import { Faixa, Hero } from './Topo'

function Final() {
  const t = black.final
  return (
    <Bloco>
      <div className="text-center">
        <p className="font-titulo text-3xl text-creme sm:text-5xl">{t.titulo}</p>
        <p className="mt-2 font-titulo text-3xl text-verde-vivo italic sm:text-5xl">{t.destaque}</p>
        <div className="mt-10">
          <BotaoBlack>{t.botao}</BotaoBlack>
        </div>
      </div>
    </Bloco>
  )
}

/** Página da Black ORA (VSL): fundo preto com o verde da comunidade, válida até 30/11. */
export function BlackPage() {
  useEffect(() => {
    guardarUtms(window.location.search)
    guardarIndicacao(window.location.search)
    eventoMeta('PageView')
  }, [])
  useEffect(() => iniciarRevelar(), [])
  return (
    <CompraProvider oferta={OFERTA_BLACK}>
      <div className="min-h-screen bg-[#070908] font-texto text-creme">
        <Faixa />
        <Hero />
        <main>
          <Prova />
          <Problema />
          <Equipe />
          <Recebe />
          <Oferta />
          <Perguntas />
          <Final />
        </main>
        <Rodape />
      </div>
      <AvisoCookies />
    </CompraProvider>
  )
}
