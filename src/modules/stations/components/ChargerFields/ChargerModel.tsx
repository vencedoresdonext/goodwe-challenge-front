import { Zap } from 'lucide-react'
import { CHARGER_MODEL } from '../../../../shared/constants/enums'
import styles from './ChargerFields.module.css'

/** Identificação do modelo de carregador usado em todos os cadastros */
export function ChargerModel() {
  return (
    <div className={styles.model}>
      <span className={styles.modelIcon} aria-hidden>
        <Zap size={16} />
      </span>
      <div>
        <strong>{CHARGER_MODEL.name}</strong>
        <span>
          {CHARGER_MODEL.line}, {CHARGER_MODEL.description}, conector {CHARGER_MODEL.connectorLabel}, até{' '}
          {CHARGER_MODEL.maxPowerKw} kW
        </span>
      </div>
    </div>
  )
}
