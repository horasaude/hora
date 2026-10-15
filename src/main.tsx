import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { TelaErro } from '@/app/TelaErro'
import { configuracaoOk } from '@/lib/env'
import '@/styles/index.css'
import { removerPwaAntigo } from '@/lib/pwaAntigo'

removerPwaAntigo()

createRoot(document.getElementById('root')!).render(
  <StrictMode>{configuracaoOk ? <App /> : <TelaErro tipo="config" />}</StrictMode>,
)
