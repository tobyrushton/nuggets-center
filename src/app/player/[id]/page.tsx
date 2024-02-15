import 'server-only'
import { FC, Suspense } from 'react'
import { Separator } from '@/components/ui/separator'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayerGames } from '@/components/PlayerGames'
import {
    SeasonAverages,
    SkeletonSeasonAverages,
} from '@/components/SeasonAverages'
import Image from 'next/image'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import { Metadata } from 'next'
import { serverClient } from '../../_trpc/serverClient'

export interface PlayerPageProps {
    params: {
        id: string
    }
}

export const generateMetadata = async ({
    params: { id },
}: PlayerPageProps): Promise<Metadata> => {
    const player = await serverClient.getPlayer({ id })

    return {
        title: `${player.first_name} ${player.last_name}`,
        description: `Player stats for ${player.first_name} ${player.last_name}.`,
    }
}

const PlayerPage: FC<PlayerPageProps> = async ({ params: { id } }) => {
    const player = await serverClient.getPlayer({ id })

    return (
        <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex fex-row gap-2 px-2 min-w-fit">
                    <Image
                        src={player.profile_url}
                        alt={`${player.first_name} ${player.last_name}`}
                        width={200}
                        height={200}
                    />
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-xl">
                            {player.first_name} {player.last_name}
                        </h2>
                        <ul className="list-disc pl-3">
                            <li>{player.position}</li>
                            <li>
                                {player.height_feet}&apos;
                                {player.height_inches}&quot;
                            </li>
                            <li>{player.weight} lbs</li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col px-5 hidden sm:block">
                    <Separator orientation="vertical" />
                </div>
                <Separator className="block md:hidden" />
                <Card className="w-full max-w-lg self-center">
                    <CardHeader>
                        <CardTitle className="text-center">
                            {getCurrentSeason()} Season Stats
                        </CardTitle>
                        <Separator />
                    </CardHeader>
                    <Suspense fallback={<SkeletonSeasonAverages />}>
                        <SeasonAverages id={id} />
                    </Suspense>
                </Card>
            </div>
            <Separator />
            <PlayerGames id={id} />
        </div>
    )
}

export default PlayerPage
