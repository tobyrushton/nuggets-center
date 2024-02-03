import 'server-only'
import { ReactNode } from 'react'
import { NextGame } from '@/components/NextGame'
import { LastFiveGames } from '@/components/LastFiveGames'

const Home = (): ReactNode => {
    return (
        <main className="flex flex-row bg-black h-screen">
            <div className="flex flex-col w-1/2 p-2 gap-5">
                <NextGame />
                <LastFiveGames />
            </div>
            <div className="flex flex-col w-1/2 p-2" />
        </main>
    )
}

export default Home
