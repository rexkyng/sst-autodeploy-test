import { createFileRoute } from '@tanstack/react-router'
import { ContactAmendmentPage } from '@/pages/crm/contact-amendment'

export const Route = createFileRoute('/crm/contact-amendment')({
  component: ContactAmendmentPage,
})

