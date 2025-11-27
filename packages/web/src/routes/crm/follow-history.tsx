import { createFileRoute } from '@tanstack/react-router'
import { FollowHistoryPage } from '@/pages/crm/follow-history'

export const Route = createFileRoute('/crm/follow-history')({
  component: FollowHistoryPage,
})

