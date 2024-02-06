import 'server-only'
import { ReactNode } from 'react'
import { NextGame } from '@/components/NextGame'
import { LastFiveGames } from '@/components/LastFiveGames'
import { NextFiveGames } from '@/components/NextFiveGames'
import { Record } from '@/components/Record'
import { LeadersSummary } from '@/components/LeadersSummary'

const Home = (): ReactNode => {
    return (
        <main className="flex flex-col bg-black h-screen overflow-y-scroll sm:flex-row">
            <div className="flex flex-col w-full sm:w-1/2 p-2 gap-5">
                <NextGame />
                <Record />
                <LastFiveGames />
            </div>
            <div className="flex flex-col w-full sm:w-1/2 p-2 gap-5">
                <NextFiveGames />
                <LeadersSummary />
            </div>
        </main>
    )
}

export default Home
