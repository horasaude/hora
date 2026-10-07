import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BotaoBrilho, Campo, Janela } from '@/components/ui'
import { diaEmBrasilia, formatarData, formatarDataHora } from '@/lib/datas'
import { textos } from '../textos'
import { buscarLiberacao, liberarAcesso } from './acesso.api'

const t = textos.acesso

function Janelinha({ perfil, aoFechar }: { perfil: string; aoFechar: () => void }) {
  const cliente = useQueryClient()
  const [inicio, setInicio] = useState(() => diaEmBrasilia(new Date()))
  const liberar = useMutation({
    mutationFn: () => liberarAcesso(perfil, inicio),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ['alunas'] })
      cliente.invalidateQueries({ queryKey: ['liberacao', perfil] })
      aoFechar()
    },
  })
  return (
    <Janela
      titulo={t.titulo}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {textos.cancelar}
          </BotaoBrilho>
          <BotaoBrilho onClick={() => liberar.mutate()} disabled={liberar.isPending || !inicio}>
            {liberar.isPending ? t.liberando : t.confirmar}
          </BotaoBrilho>
        </>
      }
    >
      <div className="flex flex-col gap-3 sm:max-w-xs">
        <Campo
          rotulo={t.inicio}
          name="inicio-acesso"
          type="date"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
        />
        <p className="text-sm text-suave">{t.ajuda}</p>
        {liberar.isError && (
          <p role="alert" className="text-sm text-terracota-escuro">
            {textos.erroSalvar}
          </p>
        )}
      </div>
    </Janela>
  )
}

/** Ficha da aluna: liberar acesso manual (teste ou pagamento fora do sistema) e quem liberou por último. */
export function LiberarAcesso({ perfil }: { perfil: string }) {
  const [aberta, setAberta] = useState(false)
  const liberacao = useQuery({
    queryKey: ['liberacao', perfil],
    queryFn: () => buscarLiberacao(perfil),
  })
  const l = liberacao.data
  return (
    <section className="flex flex-col gap-2 border-t border-linha pt-5">
      <h3 className="text-sm font-semibold text-suave">{t.secao}</h3>
      {l && (
        <p className="text-sm text-tinta">
          {t.registro(
            l.quem,
            formatarDataHora(new Date(l.quando)),
            formatarData(new Date(l.inicio)),
          )}
        </p>
      )}
      <BotaoBrilho tom="escuro" className="self-start" onClick={() => setAberta(true)}>
        {t.botao}
      </BotaoBrilho>
      {aberta && <Janelinha perfil={perfil} aoFechar={() => setAberta(false)} />}
    </section>
  )
}
