import { initTRPC } from '@trpc/server'

import { createContext } from './context'

const t = initTRPC.context<typeof createContext>().create()

export const { createCallerFactory } = t
export const { router } = t
export const publicProcedure = t.procedure
