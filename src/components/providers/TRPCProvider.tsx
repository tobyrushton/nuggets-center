'use client'

import { useState, FC, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { trpc } from '@/app/_trpc/client'
import { url } from '@/server/url'

interface ProviderProps {
    children: ReactNode
}

export const TRPCProvider: FC<ProviderProps> = ({
    children,
}: ProviderProps) => {
    const [queryClient] = useState(() => new QueryClient({}))

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    // import 'url' from a server file.
                    url: `${url}/api/trpc`,
                }),
            ],
        })
    )
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}
