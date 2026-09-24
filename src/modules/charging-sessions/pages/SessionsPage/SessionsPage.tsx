import { useNavigate } from 'react-router-dom'
import { BatteryCharging, Download } from 'lucide-react'
import { paths } from '../../../../app/router/paths'
import {
  Button,
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  type Column,
} from '../../../../shared/components'
import { SESSION_STATUS_META, metaOf } from '../../../../shared/constants/enums'
import { useDocumentTitle, usePagination, useRequest } from '../../../../shared/hooks'
import { downloadCsv, formatCents, formatDateTime, formatDuration, formatKwh, shortId } from '../../../../shared/utils'
import { chargingSessionsApi } from '../../api/charging-sessions.api'
import { SessionStatusBadge } from '../../components/SessionStatusBadge'
import type { ChargingSession } from '../../types'

const columns: Column<ChargingSession>[] = [
  { key: 'started', header: 'Início', render: (s) => formatDateTime(s.startedAt) },
  { key: 'duration', header: 'Duração', render: (s) => formatDuration(s.startedAt, s.finishedAt) },
  { key: 'charger', header: 'Carregador', render: (s) => shortId(s.chargerId) },
  { key: 'status', header: 'Status', render: (s) => <SessionStatusBadge statusId={s.statusId} /> },
  { key: 'energy', header: 'Energia', align: 'right', render: (s) => formatKwh(s.energyDeliveredKwh) },
  { key: 'amount', header: 'Valor', align: 'right', render: (s) => formatCents(s.consumedAmountCents) },
]

export function SessionsPage() {
  useDocumentTitle('Sessões')
  const navigate = useNavigate()
  const pagination = usePagination(15)
  const { data, loading, error, reload } = useRequest(
    () => chargingSessionsApi.list({ skip: pagination.skip, take: pagination.take }),
    [pagination.skip, pagination.take],
  )
  const sessions = data ?? []

  function exportCsv() {
    downloadCsv(
      `sessoes-pagina-${pagination.page + 1}`,
      ['ID', 'Início', 'Fim', 'Carregador', 'Veículo', 'Status', 'Energia (kWh)', 'Valor (R$)'],
      sessions.map((s) => [
        s.id,
        formatDateTime(s.startedAt),
        formatDateTime(s.finishedAt),
        s.chargerId,
        s.vehicleId ?? '',
        metaOf(SESSION_STATUS_META, s.statusId).label,
        String(s.energyDeliveredKwh).replace('.', ','),
        (s.consumedAmountCents / 100).toFixed(2).replace('.', ','),
      ]),
    )
  }

  return (
    <>
      <PageHeader
        title="Sessões de recarga"
        description="Recargas realizadas nos seus carregadores. Abra uma sessão para acompanhar ou encerrar."
        actions={
          <Button variant="secondary" icon={<Download size={16} />} onClick={exportCsv} disabled={!sessions.length}>
            Exportar CSV
          </Button>
        }
      />

      {loading && <LoadingState label="Carregando sessões…" />}
      {!loading && error && <ErrorState message={error.message} onRetry={() => reload()} />}
      {!loading && !error && sessions.length === 0 && pagination.page === 0 && (
        <EmptyState
          icon={<BatteryCharging size={32} />}
          title="Nenhuma sessão registrada"
          description="Inicie uma recarga pela tela de uma usina para que ela apareça aqui."
          action={<Button onClick={() => navigate(paths.stations)}>Ver usinas</Button>}
        />
      )}
      {!loading && !error && (sessions.length > 0 || pagination.page > 0) && (
        <DataTable
          columns={columns}
          rows={sessions}
          rowKey={(s) => s.id}
          onRowClick={(s) => navigate(paths.sessionDetail(s.id))}
          caption="Sessões de recarga"
        />
      )}
      {!error && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.take}
          itemCount={sessions.length}
          loading={loading}
          onPrevious={pagination.previous}
          onNext={pagination.next}
        />
      )}
    </>
  )
}
