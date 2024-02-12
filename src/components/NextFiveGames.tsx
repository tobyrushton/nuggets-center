import 'server-only'
import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { Separator } from './ui/separator'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'

export const NextFiveGamesSkeleton: FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Next 5 Games</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {new Array(5).fill(null).map((_, i) => (
                        <li key={`skeleton-${i.toString()}`}>
                            <div className="p-1 flex flex-row h-fit">
                                <div className="flex grow flex-col px-2">
                                    <span className="flex flex-row gap-3">
                                        <Skeleton className="rounded-full h-6 w-6" />
                                        <Skeleton className="h-5 w-20" />
                                    </span>
                                    <span className="flex flex-row gap-3">
                                        <Skeleton className="rounded-full h-6 w-6" />
                                        <Skeleton className="h-5 w-20" />
                                    </span>
                                </div>
                                <div className="flex flex-col px-1">
                                    <Separator
                                        orientation="vertical"
                                        className=""
                                    />
                                </div>
                                <div className="self-center text-center w-10 text-small">
                                    <Skeleton className="h-10 w-10" />
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

export const NextFiveGames: FC = async () => {
    const [{ schedule: nextFiveGames }, { team }] = await Promise.all([
        serverClient.getSchedule({ take: 5, method: 'next' }),
        serverClient.getTeam({ name: 'Denver Nuggets' }),
    ])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Next 5 Games</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {nextFiveGames.map(game => (
                        <li key={game.id}>
                            <Link href={`/game/${game.id}`}>
                                <div className="p-1 flex flex-row h-fit">
                                    <div className="flex grow flex-col px-2">
                                        <span className="flex flex-row gap-2">
                                            <Image
                                                src={
                                                    game.home
                                                        ? team.logo_url
                                                        : game.opponent.logo_url
                                                }
                                                alt={
                                                    game.home
                                                        ? team.name
                                                        : game.opponent.name
                                                }
                                                width={25}
                                                height={25}
                                            />
                                            <p>
                                                {game.home
                                                    ? 'Denver Nuggets'
                                                    : game.opponent.name}
                                            </p>
                                        </span>
                                        <span className="flex flex-row gap-2">
                                            <Image
                                                src={
                                                    game.home
                                                        ? game.opponent.logo_url
                                                        : team.logo_url
                                                }
                                                alt={
                                                    game.home
                                                        ? game.opponent.name
                                                        : team.name
                                                }
                                                width={25}
                                                height={25}
                                            />
                                            <p>
                                                {game.home
                                                    ? game.opponent.name
                                                    : 'Denver Nuggets'}
                                            </p>
                                        </span>
                                    </div>
                                    <div className="flex flex-col px-1">
                                        <Separator
                                            orientation="vertical"
                                            className=""
                                        />
                                    </div>
                                    <p className="self-center text-center w-10 text-small">
                                        {dayjs(game.date).format('ddd M[/]D')}
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
