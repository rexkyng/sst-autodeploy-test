import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/crm/')({
  component: () => <Navigate to="/crm/search" />,
})

