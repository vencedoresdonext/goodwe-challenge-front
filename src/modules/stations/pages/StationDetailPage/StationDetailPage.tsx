import { MapPin, Plug } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from '../../../../app/router/paths'
import { Badge, EmptyState, ErrorState, LoadingState, PageHeader, useToast } from '../../../../shared/components'
import { useDocumentTitle, usePolling, useRequest } from '../../../../shared/hooks'
import { formatCurrency, formatKw } from '../../../../shared/utils'
import { StartSessionModal, chargingSessionsApi, isActiveSession, type ChargingSession } from '../../../charging-sessions'
import { stationsApi } from '../../api/stations.api'
import { ChargerCard } from '../../components/ChargerCard/ChargerCard'
import { LoadMeter } from '../../components/LoadMeter/LoadMeter'
import type { Connector } from '../../types'
import { getStationMetrics } from '../../utils'
import styles from './StationDetailPage.module.css'

const REFRESH_INTERVAL_MS = 15_000
const chargerLabel = (index: number) => `Carregador ${String(index + 1).padStart(2, '0')}`

export function StationDetailPage() {
  const { stationId = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const station = useRequest(() => stationsApi.getById(stationId), [stationId])
  const sessions = useRequest(() => chargingSessionsApi.list({ take: 100 }), [stationId])

  useDocumentTitle(station.data?.name ?? 'Usina')
  usePolling(
    () => {
      void station.reload({ silent: true })
      void sessions.reload({ silent: true })
    },
    REFRESH_INTERVAL_MS,
    !!station.data,
  )

  const [startTarget, setStartTarget] = useState<{ connector: Connector; label: string } | null>(null)
  

  const activeByCharger = useMemo(() => {
    const map = new Map<string, ChargingSession>()
    sessions.data?.filter(isActiveSession).forEach((session) => map.set(session.chargerId, session))
    return map
  }, [sessions.data])

  if (station.loading && !station.data) return <LoadingState label="Carregando usina…" />

  if (station.error && !station.data) {
    return (
      <>
        <PageHeader title="Usina" backTo={{ to: paths.stations, label: 'Usinas' }} />
        <ErrorState message={station.error.message} onRetry={() => station.reload()} />
      </>
    )
  }

  const data = station.data
  if (!data) return null

  const metrics = getStationMetrics(data)
  const connectors = data.connectors ?? []
  const labelOf = (connector: Connector) => chargerLabel(connectors.indexOf(connector))

  const stats = [
    { label: 'Consumo atual', value: formatKw(data.currentConsumptionKw) },
    { label: 'Geração solar', value: formatKw(data.currentSolarGenerationKw), solar: true },
    { label: 'Disponível', value: formatKw(metrics.availableKw) },
    { label: 'Demanda contratada', value: formatKw(data.contractedDemandKw) },
    { label: 'Preço', value: `${formatCurrency(data.pricePerKwh)}/kWh` },
  ]

  return (
    <>
      <PageHeader
        backTo={{ to: paths.stations, label: 'Usinas' }}
        title={data.name}
        description={
          <span className={styles.address}>
            <MapPin size={14} aria-hidden /> {data.address}
            {!data.isActive && <Badge tone="neutral">Inativa</Badge>}
          </span>
        }
      />

      <section className={styles.overview} aria-label="Energia da usina">
        <dl className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt>{stat.label}</dt>
              <dd className={stat.solar ? styles.solar : undefined}>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <LoadMeter station={data} size="lg" />
      </section>

      <div className={styles.sectionHeader}>
        <h2>Carregadores</h2>
        <span>
          {metrics.freeConnectors} de {metrics.totalConnectors} livres, {formatKw(metrics.installedKw)} instalados
        </span>
      </div>

      {connectors.length === 0 ? (
        <EmptyState icon={<Plug size={32} />} title="Nenhum carregador nesta usina" />
      ) : (
        <div className={styles.grid}>
          {connectors.map((connector) => (
            <ChargerCard
              key={connector.id}
              connector={connector}
              label={labelOf(connector)}
              activeSession={activeByCharger.get(connector.chargerId)}
              onStartSession={(c) => setStartTarget({ connector: c, label: labelOf(c) })}
            />
          ))}
        </div>
      )}

      <StartSessionModal
        open={!!startTarget}
        chargerId={startTarget?.connector.chargerId ?? null}
        chargerLabel={startTarget?.label}
        pricePerKwh={data.pricePerKwh}
        onClose={() => setStartTarget(null)}
        onStarted={(session) => {
          setStartTarget(null)
          toast.success('Recarga iniciada.')
          navigate(paths.sessionDetail(session.id))
        }}
      />
    </>
  )
}
