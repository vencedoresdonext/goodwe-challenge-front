import type { Report } from '../types'

// TODO: remover o mock quando o back-end NestJS estiver disponível
const mockReports: Report[] = [
  { id: '1', name: 'CARREGADOR 1', description: 'Carregador 1 | Unidade Paulista | Data da ...', lastRecharge: '25/08/2026' },
  { id: '2', name: 'CARREGADOR 2', description: 'Carregador 2 | Unidade Aclimação | Data da ...', lastRecharge: '25/08/2026' },
  { id: '3', name: 'CARREGADOR 3', description: 'Carregador 3 | Unidade Paulista | Data da ...', lastRecharge: '25/08/2026' },
  { id: '4', name: 'CARREGADOR 4', description: 'Carregador 4 | Unidade Paulista | Data da ...', lastRecharge: '25/08/2026' },
  { id: '5', name: 'CARREGADOR 5', description: 'Carregador 5 | Unidade Aclimação | Data da ...', lastRecharge: '25/08/2026' },
]

export async function getReports(): Promise<Report[]> {
  // Implementação real:
  // const res = await fetch(`${import.meta.env.VITE_API_URL}/reports`)
  // if (!res.ok) throw new Error('Falha ao buscar relatórios')
  // return res.json()

  return Promise.resolve(mockReports)
}

export async function generateReport(reportId: string): Promise<Blob> {
  // Implementação real:
  // const res = await fetch(`${import.meta.env.VITE_API_URL}/reports/${reportId}/generate`, { method: 'POST' })
  // if (!res.ok) throw new Error('Falha ao gerar relatório')
  // return res.blob()

  throw new Error('generateReport ainda não integrado com o back-end')
}
