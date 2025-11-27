import { createFileRoute } from '@tanstack/react-router'
import { SearchPage } from '@/pages/crm/search'

export const Route = createFileRoute('/crm/search')({
  component: SearchPage,
})

