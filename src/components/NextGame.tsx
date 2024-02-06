import 'server-only'

import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

export const NextGame: FC = async () => {
    const [{ schedule: nextGame }, { team }] = await Promise.all([
        serverClient.getSchedule({ take: 1, method: 'next' }),
        serverClient.getTeam({ name: 'Denver Nuggets' }),
    ])

    return (
        <Card className="h-min">
            <CardHeader>
                <CardTitle>
                    {dayjs(nextGame[0].date).format('dddd MMM D [at] h A')}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row">
                <div className="flex grow justify-center">
                    <Link
                        className="flex flex-col gap-5"
                        href={`/team/${team.id}`}
                    >
                        <Image
                            src={team.logo_url}
                            alt={team.name}
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
                            alt={nextGame[0].opponent.name}
                            width={100}
                            height={100}
                            className="self-center"
                        />
                        {nextGame[0].opponent.name}
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
