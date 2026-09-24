import { Badge } from '../../../shared/components'
import { TRANSACTION_STATUS_META, metaOf } from '../../../shared/constants/enums'

export function TransactionStatusBadge({ statusId }: { statusId: number }) {
  const { label, tone } = metaOf(TRANSACTION_STATUS_META, statusId)
  return <Badge tone={tone}>{label}</Badge>
}
