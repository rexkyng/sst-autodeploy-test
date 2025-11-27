import { createFileRoute } from '@tanstack/react-router'
import { ReferenceListPage } from '@/pages/crm/reference-list'

export const Route = createFileRoute('/crm/reference-list')({
  component: ReferenceListPage,
})

