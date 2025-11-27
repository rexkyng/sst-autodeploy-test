import { createFileRoute } from '@tanstack/react-router'
import { CustomerDetailPage } from '@/pages/crm/customer'

export const Route = createFileRoute('/crm/customer')({
  component: CustomerDetailPage,
})

