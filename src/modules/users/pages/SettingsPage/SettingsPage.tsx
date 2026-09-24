import { LogOut } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { env } from '../../../../config/env'
import { getErrorMessage } from '../../../../lib/http'
import { Button, InlineError, PageHeader, TextField, useToast } from '../../../../shared/components'
import { useDocumentTitle } from '../../../../shared/hooks'
import { formatDate, isPhone, normalizePhone } from '../../../../shared/utils'
import { useAuth } from '../../../auth'
import { usersApi } from '../../api/users.api'
import type { UpdateProfileRequest } from '../../types'
import styles from './SettingsPage.module.css'

export function SettingsPage() {
  useDocumentTitle('Configuração')
  const { user, setUser, logout } = useAuth()
  const toast = useToast()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [phoneError, setPhoneError] = useState<string>()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const changes: UpdateProfileRequest = {}
  if (fullName.trim() && fullName.trim() !== (user?.fullName ?? '')) changes.fullName = fullName.trim()
  if (phone.trim() && normalizePhone(phone) !== (user?.phone ?? '')) changes.phone = normalizePhone(phone)
  const hasChanges = Object.keys(changes).length > 0

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (changes.phone && !isPhone(phone)) {
      setPhoneError('Use o formato com DDI e DDD, ex.: +5511999999999.')
      return
    }
    setPhoneError(undefined)
    setError(null)
    setSaving(true)
    try {
      const updated = await usersApi.updateMe(changes)
      setUser(updated)
      toast.success('Perfil atualizado.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader title="Configuração" description="Seus dados de acesso e contato." />

      <div className={styles.grid}>
        <section className={styles.section} aria-labelledby="profile-title">
          <h2 id="profile-title" className={styles.sectionTitle}>
            Perfil
          </h2>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <TextField label="Email" value={user?.email ?? ''} disabled hint="O email não pode ser alterado." />
            <TextField
              label="Nome completo"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              label="Telefone"
              type="tel"
              autoComplete="tel"
              placeholder="+5511999999999"
              value={phone}
              error={phoneError}
              onChange={(e) => setPhone(e.target.value)}
            />
            <InlineError message={error} />
            <div>
              <Button type="submit" loading={saving} disabled={!hasChanges}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </section>

        <section className={styles.section} aria-labelledby="account-title">
          <h2 id="account-title" className={styles.sectionTitle}>
            Conta
          </h2>
          <dl className={styles.details}>
            <div>
              <dt>Cliente desde</dt>
              <dd>{formatDate(user?.createdAt)}</dd>
            </div>
            <div>
              <dt>Servidor</dt>
              <dd className={styles.mono}>{env.apiUrl}</dd>
            </div>
          </dl>
          <Button variant="danger" icon={<LogOut size={16} />} onClick={logout}>
            Sair da conta
          </Button>
        </section>
      </div>
    </>
  )
}
