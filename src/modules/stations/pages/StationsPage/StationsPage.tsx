import { Plug, RefreshCw } from 'lucide-react'
import { Button, EmptyState, ErrorState, LoadingState, PageHeader } from '../../../../shared/components'
import { useDocumentTitle, useRequest } from '../../../../shared/hooks'
import { formatKw } from '../../../../shared/utils'
import { stationsApi } from '../../api/stations.api'
import { StationCard } from '../../components/StationCard/StationCard'
import styles from './StationsPage.module.css'

export function StationsPage() {
  useDocumentTitle('Usinas')
  const { data: stations, loading, error, reload } = useRequest(() => stationsApi.list(), [])

  const totalConsumption = stations?.reduce((sum, s) => sum + s.currentConsumptionKw, 0) ?? 0
  const totalSolar = stations?.reduce((sum, s) => sum + s.currentSolarGenerationKw, 0) ?? 0

  return (
    <>
      <PageHeader
        title="Usinas"
        description={
          stations && stations.length > 0
            ? `Consumo agora: ${formatKw(totalConsumption)}, dos quais ${formatKw(totalSolar)} vêm da geração solar.`
            : 'Locais onde você tem carregadores instalados.'
        }
        actions={
          <Button variant="ghost" icon={<RefreshCw size={16} />} onClick={() => reload()} disabled={loading}>
            Atualizar
          </Button>
        }
      />

      {loading && <LoadingState label="Carregando usinas…" />}
      {!loading && error && <ErrorState message={error.message} onRetry={() => reload()} />}
      {!loading && !error && stations?.length === 0 && (
        <EmptyState
          icon={<Plug size={32} />}
          title="Nenhuma usina vinculada"
          description="As usinas aparecem aqui quando um carregador delas é registrado na sua conta."
        />
      )}
      {!loading && !error && stations && stations.length > 0 && (
        <div className={styles.grid}>
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      )}
    </>
  )
}
