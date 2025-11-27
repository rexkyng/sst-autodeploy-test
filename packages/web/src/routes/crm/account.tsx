import { createFileRoute } from '@tanstack/react-router'
import { AccountDetailPage } from '@/pages/crm/account'

export const Route = createFileRoute('/crm/account')({
  component: AccountDetailPage,
})

