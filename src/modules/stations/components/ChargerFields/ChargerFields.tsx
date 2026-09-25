import { TextField } from '../../../../shared/components'
import { formatCurrency } from '../../../../shared/utils'
import { MAX_CHARGER_POWER_KW, type ChargerFieldErrors, type ChargerFormState } from './charger-form'
import styles from './ChargerFields.module.css'

interface ChargerFieldsProps {
  value: ChargerFormState
  errors?: ChargerFieldErrors
  onChange: (patch: Partial<ChargerFormState>) => void
  /** Preço da station, mostrado como padrão quando o preço do carregador fica vazio */
  stationPricePerKwh?: number | null
  layout?: 'row' | 'stack'
  disabled?: boolean
}

export function ChargerFields({
  value,
  errors = {},
  onChange,
  stationPricePerKwh,
  layout = 'stack',
  disabled,
}: ChargerFieldsProps) {
  const pricePlaceholder =
    stationPricePerKwh != null ? `${formatCurrency(stationPricePerKwh)} (da station)` : 'Mesmo da station'

  return (
    <div className={layout === 'row' ? styles.row : styles.stack}>
      <TextField
        label="Potência máx. (kW)"
        inputMode="decimal"
        placeholder={String(MAX_CHARGER_POWER_KW)}
        hint={layout === 'stack' ? `Até ${MAX_CHARGER_POWER_KW} kW. Use menos para limitar a recarga.` : undefined}
        value={value.maxPowerKw}
        error={errors.maxPowerKw}
        onChange={(e) => onChange({ maxPowerKw: e.target.value })}
        disabled={disabled}
      />
      <TextField
        label="Preço por kWh (R$)"
        inputMode="decimal"
        placeholder={pricePlaceholder}
        hint={layout === 'stack' ? 'Deixe vazio para usar o preço da station.' : undefined}
        value={value.pricePerKwh}
        error={errors.pricePerKwh}
        onChange={(e) => onChange({ pricePerKwh: e.target.value })}
        disabled={disabled}
      />
    </div>
  )
}
