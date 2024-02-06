import 'server-only'
import { ReactNode } from 'react'
import { NextGame } from '@/components/NextGame'
import { LastFiveGames } from '@/components/LastFiveGames'
import { NextFiveGames } from '@/components/NextFiveGames'
import { Record } from '@/components/Record'

const Home = (): ReactNode => {
    return (
        <main className="flex flex-row bg-black h-screen overflow-y-scroll">
            <div className="flex flex-col w-1/2 p-2 gap-5">
                <NextGame />
                <LastFiveGames />
            </div>
            <div className="flex flex-col w-1/2 p-2 gap-5">
                <Record />
                <NextFiveGames />
            </div>
        </main>
    )
}

export default Home
