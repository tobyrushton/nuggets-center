import 'server-only'
import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { Skeleton } from './ui/skeleton'

export const LastFiveGamesSkeleton: FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Last 5 Games</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {new Array(5).fill(null).map((_, i) => (
                        <li key={'skeleton-row'.concat(i.toString())}>
                            <div className="p-1 flex flex-row h-fit">
                                <div className="flex grow flex-col px-2 gap-2">
                                    <span className="flex flex-row justify-between">
                                        <span className="flex flex-row gap-2">
                                            <Skeleton className="rounded-full h-6 w-6" />
                                            <Skeleton className="h-5 w-32" />
                                        </span>
                                        <Skeleton className="h-5 w-10" />
                                    </span>
                                    <span className="flex flex-row justify-between">
                                        <span className="flex flex-row gap-2">
                                            <Skeleton className="rounded-full h-6 w-6" />
                                            <Skeleton className="h-5 w-32" />
                                        </span>
                                        <Skeleton className="h-5 w-10" />
                                    </span>
                                </div>
                                <div className="flex flex-col px-1">
                                    <Separator
                                        orientation="vertical"
                                        className=""
                                    />
                                </div>
                                <div className="self-center w-10">
                                    <Skeleton className="h-6 w-6 ml-2" />
                                </div>
                            </div>
                            <Separator />
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

export const LastFiveGames: FC = async () => {
    const [{ schedule: lastFiveGames }, { team }] = await Promise.all([
        await serverClient.getSchedule({
            take: 5,
            method: 'last',
        }),
        await serverClient.getTeam({ name: 'Denver Nuggets' }),
    ])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Last 5 Games</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {lastFiveGames.map(game => (
                        <li key={game.id}>
                            <Link href={`/game/${game.id}`}>
                                <div className="p-1 flex flex-row h-fit">
                                    <div className="flex grow flex-col px-2">
                                        <span className="flex flex-row justify-between">
                                            <span className="flex flex-row gap-2">
                                                <Image
                                                    src={
                                                        game.home
                                                            ? team.logo_url
                                                            : game.opponent
                                                                  .logo_url
                                                    }
                                                    alt={
                                                        game.home
                                                            ? team.name
                                                            : game.opponent.name
                                                    }
                                                    height={25}
                                                    width={25}
                                                />
                                                <p>
                                                    {game.home
                                                        ? 'Denver Nuggets'
                                                        : game.opponent.name}
                                                </p>
                                            </span>
                                            <p>{game.home_score}</p>
                                        </span>
                                        <span className="flex flex-row justify-between">
                                            <span className="flex flex-row gap-2">
                                                <Image
                                                    src={
                                                        game.home
                                                            ? game.opponent
                                                                  .logo_url
                                                            : team.logo_url
                                                    }
                                                    alt={
                                                        game.home
                                                            ? game.opponent.name
                                                            : team.name
                                                    }
                                                    height={25}
                                                    width={25}
                                                />
                                                <p>
                                                    {game.home
                                                        ? game.opponent.name
                                                        : 'Denver Nuggets'}
                                                </p>
                                            </span>
                                            <p>{game.opponent_score}</p>
                                        </span>
                                    </div>
                                    <div className="flex flex-col px-1">
                                        <Separator
                                            orientation="vertical"
                                            className=""
                                        />
                                    </div>
                                    <p className="self-center text-center w-10">
                                        {game.home
                                            ? game.home_score >
                                              game.opponent_score
                                                ? 'W'
                                                : 'L'
                                            : game.opponent_score >
                                                game.home_score
                                              ? 'W'
                                              : 'L'}
                                    </p>
                                </div>
                                <Separator />
                            </Link>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
