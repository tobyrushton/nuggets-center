import 'server-only'
import { FC, Suspense } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import dayjs from 'dayjs'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
    TableCaption,
} from './ui/table'
import { Skeleton } from './ui/skeleton'

interface GameItemProps {
    game: Omit<player.IGameStats, 'oreb' | 'dreb'> & {
        reb: number
        date: Date
    }
}

interface PlayerGameProps {
    id: string
    loading?: boolean
}

const GameItemSkeleton: FC = () => {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="h-6 w-24" />
            </TableCell>
            {Array.from({ length: 16 }, (_, i) => (
                <TableCell key={`table-skeleton-${i.toString()}`}>
                    <Skeleton className="h-6 w-8" />
                </TableCell>
            ))}
        </TableRow>
    )
}

const GameItem: FC<GameItemProps> = ({ game }) => {
    return (
        <TableRow>
            <TableCell>
                <Link href={`/game/${game.game_id}`}>
                    {dayjs(game.date).format('MM/DD/YYYY')}
                </Link>
            </TableCell>
            <TableCell>{game.min}</TableCell>
            <TableCell>{game.pts}</TableCell>
            <TableCell>{game.ast}</TableCell>
            <TableCell>{game.reb}</TableCell>
            <TableCell>{game.stl}</TableCell>
            <TableCell>{game.blk}</TableCell>
            <TableCell>{game.turnover}</TableCell>
            <TableCell>{game.fgm}</TableCell>
            <TableCell>{game.fga}</TableCell>
            <TableCell>{game.fg_pct}</TableCell>
            <TableCell>{game.fg3m}</TableCell>
            <TableCell>{game.fg3a}</TableCell>
            <TableCell>{game.fg3_pct}</TableCell>
            <TableCell>{game.fta}</TableCell>
            <TableCell>{game.ftm}</TableCell>
            <TableCell>{game.ft_pct}</TableCell>
        </TableRow>
    )
}

const PlayerGamesSkeleton: FC = () => {
    return (
        <>
            {Array.from({ length: 10 }, (_, i) => (
                <GameItemSkeleton key={i} />
            ))}
        </>
    )
}

const PlayerGamesBody: FC<Omit<PlayerGameProps, 'loading'>> = async ({
    id,
}) => {
    const { stats } = await serverClient.getGameStats({ player_id: id })

    return (
        <>
            {stats.map(game => (
                <GameItem key={game.id} game={game} />
            ))}
        </>
    )
}

export const PlayerGames: FC<PlayerGameProps> = ({ id, loading }) => {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="font-bold text-xl">Game Log</h1>
            <Table>
                <TableCaption>{getCurrentSeason()} Season</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Minutes</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Assists</TableHead>
                        <TableHead>Rebounds</TableHead>
                        <TableHead>Steals</TableHead>
                        <TableHead>Blocks</TableHead>
                        <TableHead>Turnovers</TableHead>
                        <TableHead>FGM</TableHead>
                        <TableHead>FGA</TableHead>
                        <TableHead>FG%</TableHead>
                        <TableHead>3PM</TableHead>
                        <TableHead>3PA</TableHead>
                        <TableHead>3P%</TableHead>
                        <TableHead>FTA</TableHead>
                        <TableHead>FTM</TableHead>
                        <TableHead>FT%</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <PlayerGamesSkeleton />
                    ) : (
                        <Suspense fallback={<PlayerGamesSkeleton />}>
                            <PlayerGamesBody id={id} />
                        </Suspense>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
