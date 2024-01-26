import { router } from './trpc'

export const appRouter = router({
    // import your routers or add your procedures here...
})

export type AppRouter = typeof appRouter
