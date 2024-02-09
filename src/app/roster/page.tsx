import 'server-only'
import { FC, Suspense } from 'react'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import { Roster, RosterSkeleton } from '@/components/Roster'

const RosterPage: FC = () => {
    return (
        <main className="absolute h-full w-full bg-black text-white overflow-y-scroll">
            <div className="flex flex-col p-5 items-center">
                <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl text-white p-2">
                    Denver Nuggets Roster {getCurrentSeason()}
                </h1>
                <Suspense fallback={<RosterSkeleton />}>
                    <Roster />
                </Suspense>
            </div>
        </main>
    )
}

export default RosterPage
