import { createFileRoute } from '@tanstack/react-router'
import { WrapupPage } from '@/pages/crm/wrapup'

export const Route = createFileRoute('/crm/wrapup')({
  component: WrapupPage,
})

