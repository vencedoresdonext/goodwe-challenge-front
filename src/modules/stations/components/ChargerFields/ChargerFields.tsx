import { SelectField, TextField } from '../../../../shared/components'
import { CONNECTOR_TYPE_OPTIONS } from '../../../../shared/constants/enums'
import { formatCurrency } from '../../../../shared/utils'
import type { ChargerFieldErrors, ChargerFormState } from './charger-form'
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
      <SelectField
        label="Tipo de conector"
        placeholder="Selecione"
        value={value.connectorType}
        options={[...CONNECTOR_TYPE_OPTIONS]}
        error={errors.connectorType}
        onChange={(e) => onChange({ connectorType: e.target.value })}
        disabled={disabled}
      />
      <TextField
        label="Potência máx. (kW)"
        inputMode="decimal"
        placeholder="22"
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
