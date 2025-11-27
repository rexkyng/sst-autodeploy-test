import { createFileRoute, Navigate } from '@tanstack/react-router'
import { exchange } from '../../server/auth'

export const Route = createFileRoute('/auth/callback')({
  loader: async ({ location }) => {
    const search = new URLSearchParams(location.search)
    const code = search.get('code')
    if (code) {
      try {
        await exchange({ data: { code } })
      } catch (error) {
        // If redirect was thrown, it will be handled by TanStack Router
        // If it's a real error, log it
        if (error && typeof error === 'object' && 'status' in error && error.status !== 307) {
          console.error('Exchange error:', error)
          throw error
        }
        // Re-throw redirects
        throw error
      }
    }
  },
  component: () => {
    // Show loading state while redirecting
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Completing login...</div>
      </div>
    )
  },
})

