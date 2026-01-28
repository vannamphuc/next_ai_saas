import 'server-only'

import type { RouterClient } from '@orpc/server'
import { headers } from 'next/headers'
import { createRouterClient } from '@orpc/server'
import { router } from '@/app/router'

declare global {
  var $client: RouterClient<typeof router> | undefined
}

globalThis.$client = createRouterClient(router, {
  context: async () => {
    const reqHeaders = await headers()
    return {
      request: new Request('http://localhost', { headers: reqHeaders }),
    }
  },
})
