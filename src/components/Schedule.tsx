import 'server-only'
import { FC } from 'react'
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

const ScheduleItem: FC<ScheduleItemProps> = ({ game }) => (
    <TableRow>
        <TableCell>{dayjs(game.date).format('MM/DD/YYYY')}</TableCell>
        <TableCell>
            <Link
                href={`/team/${game.opponent.id}`}
                className="flex flex-row gap-2 items-center"
            >
                <Image
                    src={game.opponent.logo_url}
                    height={25}
                    width={25}
                    alt={game.opponent.name}
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

export const Schedule: FC = async () => {
    const { schedule } = await serverClient.getSchedule({})

    return (
        <Table>
            <TableCaption>Denver Nuggets Schedule</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Opponent</TableHead>
                    <TableHead>Result</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {schedule.map(game => (
                    <ScheduleItem key={game.id} game={game} />
                ))}
            </TableBody>
        </Table>
    )
}
