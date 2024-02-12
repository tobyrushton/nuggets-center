import { router } from './trpc'
import * as routers from './routers'

export const appRouter = router({
    ...routers,
})

export type AppRouter = typeof appRouter
