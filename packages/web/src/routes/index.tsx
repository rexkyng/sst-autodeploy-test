import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { login } from '@/server/auth'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context, location }) => {
    // @ts-ignore
    const user = context.user
    
    if (user) {
      const search = location.search as Record<string, any>
      const crmParams = extractCrmSearchParams(search)

      if (crmParams) {
        throw redirect({ 
          to: '/crm/wrapup', 
          search: {
            NationalId: crmParams.nationalId,
            NationalIdType: crmParams.nationalIdType,
            ...search
          }
        })
      }
      
      throw redirect({ to: '/crm/search' })
    }
  },
  component: IndexPage,
})

function extractCrmSearchParams(search: Record<string, any>) {
  const nationalId = search?.NationalId
  const nationalIdType = search?.NationalIdType
  
  if (nationalId && nationalIdType) {
    return { nationalId, nationalIdType }
  }
  return null
}

function IndexPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const loginFn = useServerFn(login)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    try {
      const result = await loginFn()
      if (result?.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Login failed:', error)
      setIsLoggingIn(false)
    }
  }

  // If we are here, it means user is NOT authenticated (otherwise beforeLoad would have redirected)
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-2xl font-bold">UAF CRM</h1>
      <form onSubmit={handleLogin}>
        <button 
          type="submit"
          disabled={isLoggingIn}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? 'Loading...' : 'Login with OpenAuth'}
        </button>
      </form>
    </div>
  )
}
