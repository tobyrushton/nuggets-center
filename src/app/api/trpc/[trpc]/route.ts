import { appRouter } from '@/server'
import { createContext } from '@/server/context'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

export const runtime = 'edge'

const handler = (req: Request): Promise<Response> =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext,
    })

export { handler as GET, handler as POST }
