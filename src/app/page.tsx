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
        <main className="flex flex-col bg-black h-screen overflow-y-scroll sm:flex-row">
            <div className="flex flex-col w-full sm:w-1/2 p-2 gap-5">
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
            <div className="flex flex-col w-full sm:w-1/2 p-2 gap-5">
                <Suspense fallback={<NextFiveGamesSkeleton />}>
                    <NextFiveGames />
                </Suspense>
                <LeadersSummary />
            </div>
        </main>
    )
}

export default Home
