import 'server-only'

import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import Image from 'next/image'
import Link from 'next/link'
import { shortenName } from '@/lib/shortenName'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Skeleton } from './ui/skeleton'

type Categories =
    | 'pts'
    | 'reb'
    | 'ast'
    | 'stl'
    | 'blk'
    | 'fg_pct'
    | 'fg3_pct'
    | 'ft_pct'
    | 'games_played'

interface LeaderCategories {
    abbr: Categories
    full: string
}

export const categories: LeaderCategories[] = [
    { abbr: 'pts', full: 'Points Per Game' },
    { abbr: 'reb', full: 'Rebounds Per Game' },
    { abbr: 'ast', full: 'Assists Per Game' },
    { abbr: 'stl', full: 'Steals Per Game' },
    { abbr: 'blk', full: 'Blocks Per Game' },
    { abbr: 'fg_pct', full: 'Field Goal Percentage' },
    { abbr: 'fg3_pct', full: 'Three-Point Percentage' },
    { abbr: 'ft_pct', full: 'Free Throw Percentage' },
    { abbr: 'games_played', full: 'Games Played' },
] as const

type Player = {
    player_id: string
    player_name: string
    value: number
    profile_url: string
}

interface LeaderItemProps {
    player: Player
    first?: boolean
}

interface LeaderCardProps {
    category: LeaderCategories
}

const LeaderItemSkeleton: FC<{ first?: boolean }> = ({ first }) => {
    return (
        <div
            className={cn('flex flex-col gap-2', {
                'w-full': first,
            })}
        >
            <Skeleton className="w-10 h-5" />
            <Skeleton
                className={cn('h-5', {
                    'w-40': first,
                    'w-20': !first,
                })}
            />
            <Skeleton
                className={cn('rounded-full self-center', {
                    'w-32 h-32': first,
                    'w-16 h-16': !first,
                })}
            />
        </div>
    )
}

const LeaderItem: FC<LeaderItemProps> = ({ player, first }) => {
    return (
        <Link
            href={`/player/${player.player_id}`}
            className={cn('flex flex-col overflow-hidden whitespace-nowrap', {
                'w-full': first,
            })}
        >
            <p className="font-bold">
                {player.value >= 0 ? player.value : 'N/A'}
            </p>
            <p className="text-nowrap">
                {first ? player.player_name : shortenName(player.player_name)}
            </p>
            <Image
                src={player.profile_url}
                alt={`${player.player_name} headshot`}
                width={first ? 200 : 100}
                height={first ? 200 : 100}
                className="self-center"
            />
        </Link>
    )
}

export const LeadersSkeleton: FC<LeaderCardProps> = ({ category }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{category.full}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                    <LeaderItemSkeleton first />
                    <Separator />
                    <div className="grid grid-cols-3 gap-2">
                        <LeaderItemSkeleton />
                        <LeaderItemSkeleton />
                        <LeaderItemSkeleton />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export const LeaderCard: FC<LeaderCardProps> = async ({ category }) => {
    const { leaders } = await serverClient.getLeaders({
        category: category.abbr,
        take: 4,
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>{category.full}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                    <span className="flex flex-col items-center gap-2">
                        <LeaderItem player={leaders[0]} first />
                        <Separator />
                    </span>
                    <span className="grid grid-cols-3 gap-2">
                        {leaders.slice(1).map(player => (
                            <LeaderItem
                                key={player.player_id}
                                player={player}
                            />
                        ))}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
