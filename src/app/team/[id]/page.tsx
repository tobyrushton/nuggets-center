import 'server-only'
import { FC } from 'react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { serverClient } from '@/app/_trpc/serverClient'
import { Schedule } from '@/components/Schedule'
import { Metadata } from 'next'

export interface TeamPageProps {
    params: {
        id: string
    }
}

export const generateMetadata = async ({
    params: { id },
}: TeamPageProps): Promise<Metadata> => {
    const { team } = await serverClient.getTeam({ id })

    return {
        title: `${team.name}`,
        description: `Nuggets game history vs ${team.name}.`,
    }
}

const TeamPage: FC<TeamPageProps> = async ({ params: { id } }) => {
    const { team } = await serverClient.getTeam({ id })

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 p-3 items-center justify-center sm:justify-start">
                <Image
                    src={team.logo_url}
                    alt={team.name}
                    width={100}
                    height={100}
                />
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl p-2">
                    {team.name}
                </h1>
            </div>
            <Separator />
            <Schedule caption={`Games vs ${team.name}`} opponentId={id} />
        </div>
    )
}

export default TeamPage
