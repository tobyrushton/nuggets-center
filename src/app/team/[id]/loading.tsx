import 'server-only'
import { FC } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

const TeamLoading: FC = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 p-3 items-center justify-center sm:justify-start">
                <Skeleton className="rounded-full h-20 w-20" />
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl p-2">
                    <Skeleton className="h-12 w-96" />
                </h1>
            </div>
            <Separator />
        </div>
    )
}

export default TeamLoading
