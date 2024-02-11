import 'server-only'
import { ReactNode, Suspense } from 'react'
import { NextGame, NextGameSkeleton } from '@/components/NextGame'
import {
    LastFiveGames,
    LastFiveGamesSkeleton,
} from '@/components/LastFiveGames'
import {
    NextFiveGames,
    NextFiveGamesSkeleton,
} from '@/components/NextFiveGames'
import { Record, RecordSkeleton } from '@/components/Record'
import { LeadersSummary } from '@/components/LeadersSummary'

const Home = (): ReactNode => {
    return (
        <main className="absolute bg-black h-full w-full overflow-y-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col w-full p-2 gap-5 justify-between">
                    <Suspense fallback={<NextGameSkeleton />}>
                        <NextGame />
                    </Suspense>
                    <Suspense fallback={<RecordSkeleton />}>
                        <Record />
                    </Suspense>
                    <Suspense fallback={<LastFiveGamesSkeleton />}>
                        <LastFiveGames />
                    </Suspense>
                </div>
                <div className="flex flex-col w-full p-2 gap-5 justify-between">
                    <Suspense fallback={<NextFiveGamesSkeleton />}>
                        <NextFiveGames />
                    </Suspense>
                    <LeadersSummary />
                </div>
            </div>
        </main>
    )
}

export default Home
