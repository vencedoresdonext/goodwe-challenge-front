import { Plus, Trash2, Zap } from 'lucide-react'
import { Button, IconButton } from '../../../../shared/components'
import { formatKw, parseDecimal } from '../../../../shared/utils'
import type { ChargerFieldErrors, ChargerFormState } from './charger-form'
import { emptyCharger } from './charger-form'
import { ChargerFields } from './ChargerFields'
import styles from './ChargersFieldset.module.css'

interface ChargersFieldsetProps {
  chargers: ChargerFormState[]
  errors: Record<string, ChargerFieldErrors>
  onChange: (chargers: ChargerFormState[]) => void
  stationPricePerKwh?: number | null
  contractedDemandKw?: number | null
  disabled?: boolean
}

const MAX_CHARGERS = 20

export function ChargersFieldset({
  chargers,
  errors,
  onChange,
  stationPricePerKwh,
  contractedDemandKw,
  disabled,
}: ChargersFieldsetProps) {
  const installedKw = chargers.reduce((sum, c) => sum + (parseDecimal(c.maxPowerKw) ?? 0), 0)
  const overDemand = !!contractedDemandKw && installedKw > contractedDemandKw

  const update = (uid: string, patch: Partial<ChargerFormState>) =>
    onChange(chargers.map((c) => (c.uid === uid ? { ...c, ...patch } : c)))

  const remove = (uid: string) => onChange(chargers.filter((c) => c.uid !== uid))

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        <span>
          <Zap size={16} aria-hidden /> Carregadores
        </span>
        <small>
          {chargers.length} {chargers.length === 1 ? 'carregador' : 'carregadores'}
          {installedKw > 0 && `, ${formatKw(installedKw)} instalados`}
        </small>
      </legend>

      <ol className={styles.list}>
        {chargers.map((charger, index) => (
          <li key={charger.uid} className={styles.item}>
            <span className={styles.index} aria-hidden>
              {String(index + 1).padStart(2, '0')}
            </span>
            <ChargerFields
              layout="row"
              value={charger}
              errors={errors[charger.uid]}
              stationPricePerKwh={stationPricePerKwh}
              onChange={(patch) => update(charger.uid, patch)}
              disabled={disabled}
            />
            <IconButton
              label={`Remover carregador ${index + 1}`}
              onClick={() => remove(charger.uid)}
              disabled={disabled || chargers.length === 1}
              className={styles.remove}
            >
              <Trash2 size={16} />
            </IconButton>
          </li>
        ))}
      </ol>

      {overDemand && (
        <p className={styles.warning}>
          A potência instalada ({formatKw(installedKw)}) passa da demanda contratada ({formatKw(contractedDemandKw)}).
          Tudo bem, mas as recargas simultâneas serão limitadas pelo balanceamento de carga.
        </p>
      )}

      <div className={styles.footer}>
        <Button
          variant="ghost"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => onChange([...chargers, emptyCharger()])}
          disabled={disabled || chargers.length >= MAX_CHARGERS}
        >
          Adicionar outro carregador
        </Button>
        <small>Toda station precisa de pelo menos um carregador.</small>
      </div>
    </fieldset>
  )
}
