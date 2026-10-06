// Toda a copy da HORA, provisória. Os componentes só leem daqui. Itens marcados com TODO(clientes)
// dependem das três. *palavra* vira destaque em serifa itálica colorida.
import { abertura } from './textos/abertura'
import { app } from './textos/app'
import { compra } from './textos/compra'
import { fechamento } from './textos/fechamento'
import { produto } from './textos/produto'

export const textos = { ...abertura, ...produto, ...fechamento, compra, app }
export type { Depoimento, ItemRecebe } from './textos/produto'
export { privacidade, termos, type Documento } from './textos/legal'
