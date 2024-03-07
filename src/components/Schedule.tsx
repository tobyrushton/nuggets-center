import 'server-only'
import { FC, Suspense } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from './ui/skeleton'

interface ScheduleItemProps {
    game: {
        id: string
        date: Date
        home: boolean
        opponent: {
            id: string
            name: string
            logo_url: string
        }
        opponent_score: number
        home_score: number
    }
}

interface ScheduleProps {
    caption: string
    opponentId?: string
}

type ScheduleBodyProps = Omit<ScheduleProps, 'caption'>

const ScheduleItemSkeleton: FC = () => (
    <TableRow>
        <TableCell>
            <Skeleton className="h-5 w-20" />
        </TableCell>
        <TableCell>
            <div className="flex flex-row gap-2 items-center">
                <Skeleton className="rounded-full h-6 w-6" />
                <Skeleton className="h-5 w-40" />
            </div>
        </TableCell>
        <TableCell>
            <Skeleton className="h-5 w-20" />
        </TableCell>
    </TableRow>
)

const ScheduleItem: FC<ScheduleItemProps> = ({ game }) => (
    <TableRow>
        <TableCell>
            <Link href={`/game/${game.id}`}>
                {dayjs(game.date).format('MM/DD/YYYY')}
            </Link>
        </TableCell>
        <TableCell>
            <Link
                href={`/team/${game.opponent.id}`}
                className="flex flex-row gap-2 items-center"
            >
                <Image
                    src={game.opponent.logo_url}
                    height={25}
                    width={25}
                    alt={`${game.opponent.name} Logo`}
                />
                {game.home ? 'vs' : '@'} {game.opponent.name}
            </Link>
        </TableCell>
        <TableCell>
            {game.home_score !== -1 ? (
                game.home ? (
                    game.home_score > game.opponent_score ? (
                        <Link href={`/game/${game.id}`}>
                            W {game.home_score}-{game.opponent_score}
                        </Link>
                    ) : (
                        <Link href={`/game/${game.id}`}>
                            L {game.home_score}-{game.opponent_score}
                        </Link>
                    )
                ) : game.home_score < game.opponent_score ? (
                    <Link href={`/game/${game.id}`}>
                        W {game.home_score}-{game.opponent_score}
                    </Link>
                ) : (
                    <Link href={`/game/${game.id}`}>
                        L {game.home_score}-{game.opponent_score}
                    </Link>
                )
            ) : (
                `N/A`
            )}
        </TableCell>
    </TableRow>
)

const ScheduleBodySkeleton: FC = () => (
    <>
        {new Array(82).fill(null).map((_, i) => (
            <ScheduleItemSkeleton key={`schedule-skeleton-${i.toString()}`} />
        ))}
    </>
)

const ScheduleBody: FC<ScheduleBodyProps> = async ({ opponentId }) => {
    const { schedule } = await serverClient.getSchedule({ opponentId })

    return (
        <>
            {schedule.map(game => (
                <ScheduleItem key={game.id} game={game} />
            ))}
        </>
    )
}

export const Schedule: FC<ScheduleProps> = async ({ caption, opponentId }) => {
    return (
        <Table>
            <TableCaption>{caption}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Opponent</TableHead>
                    <TableHead>Result</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <Suspense fallback={<ScheduleBodySkeleton />}>
                    <ScheduleBody opponentId={opponentId} />
                </Suspense>
            </TableBody>
        </Table>
    )
}
