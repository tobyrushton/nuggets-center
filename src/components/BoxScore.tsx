import 'server-only'
import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import Link from 'next/link'
import { shortenName } from '@/lib/shortenName'
import { TableRow, TableCell } from './ui/table'
import { Skeleton } from './ui/skeleton'

type TStats = player.IGameStats & {
    player: {
        id: string
        first_name: string
        last_name: string
        profile_url: string
    }
}

interface BoxScoreItemProps {
    stats: TStats
}

interface BoxScoreProps {
    id: string
}

const calculateTeamStats = (stats: TStats[]): TStats => {
    const totals = stats.reduce(
        (acc, curr) => {
            acc.fgm += curr.fgm
            acc.fga += curr.fga
            acc.fg3m += curr.fg3m
            acc.fg3a += curr.fg3a
            acc.ftm += curr.ftm
            acc.fta += curr.fta
            acc.reb += curr.reb
            acc.ast += curr.ast
            acc.stl += curr.stl
            acc.blk += curr.blk
            acc.pf += curr.pf
            acc.turnover += curr.turnover
            acc.pts += curr.pts

            return acc
        },
        {
            min: 0,
            fgm: 0,
            fga: 0,
            fg3m: 0,
            fg3a: 0,
            ftm: 0,
            fta: 0,
            reb: 0,
            ast: 0,
            stl: 0,
            blk: 0,
            pf: 0,
            turnover: 0,
            pts: 0,
        }
    )

    return {
        ...totals,
        game_id: stats[0].game_id,
        min: '',
        player_id: 'team',
        fg_pct: Math.floor((totals.fgm / totals.fga) * 100),
        fg3_pct: Math.floor((totals.fg3m / totals.fg3a) * 100),
        ft_pct: Math.floor((totals.ftm / totals.fta) * 100),
        player: {
            id: 'team',
            first_name: 'Team',
            last_name: 'Total',
            profile_url: '',
        },
    }
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
            <TableCell className="sticky left-0 bg-white dark:bg-black">
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
    const teamStats = calculateTeamStats(stats)

    return (
        <>
            {stats
                .sort((a, b) => parseInt(b.min, 10) - parseInt(a.min, 10))
                .map(game => (
                    <BoxScoreItem key={game.player_id} stats={game} />
                ))}
            <BoxScoreItem stats={teamStats} />
        </>
    )
}
