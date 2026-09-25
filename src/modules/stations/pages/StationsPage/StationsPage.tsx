import { Plug, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Button, EmptyState, ErrorState, LoadingState, PageHeader, useToast } from '../../../../shared/components'
import { useDocumentTitle, useRequest } from '../../../../shared/hooks'
import { formatKw } from '../../../../shared/utils'
import { stationsApi } from '../../api/stations.api'
import { AddStationModal } from '../../components/AddStation/AddStationModal'
import { StationCard } from '../../components/StationCard/StationCard'
import type { Station } from '../../types'
import styles from './StationsPage.module.css'

export function StationsPage() {
  useDocumentTitle('Stations')
  const { data: stations, loading, error, reload, setData } = useRequest(() => stationsApi.list(), [])
  const [addOpen, setAddOpen] = useState(false)
  const toast = useToast()

  const totalConsumption = stations?.reduce((sum, s) => sum + s.currentConsumptionKw, 0) ?? 0
  const totalSolar = stations?.reduce((sum, s) => sum + s.currentSolarGenerationKw, 0) ?? 0

  function handleCreated(station: Station) {
    setData((prev) => [...(prev ?? []), station])
    setAddOpen(false)
    toast.success('Station adicionada com sucesso.')
  }

  return (
    <>
      <PageHeader
        title="Stations"
        description={
          stations && stations.length > 0
            ? `Consumo agora: ${formatKw(totalConsumption)}, dos quais ${formatKw(totalSolar)} vêm da geração solar.`
            : 'Locais onde você tem carregadores instalados.'
        }
        actions={
          <>
            <Button variant="ghost" icon={<RefreshCw size={16} />} onClick={() => reload()} disabled={loading}>
              Atualizar
            </Button>
            <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
              Adicionar station
            </Button>
          </>
        }
      />

      <AddStationModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={handleCreated} />

      {loading && <LoadingState label="Carregando stations…" />}
      {!loading && error && <ErrorState message={error.message} onRetry={() => reload()} />}
      {!loading && !error && stations?.length === 0 && (
        <EmptyState
          icon={<Plug size={32} />}
          title="Nenhuma usina vinculada"
          description="As stations aparecem aqui quando um carregador delas é registrado na sua conta."
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
