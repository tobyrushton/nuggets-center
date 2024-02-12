import 'server-only'
import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import Link from 'next/link'
import { shortenName } from '@/lib/shortenName'
import { TableRow, TableCell } from './ui/table'
import { Skeleton } from './ui/skeleton'

interface BoxScoreItemProps {
    stats: player.IGameStats & {
        player: {
            id: string
            first_name: string
            last_name: string
            profile_url: string
        }
    }
}

interface BoxScoreProps {
    id: string
}

const BoxScoreItemSkeleton: FC = () => {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="h-5 w-24" />
            </TableCell>
            {Array.from({ length: 11 }).map((_, i) => (
                <TableCell key={`box-score-skeleton-${i.toString()}`}>
                    <Skeleton className="h-5 w-10" />
                </TableCell>
            ))}
        </TableRow>
    )
}

const BoxScoreItem: FC<BoxScoreItemProps> = async ({ stats }) => {
    return (
        <TableRow className="text-nowrap">
            <TableCell>
                <Link href={`/player/${stats.player.id}`}>
                    {shortenName(
                        `${stats.player.first_name} ${stats.player.last_name}`
                    )}
                </Link>
            </TableCell>
            <TableCell>{stats.min}</TableCell>
            <TableCell>
                {stats.fgm}-{stats.fga}
            </TableCell>
            <TableCell>
                {stats.fg3m}-{stats.fg3a}
            </TableCell>
            <TableCell>
                {stats.ftm}-{stats.fta}
            </TableCell>
            <TableCell>{stats.reb}</TableCell>
            <TableCell>{stats.ast}</TableCell>
            <TableCell>{stats.stl}</TableCell>
            <TableCell>{stats.blk}</TableCell>
            <TableCell>{stats.pf}</TableCell>
            <TableCell>{stats.turnover}</TableCell>
            <TableCell>{stats.pts}</TableCell>
        </TableRow>
    )
}

export const BoxScoreSkeleton: FC = () => {
    return (
        <>
            {Array.from({ length: 11 }).map((_, i) => (
                <BoxScoreItemSkeleton
                    key={`box-score-skeleton-top-${i.toString()}`}
                />
            ))}
        </>
    )
}

export const BoxScore: FC<BoxScoreProps> = async ({ id }) => {
    const { stats } = await serverClient.getGameStats({ game_id: id })

    return (
        <>
            {stats
                .sort((a, b) => parseInt(b.min, 10) - parseInt(a.min, 10))
                .map(game => (
                    <BoxScoreItem key={game.player_id} stats={game} />
                ))}
        </>
    )
}
