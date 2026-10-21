import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { IconePlay } from '@/components/ui'
import { ehVideo } from '@/domain/arquivos'
import { resumoSeries, seriesDoItem } from '@/domain/series'
import { linkDaFoto, type ExercicioDoTreino } from '../api/treinos.api'
import { textos } from '../textos'
import { IconeHalter } from './IconesTreino'

/** Quadrado dourado claro com a foto ou o GIF do exercício (sem imagem, o ícone). */
function Miniatura({ nome, foto }: { nome: string; foto: string | null }) {
  const imagem = Boolean(foto) && !ehVideo(foto)
  const url = useQuery({
    queryKey: ['foto-exercicio', foto],
    queryFn: () => linkDaFoto(foto ?? ''),
    enabled: imagem,
    staleTime: 30 * 60_000,
  }).data
  return (
    <span className="grid size-[70px] shrink-0 place-items-center overflow-hidden rounded-[14px] bg-[#fdf1d8] text-[#c98a0b]">
      {imagem && url ? (
        <img src={url} alt={nome} loading="lazy" className="size-full object-cover" />
      ) : (
        <IconeHalter className="size-7" />
      )}
    </span>
  )
}

/** Exercício do treino: imagem, nome, "séries x repetições · descanso · carga", observação e o play quando há vídeo. */
export function CartaoExercicio({
  item,
  aerobico,
  para,
}: {
  item: ExercicioDoTreino
  aerobico: boolean
  para: string
}) {
  const e = item.exercicio
  const series = seriesDoItem(item)
  const linha = [
    aerobico ? textos.execucao.bloco(series.length, item.repeticoes) : resumoSeries(series),
    item.descanso_segundos ? textos.ficha.descanso(item.descanso_segundos) : '',
    item.carga.trim()
      ? (aerobico ? textos.ficha.intensidade : textos.ficha.carga)(item.carga.trim())
      : '',
  ]
    .filter(Boolean)
    .join(' · ')
  const temVideo = Boolean(e.video_url) || ehVideo(e.foto_path)
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-linha bg-white p-2.5">
      <Miniatura nome={e.nome} foto={e.foto_path} />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-tinta">{e.nome}</p>
        <p className="text-[12.5px] text-suave">{linha}</p>
        {item.observacao.trim() && (
          <p className="text-[12.5px] text-tinta">{item.observacao.trim()}</p>
        )}
      </div>
      {temVideo && (
        <Link
          to={para}
          aria-label={textos.ficha.verVideo(e.nome)}
          className="grid size-10 shrink-0 place-items-center rounded-full text-dourado transition hover:bg-[#fdf1d8]"
        >
          <IconePlay className="size-5" />
        </Link>
      )}
    </div>
  )
}
