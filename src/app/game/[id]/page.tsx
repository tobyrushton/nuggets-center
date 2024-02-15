import 'server-only'
import { FC, Suspense } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    Table,
    TableHead,
    TableCaption,
    TableHeader,
    TableBody,
    TableRow,
} from '@/components/ui/table'
import { BoxScore, BoxScoreSkeleton } from '@/components/BoxScore'
import dayjs from 'dayjs'
import { Metadata } from 'next'

export interface GamePageProps {
    params: {
        id: string
    }
}

export const generateMetadata = async ({
    params: { id },
}: GamePageProps): Promise<Metadata> => {
    const { game } = await serverClient.getGame({ id })

    return {
        title:
            game.home_score !== -1 && game.opponent_score !== -1
                ? `Denver Nuggets ${game.home ? game.home_score : game.opponent_score} - ${game.home ? game.opponent_score : game.home_score} ${game.opponent.name}`
                : `${dayjs(game.date).format('MM/DD/YYYY')} vs ${game.opponent.name}`,
        description: `Nuggets box score vs ${game.opponent.name} on ${dayjs(game.date).format('MM/DD/YYYY')}.`,
    }
}

const GamePage: FC<GamePageProps> = async ({ params: { id } }) => {
    const [{ game }, { team }] = await Promise.all([
        serverClient.getGame({ id }),
        serverClient.getTeam({ name: 'Denver Nuggets' }),
    ])

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between pt-5 px-5 w-full max-w-xl self-center gap-2">
                <span className="flex flex-col items-center">
                    <Image
                        src={team.logo_url}
                        alt={team.name}
                        width={100}
                        height={100}
                    />
                    <h2 className="text-center">{team.name}</h2>
                </span>
                <span
                    className={cn('flex items-center text-3xl', {
                        'font-bold': game.home
                            ? game.home_score > game.opponent_score
                            : game.opponent_score > game.home_score,
                        hidden:
                            game.home_score === -1 ||
                            game.opponent_score === -1,
                    })}
                >
                    {game.home ? game.home_score : game.opponent_score}
                </span>
                <span className="flex items-center">
                    {game.home ? 'vs' : '@'}
                </span>
                <span
                    className={cn('flex items-center text-3xl', {
                        'font-bold': game.home
                            ? game.home_score < game.opponent_score
                            : game.opponent_score < game.home_score,
                        hidden:
                            game.home_score === -1 ||
                            game.opponent_score === -1,
                    })}
                >
                    {game.home ? game.opponent_score : game.home_score}
                </span>
                <Link
                    href={`/team/${game.opponent.id}`}
                    className="flex flex-col items-center"
                >
                    <Image
                        src={game.opponent.logo_url}
                        alt={game.opponent.name}
                        width={100}
                        height={100}
                    />
                    <h2 className="text-center">{game.opponent.name}</h2>
                </Link>
            </div>
            <Separator />
            {game.opponent_score === -1 || game.home_score === -1 ? (
                <p className="text-center text-4xl">
                    {dayjs(game.date).format('MM/DD/YYYY')}
                </p>
            ) : (
                <Table>
                    <TableCaption>
                        Box Score vs {game.opponent.name}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead>MIN</TableHead>
                            <TableHead>FG</TableHead>
                            <TableHead>3PT</TableHead>
                            <TableHead>FT</TableHead>
                            <TableHead>REB</TableHead>
                            <TableHead>AST</TableHead>
                            <TableHead>STL</TableHead>
                            <TableHead>BLK</TableHead>
                            <TableHead>TO</TableHead>
                            <TableHead>PF</TableHead>
                            <TableHead>PTS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <Suspense fallback={<BoxScoreSkeleton />}>
                            <BoxScore id={id} />
                        </Suspense>
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export default GamePage
