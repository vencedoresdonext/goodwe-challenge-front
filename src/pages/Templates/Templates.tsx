import { useEffect, useState } from 'react'
import { getReports } from '../../services/reports'
import type { Report } from '../../types'
import style from './style.module.css'

export default function Templates() {
  const [reports, setReports] = useState<Report[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)

  useEffect(() => {
    getReports().then(setReports)
  }, [])

  async function handleGenerate(report: Report) {
    setLoadingId(report.id)
    try {
      // TODO: chamar services/reports.ts -> generateReport(report.id) quando integrar com o back-end
      await new Promise((resolve) => setTimeout(resolve, 600))
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className={style.page}>
      <h1>Relatórios</h1>

      <div className={style.tableWrapper}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Data | Última Recarga</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.description}</td>
                <td>{report.lastRecharge}</td>
                <td>
                  <button
                    type="button"
                    className={style.generateButton}
                    onClick={() => handleGenerate(report)}
                    disabled={loadingId === report.id}
                  >
                    {loadingId === report.id ? 'Gerando...' : 'Gerar Relatório'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
