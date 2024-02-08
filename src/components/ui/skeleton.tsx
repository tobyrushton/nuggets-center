import React from 'react'
import { cn } from '@/lib/utils'

const Skeleton = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactNode => {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-slate-100 dark:bg-slate-800',
                className
            )}
            {...props}
        />
    )
}

export { Skeleton }
