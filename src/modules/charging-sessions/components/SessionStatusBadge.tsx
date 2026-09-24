import { Badge } from '../../../shared/components'
import { ChargerSessionStatus, SESSION_STATUS_META, metaOf } from '../../../shared/constants/enums'

export function SessionStatusBadge({ statusId }: { statusId: number }) {
  const { label, tone } = metaOf(SESSION_STATUS_META, statusId)
  return (
    <Badge tone={tone} pulse={statusId === ChargerSessionStatus.CHARGING}>
      {label}
    </Badge>
  )
}
