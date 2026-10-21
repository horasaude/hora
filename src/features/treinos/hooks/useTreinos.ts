import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { diaEmBrasilia } from '@/lib/datas'
import { semanaDe } from '@/domain/treinos'
import {
  buscarPreferencias,
  buscarRotina,
  buscarTreino,
  listarFeitos,
  listarTreinos,
  registrarFeito,
  salvarPreferencias,
} from '../api/treinos.api'
import { useFiltroTreinos, usePreviaTreinos } from '../previa'

export const usePreferencias = () =>
  useQuery({ queryKey: ['treino-preferencias'], queryFn: buscarPreferencias })

export function useRotina(nivel: string, local: string) {
  const f = useFiltroTreinos()
  return useQuery({
    queryKey: ['rotina-aluna', nivel, local, f?.tema],
    queryFn: () => buscarRotina(nivel, local, f),
    enabled: Boolean(nivel && local),
  })
}

export function useTreinosDoNivel(nivel: string, local: string) {
  const f = useFiltroTreinos()
  return useQuery({
    queryKey: ['treinos-aluna', nivel, local, f?.tema],
    queryFn: () => listarTreinos(nivel, local, f),
    enabled: Boolean(nivel && local),
  })
}

export const useTreino = (id: string) =>
  useQuery({ queryKey: ['treino-aluna', id], queryFn: () => buscarTreino(id) })

/** Treinos feitos desde o domingo desta semana (na pré-visualização, nenhum). */
export function useFeitosDaSemana() {
  const previa = usePreviaTreinos()
  const [desde] = useState(() => semanaDe(new Date())[0] ?? diaEmBrasilia(new Date()))
  return useQuery({
    queryKey: ['treinos-feitos', desde],
    queryFn: () => listarFeitos(desde),
    enabled: !previa,
  })
}

/** Treinos feitos nos últimos 60 dias: na rotina numérica, o próximo vem depois do último feito. */
export function useFeitosRecentes() {
  const previa = usePreviaTreinos()
  const [desde] = useState(() => diaEmBrasilia(new Date(Date.now() - 60 * 86_400_000)))
  return useQuery({
    queryKey: ['treinos-feitos', desde],
    queryFn: () => listarFeitos(desde),
    enabled: !previa,
  })
}

/** Treinos feitos no mês de hoje, para o calendário de Minha evolução. */
export function useFeitosDoMes() {
  const [desde] = useState(() => `${diaEmBrasilia(new Date()).slice(0, 7)}-01`)
  return useQuery({ queryKey: ['treinos-feitos', desde], queryFn: () => listarFeitos(desde) })
}

export function useRegistrarFeito() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (d: { treino: string; series: Record<string, number> }) =>
      registrarFeito(d.treino, d.series),
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['treinos-feitos'] }),
  })
}

export function useSalvarPreferencias() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: salvarPreferencias,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['treino-preferencias'] }),
  })
}
