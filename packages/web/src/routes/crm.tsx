import {
  createFileRoute,
  Outlet,
  useNavigate,
  useLocation,
  redirect,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TopActionBar } from '@/components/top-action-bar'
import { LoaderDialog } from '@/components/dialogs/loader-dialog'
import { useCRMStore } from '@/store/crm-store'
import { useCustomerData } from '@/hooks/use-customer-data'
import { getQueryStringObject } from '@/lib/query-string'

export const Route = createFileRoute('/crm')({
  beforeLoad: ({ context }) => {
    // @ts-ignore
    if (!context.user) {
      throw redirect({ to: '/' })
    }
  },
  component: CRMLayout,
})

function CRMLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loadCustomer, loading } = useCustomerData()
  const store = useCRMStore()

  // Derived state: get active tab directly from URL
  const activeTab = location.pathname.split('/crm/')[1] || 'search'

  const bootstrapFromQuery = async () => {
    // Load customer on mount if NationalId in query params
    const querystring = getQueryStringObject()
    const nationalId = querystring.NationalId
    const nationalIdType = querystring.NationalIdType

    if (nationalId && nationalIdType) {
      store.setSearchCriteria({
        searchedNationalIdType: nationalIdType,
        searchedNationalId: nationalId,
        isSearch: false,
        startTime: new Date(),
      })

      try {
        await loadCustomer(nationalIdType, nationalId, false)
        // Navigate to wrapup tab if customer loaded successfully
        navigate({ to: '/crm/wrapup' as any })
      } catch {
        // On error, navigate to search page
        navigate({ to: '/crm/search' as any })
      }
    } else {
      // No query params, ensure we're on search if not already on a specific tab
      if (activeTab === 'search') {
        store.setSearchCriteria({ isSearch: true })
      }
    }
  }

  useEffect(() => {
    bootstrapFromQuery()
  }, [])

  const handleTabChange = (value: string) => {
    // Navigate to the corresponding route
    navigate({ to: `/crm/${value}` as any })
  }

  return (
    <div className="h-screen flex flex-col">
      <LoaderDialog open={loading} />
      <TopActionBar />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col h-full"
      >
        <TabsList className="w-full justify-start border-b rounded-none shrink-0">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="wrapup">Wrapup</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="reference-list">Reference List</TabsTrigger>
          <TabsTrigger value="follow-history">Follow History</TabsTrigger>
          <TabsTrigger value="reminder-history">Reminder History</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="contact-amendment">Contact Amendment</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </Tabs>
    </div>
  )
}
