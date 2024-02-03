import 'server-only'
import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Separator } from './ui/separator'

export const LastFiveGames: FC = async () => {
    const { schedule: lastFiveGames } = await serverClient.getSchedule({
        take: 5,
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Last 5 Games</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {lastFiveGames.map(game => (
                        <>
                            <li
                                key={game.id}
                                className="p-1 flex flex-row h-fit"
                            >
                                <div className="flex grow flex-col">
                                    <span className="flex flex-row justify-between">
                                        <p>
                                            {game.home
                                                ? 'Denver Nuggets'
                                                : game.opponent.name}
                                        </p>
                                        <p>
                                            {game.home
                                                ? game.home_score
                                                : game.opponent_score}
                                        </p>
                                    </span>
                                    <span className="flex flex-row justify-between">
                                        <p>
                                            {game.home
                                                ? game.opponent.name
                                                : 'Denver Nuggets'}
                                        </p>
                                        <p>
                                            {game.home
                                                ? game.opponent_score
                                                : game.home_score}
                                        </p>
                                    </span>
                                </div>
                                <div className="flex flex-col px-1">
                                    <Separator
                                        orientation="vertical"
                                        className=""
                                    />
                                </div>
                                <p className="self-center px-3">
                                    {game.home_score > game.opponent_score
                                        ? 'W'
                                        : 'L'}
                                </p>
                            </li>
                            <Separator />
                        </>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
