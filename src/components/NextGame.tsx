import 'server-only'

import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from './ui/skeleton'
import { NextGameTime } from './NextGameTime'

export const NextGameSkeleton: FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-8 w-36" />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row">
                <div className="flex grow justify-center">
                    <div className="flex flex-col gap-5">
                        <Skeleton className="w-24 h-24 rounded-full self-center" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                </div>
                <div className="flex flex-wrap content-center">
                    <Skeleton className="w-8 h-5" />
                </div>
                <div className="flex grow justify-center">
                    <div className="flex flex-col gap-5">
                        <Skeleton className="w-24 h-24 rounded-full self-center" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export const NextGame: FC = async () => {
    const [{ schedule: nextGame }, { team }] = await Promise.all([
        serverClient.getSchedule({ take: 1, method: 'next' }),
        serverClient.getTeam({ name: 'Denver Nuggets' }),
    ])

    return (
        <Card className="h-min">
            <CardHeader>
                <CardTitle>
                    {nextGame.length > 0 ? (
                        <NextGameTime
                            nextGameTime={nextGame[0].date.toISOString()}
                        />
                    ) : (
                        'No upcoming games'
                    )}
                </CardTitle>
            </CardHeader>
            {nextGame.length > 0 && (
                <CardContent className="flex flex-row">
                    <div className="flex grow justify-center">
                        <Link
                            className="flex flex-col gap-5"
                            href={`/team/${team.id}`}
                        >
                            <Image
                                src={team.logo_url}
                                alt={`${team.name} logo`}
                                width={100}
                                height={100}
                                className="self-center"
                            />
                            {team.name}
                        </Link>
                    </div>
                    <p className="flex flex-wrap content-center">
                        {nextGame[0].home ? 'vs' : '@'}
                    </p>
                    <div className="flex grow justify-center">
                        <Link
                            className="flex flex-col gap-5"
                            href={`/team/${nextGame[0].opponent.id}`}
                        >
                            <Image
                                src={nextGame[0].opponent.logo_url}
                                alt={`${nextGame[0].opponent.name} logo`}
                                width={100}
                                height={100}
                                className="self-center"
                            />
                            {nextGame[0].opponent.name}
                        </Link>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
