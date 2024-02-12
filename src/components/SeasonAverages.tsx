import 'server-only'
import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import { CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'

interface SeasonAverageProps {
    title: string
    value: number
}

interface SeasonAveragesProps {
    id: string
}

type SeasonAverageItemSkeletonProps = Omit<SeasonAverageProps, 'value'>

const SeasonAverageItemSkeleton: FC<SeasonAverageItemSkeletonProps> = ({
    title,
}) => {
    return (
        <li className="inline-block text-center">
            <p className="text-sm text-neutral-400">{title}</p>
            <Skeleton className="h-7 w-10" />
        </li>
    )
}

const SeasonAverageItem: FC<SeasonAverageProps> = ({ title, value }) => {
    return (
        <li className="inline-block text-center">
            <p className="text-sm text-neutral-400">{title}</p>
            <p className="text-xl">{value}</p>
        </li>
    )
}

export const SkeletonSeasonAverages: FC = () => {
    return (
        <CardContent>
            <ul className="flex justify-between px-2 sm:px-5 md:px-10">
                <SeasonAverageItemSkeleton title="PTS" />
                <SeasonAverageItemSkeleton title="AST" />
                <SeasonAverageItemSkeleton title="REB" />
                <SeasonAverageItemSkeleton title="STL" />
                <SeasonAverageItemSkeleton title="BLK" />
                <SeasonAverageItemSkeleton title="FG%" />
            </ul>
        </CardContent>
    )
}

export const SeasonAverages: FC<SeasonAveragesProps> = async ({ id }) => {
    const { seasonAverage } = await serverClient.getSeasonAverage({ id })

    return (
        <CardContent>
            <ul className="flex justify-between px-2 sm:px-5 md:px-10">
                <SeasonAverageItem title="PTS" value={seasonAverage.pts} />
                <SeasonAverageItem title="AST" value={seasonAverage.ast} />
                <SeasonAverageItem title="REB" value={seasonAverage.reb} />
                <SeasonAverageItem title="STL" value={seasonAverage.stl} />
                <SeasonAverageItem title="BLK" value={seasonAverage.blk} />
                <SeasonAverageItem title="FG%" value={seasonAverage.fg_pct} />
            </ul>
        </CardContent>
    )
}
