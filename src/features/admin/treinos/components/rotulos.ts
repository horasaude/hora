import { createContext, useContext } from 'react'
import { t } from '../textos'

/** Nomes dos campos do exercício: musculação (séries, carga) ou aeróbico (blocos, duração, intensidade). */
export const Rotulos = createContext<(typeof t.rotulos)['musculacao']>(t.rotulos.musculacao)
export const useRotulos = () => useContext(Rotulos)
