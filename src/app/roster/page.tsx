import 'server-only'
import { FC, Suspense } from 'react'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import { Roster, RosterSkeleton } from '@/components/Roster'
import { Metadata } from 'next'

export const generateMetadata = (): Metadata => {
    const currentSeason = getCurrentSeason()
    return {
        title: `Denver Nuggets Roster ${currentSeason - 1}-${currentSeason}`,
        description: `Denver Nuggets Roster for the ${currentSeason} season.`,
    }
}

export const revalidate = 60 * 60 * 12 // every 12 hour

const RosterPage: FC = () => {
    return (
        <div className="flex flex-col p-5 items-center">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl p-2">
                Denver Nuggets Roster {getCurrentSeason()}
            </h1>
            <div className="sm:w-3/5">
                <Suspense fallback={<RosterSkeleton />}>
                    <Roster />
                </Suspense>
            </div>
        </div>
    )
}

export default RosterPage
