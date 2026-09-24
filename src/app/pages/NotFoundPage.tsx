import { useNavigate } from 'react-router-dom'
import { Button, EmptyState } from '../../shared/components'
import { useDocumentTitle } from '../../shared/hooks'
import { paths } from '../router/paths'

export function NotFoundPage() {
  useDocumentTitle('Página não encontrada')
  const navigate = useNavigate()
  return (
    <EmptyState
      title="Página não encontrada"
      description="O endereço acessado não existe ou foi movido."
      action={<Button onClick={() => navigate(paths.stations)}>Ir para usinas</Button>}
    />
  )
}
