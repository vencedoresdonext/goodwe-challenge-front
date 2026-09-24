import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RefreshCw, Square } from 'lucide-react'
import { paths } from '../../../../app/router/paths'
import { env } from '../../../../config/env'
import { Button, ErrorState, LoadingState, PageHeader, useToast } from '../../../../shared/components'
import { useDocumentTitle, usePolling, useRequest } from '../../../../shared/hooks'
import { formatCents, formatDateTime, formatDuration, formatKwh } from '../../../../shared/utils'
import { chargingSessionsApi } from '../../api/charging-sessions.api'
import { SessionStatusBadge } from '../../components/SessionStatusBadge'
import { StopSessionModal } from '../../components/StopSessionModal'
import { canStopSession, isActiveSession } from '../../utils'
import styles from './SessionDetailPage.module.css'

export function SessionDetailPage() {
  const { sessionId = '' } = useParams()
  useDocumentTitle('Sessão de recarga')
  const toast = useToast()
  const [stopping, setStopping] = useState(false)

  const { data: session, loading, error, reload, setData } = useRequest(
    () => chargingSessionsApi.getStatus(sessionId),
    [sessionId],
  )

  const active = !!session && isActiveSession(session)
  usePolling(() => void reload({ silent: true }), env.sessionPollInterval, active)

  if (loading && !session) return <LoadingState label="Carregando sessão…" />
  if (error && !session) {
    return (
      <>
        <PageHeader title="Sessão de recarga" backTo={{ to: paths.sessions, label: 'Sessões' }} />
        <ErrorState message={error.message} onRetry={() => reload()} />
      </>
    )
  }
  if (!session) return null

  const metrics = [
    { label: 'Energia entregue', value: formatKwh(session.energyDeliveredKwh) },
    { label: 'Valor consumido', value: formatCents(session.consumedAmountCents) },
    { label: 'Duração', value: formatDuration(session.startedAt, session.finishedAt) },
  ]

  if (session.telemetry) {
    metrics.push(
      { label: 'Potência atual', value: `${session.telemetry.powerKw} kW` },
      { label: 'Bateria', value: `${session.telemetry.batteryPercentage}%` },
    )
  }

  return (
    <>
      <PageHeader
        backTo={{ to: paths.sessions, label: 'Sessões' }}
        title={
          <span className={styles.title}>
            Sessão de recarga <SessionStatusBadge statusId={session.statusId} />
          </span>
        }
        description={active ? 'Atualizando automaticamente enquanto a recarga estiver ativa.' : undefined}
        actions={
          <>
            <Button variant="ghost" icon={<RefreshCw size={16} />} onClick={() => reload({ silent: true })}>
              Atualizar
            </Button>
            {canStopSession(session) && (
              <Button icon={<Square size={14} />} onClick={() => setStopping(true)}>
                Encerrar recarga
              </Button>
            )}
          </>
        }
      />

      <section className={styles.metrics} aria-label="Resumo da sessão">
        {metrics.map((metric) => (
          <div key={metric.label} className={styles.metric}>
            <span className={styles.metricLabel}>{metric.label}</span>
            <span className={styles.metricValue}>{metric.value}</span>
          </div>
        ))}
      </section>

      <dl className={styles.details}>
        <div>
          <dt>Início</dt>
          <dd>{formatDateTime(session.startedAt)}</dd>
        </div>
        <div>
          <dt>Fim</dt>
          <dd>{formatDateTime(session.finishedAt)}</dd>
        </div>
        <div>
          <dt>Carregador</dt>
          <dd>{session.chargerId}</dd>
        </div>
        <div>
          <dt>Veículo</dt>
          <dd>{session.vehicleId ?? 'Não informado'}</dd>
        </div>
        <div>
          <dt>Identificador</dt>
          <dd>{session.id}</dd>
        </div>
      </dl>

      {!active && session.consumedAmountCents > 0 && (
        <p className={styles.hint}>
          O pagamento desta sessão aparece em <Link to={paths.transactions}>Transações</Link>.
        </p>
      )}

      <StopSessionModal
        open={stopping}
        sessionId={session.id}
        onClose={() => setStopping(false)}
        onStopped={(stopped) => {
          setData(stopped)
          setStopping(false)
          toast.success(`Recarga encerrada: ${formatKwh(stopped.energyDeliveredKwh)}, ${formatCents(stopped.consumedAmountCents)}.`)
        }}
      />
    </>
  )
}
