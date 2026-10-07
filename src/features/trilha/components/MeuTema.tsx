import { useState } from 'react'
import { BotaoBrilho, Cartao, Janela } from '@/components/ui'
import { diasParaEscolha } from '@/domain/trilha'
import { useTrilha } from '../hooks/useTrilha'
import { textos } from '../textos'
import { EscolhaTema } from './EscolhaTema'
import { TagTema } from './Temas'

const t = textos.tema

/** Perfil > Meu tema: mostra o tema e troca com confirmação. */
export function MeuTema() {
  const trilha = useTrilha().data
  const [aberta, setAberta] = useState(false)
  if (!trilha || trilha.dia === null) return null
  const tema = trilha.temas.find((x) => x.id === trilha.tema_atual)
  const falta = diasParaEscolha(trilha.dia)
  return (
    <Cartao className="flex flex-col gap-3">
      <h2 className="text-[19px] font-bold text-verde-escuro">{t.meu}</h2>
      {tema ? (
        <span className="self-start">
          <TagTema chave={tema.chave} titulo={tema.titulo} />
        </span>
      ) : (
        <p className="text-sm text-suave">{falta > 0 ? t.aindaNao(falta) : t.nenhum}</p>
      )}
      {falta === 0 && (
        <BotaoBrilho
          tom={tema ? 'cinza' : 'verde'}
          className="self-start"
          onClick={() => setAberta(true)}
        >
          {tema ? t.trocar : t.escolher}
        </BotaoBrilho>
      )}
      {aberta && (
        <Janela
          titulo={tema ? t.trocar : t.titulo}
          aoFechar={() => setAberta(false)}
          larga
          rodape={
            <BotaoBrilho tom="cinza" onClick={() => setAberta(false)}>
              {textos.comece.fechar}
            </BotaoBrilho>
          }
        >
          <EscolhaTema
            temas={trilha.temas}
            atual={trilha.tema_atual}
            troca={Boolean(tema)}
            aoConcluir={() => setAberta(false)}
          />
        </Janela>
      )}
    </Cartao>
  )
}
