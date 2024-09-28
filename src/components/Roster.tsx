import 'server-only'
import { FC, Suspense } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { serverClient } from '@/app/_trpc/serverClient'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

type RosterItemProps = {
    player: {
        id: string
        first_name: string
        last_name: string
        position: string
        profile_url: string
    }
}

const RosterItemSkeleton: FC = () => {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="h-10 w-10 rounded-full" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-5 w-40" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-5 w-10" />
            </TableCell>
            <TableCell className="hidden xs:table-cell">
                <Skeleton className="h-5 w-10" />
            </TableCell>
            <TableCell className="hidden xs:table-cell">
                <Skeleton className="h-5 w-10" />
            </TableCell>
            <TableCell className="hidden xs:table-cell">
                <Skeleton className="h-5 w-10" />
            </TableCell>
        </TableRow>
    )
}

const RosterItem: FC<RosterItemProps> = async ({ player }) => {
    let average: player.ISeasonAverage | undefined | null

    try {
        average = (await serverClient.getSeasonAverage({ id: player.id }))
            .seasonAverage
    } catch {
        // ignore
    }

    return (
        <TableRow>
            <TableCell>
                <Link href={`/player/${player.id}`}>
                    <Avatar>
                        <AvatarFallback>
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </AvatarFallback>
                        <AvatarImage
                            src={player.profile_url}
                            alt={`${player.first_name} ${player.last_name} headshot`}
                        />
                    </Avatar>
                </Link>
            </TableCell>
            <TableCell>
                <Link href={`/player/${player.id}`}>
                    {player.first_name} {player.last_name}
                </Link>
            </TableCell>
            <TableCell>{player.position}</TableCell>
            <TableCell className="hidden xs:table-cell">
                {average?.pts ?? 'N/A'}
            </TableCell>
            <TableCell className="hidden xs:table-cell">
                {average?.reb ?? 'N/A'}
            </TableCell>
            <TableCell className="hidden xs:table-cell">
                {average?.ast ?? 'N/A'}
            </TableCell>
        </TableRow>
    )
}

export const RosterSkeleton: FC = () => {
    return (
        <Table>
            <TableCaption>Denver Nuggets Roster</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead />
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="hidden xs:table-cell">PPG</TableHead>
                    <TableHead className="hidden xs:table-cell">RPG</TableHead>
                    <TableHead className="hidden xs:table-cell">APG</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {new Array(15).fill(null).map((_, i) => (
                    <RosterItemSkeleton
                        key={`roster-skeleton-${i.toString()}`}
                    />
                ))}
            </TableBody>
        </Table>
    )
}

export const Roster: FC = async () => {
    const { roster } = await serverClient.getRoster()

    return (
        <Table>
            <TableCaption>Denver Nuggets Roster</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead />
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="hidden xs:table-cell">PPG</TableHead>
                    <TableHead className="hidden xs:table-cell">RPG</TableHead>
                    <TableHead className="hidden xs:table-cell">APG</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {roster.map(player => (
                    <Suspense key={player.id} fallback={<RosterItemSkeleton />}>
                        <RosterItem player={player} />
                    </Suspense>
                ))}
            </TableBody>
        </Table>
    )
}
