import { createFileRoute } from '@tanstack/react-router'
import { ReminderHistoryPage } from '@/pages/crm/reminder-history'

export const Route = createFileRoute('/crm/reminder-history')({
  component: ReminderHistoryPage,
})

