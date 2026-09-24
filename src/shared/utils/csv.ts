type Cell = string | number | boolean | null | undefined

function escapeCell(value: Cell) {
  const text = value == null ? '' : String(value)
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function downloadCsv(filename: string, headers: string[], rows: Cell[][]) {
  const content = [headers, ...rows].map((row) => row.map(escapeCell).join(';')).join('\n')
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
