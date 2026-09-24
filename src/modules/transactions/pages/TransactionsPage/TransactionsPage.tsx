import { Link } from 'react-router-dom'
import { Download, Receipt } from 'lucide-react'
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
import { PAYMENT_METHOD_LABEL, TRANSACTION_STATUS_META, metaOf, type PaymentMethod } from '../../../../shared/constants/enums'
import { useDocumentTitle, usePagination, useRequest } from '../../../../shared/hooks'
import { downloadCsv, formatCents, formatDateTime, shortId } from '../../../../shared/utils'
import { transactionsApi } from '../../api/transactions.api'
import { TransactionStatusBadge } from '../../components/TransactionStatusBadge'
import type { PaymentTransaction } from '../../types'

const methodLabel = (id?: number | null) => (id ? (PAYMENT_METHOD_LABEL[id as PaymentMethod] ?? '—') : '—')

const columns: Column<PaymentTransaction>[] = [
  { key: 'date', header: 'Data', render: (tx) => formatDateTime(tx.createdAt) },
  {
    key: 'session',
    header: 'Sessão',
    render: (tx) =>
      tx.chargerSessionId ? (
        <Link to={paths.sessionDetail(tx.chargerSessionId)}>{shortId(tx.chargerSessionId)}</Link>
      ) : (
        '—'
      ),
  },
  { key: 'method', header: 'Método', render: (tx) => methodLabel(tx.paymentMethodId) },
  { key: 'status', header: 'Status', render: (tx) => <TransactionStatusBadge statusId={tx.statusId} /> },
  { key: 'amount', header: 'Valor', align: 'right', render: (tx) => formatCents(tx.amountCents) },
]

export function TransactionsPage() {
  useDocumentTitle('Transações')
  const pagination = usePagination(15)
  const { data, loading, error, reload } = useRequest(
    () => transactionsApi.list({ skip: pagination.skip, take: pagination.take }),
    [pagination.skip, pagination.take],
  )
  const transactions = data ?? []

  function exportCsv() {
    downloadCsv(
      `transacoes-pagina-${pagination.page + 1}`,
      ['ID', 'Data', 'Sessão', 'Método', 'Status', 'Valor (R$)'],
      transactions.map((tx) => [
        tx.id,
        formatDateTime(tx.createdAt),
        tx.chargerSessionId ?? '',
        methodLabel(tx.paymentMethodId),
        metaOf(TRANSACTION_STATUS_META, tx.statusId).label,
        (tx.amountCents / 100).toFixed(2).replace('.', ','),
      ]),
    )
  }

  return (
    <>
      <PageHeader
        title="Transações"
        description="Pagamentos gerados pelas recargas feitas nos seus carregadores."
        actions={
          <Button variant="secondary" icon={<Download size={16} />} onClick={exportCsv} disabled={!transactions.length}>
            Exportar CSV
          </Button>
        }
      />

      {loading && <LoadingState label="Carregando transações…" />}
      {!loading && error && <ErrorState message={error.message} onRetry={() => reload()} />}
      {!loading && !error && transactions.length === 0 && pagination.page === 0 && (
        <EmptyState
          icon={<Receipt size={32} />}
          title="Nenhuma transação ainda"
          description="Quando uma sessão de recarga for encerrada nos seus carregadores, o pagamento aparece aqui."
        />
      )}
      {!loading && !error && (transactions.length > 0 || pagination.page > 0) && (
        <DataTable columns={columns} rows={transactions} rowKey={(tx) => tx.id} caption="Transações" />
      )}
      {!error && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.take}
          itemCount={transactions.length}
          loading={loading}
          onPrevious={pagination.previous}
          onNext={pagination.next}
        />
      )}
    </>
  )
}
