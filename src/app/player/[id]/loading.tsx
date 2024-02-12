import 'server-only'
import { FC } from 'react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonSeasonAverages } from '@/components/SeasonAverages'
import { PlayerGames } from '@/components/PlayerGames'

const PlayerLoading: FC = () => {
    return (
        <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex fex-row gap-2 px-2 min-w-fit">
                    <Skeleton className="h-40 w-40 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-xl">
                            <Skeleton className="h-8 w-40" />
                        </h2>
                        <ul className="list-disc pl-3">
                            <li className="mt-1">
                                <Skeleton className="h-6 w-10" />
                            </li>
                            <li className="mt-1">
                                <Skeleton className="h-6 w-10" />
                            </li>
                            <li className="mt-1">
                                <Skeleton className="h-6 w-10" />
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col px-5 hidden sm:block">
                    <Separator orientation="vertical" />
                </div>
                <Separator className="block md:hidden" />
                <Card className="w-full max-w-lg self-center">
                    <CardHeader>
                        <CardTitle className="flex justify-center">
                            <Skeleton className="h-8 w-48" />
                        </CardTitle>
                        <Separator />
                    </CardHeader>
                    <SkeletonSeasonAverages />
                </Card>
            </div>
            <Separator />
            <PlayerGames id="" loading />
        </div>
    )
}

export default PlayerLoading
