import 'server-only'
import { FC } from 'react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableCaption,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
} from '@/components/ui/table'
import { BoxScoreSkeleton } from '@/components/BoxScore'

const GameLoading: FC = () => {
    return (
        <main className="absolute w-screen bg-black h-screen overflow-y-scroll text-white">
            <div className="flex flex-col gap-5">
                <div className="flex flex-row justify-between pt-5 px-5 w-full max-w-xl self-center gap-2">
                    <span className="flex flex-col items-center gap-2">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                    </span>
                    <span className="flex items-center">
                        <Skeleton className="h-6 w-8" />
                    </span>
                    <span className="flex flex-col items-center gap-2">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                    </span>
                </div>
                <Separator />
                <Table>
                    <TableCaption>Box Score</TableCaption>
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
                        <BoxScoreSkeleton />
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}

export default GameLoading
