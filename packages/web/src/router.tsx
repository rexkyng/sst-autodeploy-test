import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: {
      queryClient: rqContext.queryClient,
      // user will be populated by beforeLoad in __root.tsx
      user: null,
    },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
          <TanstackQuery.Provider {...rqContext}>
            {props.children}
          </TanstackQuery.Provider>
      )
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
