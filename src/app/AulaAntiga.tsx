import { Navigate, useParams } from 'react-router-dom'

/** Endereço antigo da aula (/app/aula/:id) leva para o novo, dentro da trilha. */
export function AulaAntiga() {
  const { aulaId } = useParams()
  return <Navigate to={`/app/trilha/aula/${aulaId ?? ''}`} replace />
}
