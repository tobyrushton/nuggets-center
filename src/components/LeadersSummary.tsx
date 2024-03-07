import 'server-only'
import { FC, Suspense } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { Skeleton } from './ui/skeleton'

type LeaderType = 'pts' | 'reb' | 'ast' | 'stl' | 'blk' | 'fg_pct'

interface LeaderProps {
    leader: LeaderType
}

const LeaderSkeleton: FC<LeaderProps> = ({ leader }) => {
    return (
        <span className="flex flex-col gap-1">
            <h3>{leader.toUpperCase().replace('_', ' ')}</h3>
            <div className="flex flex-row gap-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <span className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-8" />
                </span>
            </div>
            <Separator />
        </span>
    )
}

const Leader: FC<LeaderProps> = async ({ leader }) => {
    const { leaders } = await serverClient.getLeaders({
        category: leader,
        take: 1,
    })
    const player = leaders[0]

    return (
        <span className="flex flex-col gap-1">
            <h3>{leader.toUpperCase().replace('_', ' ')}</h3>
            <Link
                href={`/player/${player.player_id}`}
                className="flex flex-row gap-2"
            >
                <Image
                    src={player.profile_url}
                    alt={`${player.player_name} headshot`}
                    width={64}
                    height={48}
                />
                <span>
                    <p>{player.player_name}</p>
                    <p>{player.value}</p>
                </span>
            </Link>
            <Separator />
        </span>
    )
}

export const LeadersSummary: FC = () => {
    const offense: LeaderType[] = ['pts', 'ast', 'fg_pct']
    const defense: LeaderType[] = ['reb', 'stl', 'blk']

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Link href="/leaders">Leaders</Link>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="offense">
                    <TabsList className="w-full">
                        <TabsTrigger className="w-1/2" value="offense">
                            Offense
                        </TabsTrigger>
                        <TabsTrigger className="w-1/2" value="defense">
                            Defense
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="offense">
                        {offense.map(leader => (
                            <Suspense
                                key={leader}
                                fallback={<LeaderSkeleton leader={leader} />}
                            >
                                <Leader leader={leader} />
                            </Suspense>
                        ))}
                    </TabsContent>
                    <TabsContent value="defense">
                        {defense.map(leader => (
                            <Suspense
                                key={leader}
                                fallback={<LeaderSkeleton leader={leader} />}
                            >
                                <Leader leader={leader} />
                            </Suspense>
                        ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
