import 'server-only'
import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { Separator } from './ui/separator'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

export const NextFiveGames: FC = async () => {
    const { schedule: nextFiveGames } = await serverClient.getSchedule({
        take: 5,
        method: 'next',
    })
    const { team } = await serverClient.getTeam({ name: 'Denver Nuggets' })

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
