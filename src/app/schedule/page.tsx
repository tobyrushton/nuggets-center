import 'server-only'
import { FC } from 'react'
import { Schedule } from '@/components/Schedule'
import { Metadata } from 'next'
import { getCurrentSeason } from '@/lib/getCurrentSeason'

export const generateMetadata = (): Metadata => {
    const currentSeason = getCurrentSeason()
    return {
        title: `Denver Nuggets ${currentSeason - 1}-${currentSeason} Schedule`,
        description: `Denver Nuggets Schedule for the ${currentSeason} season.`,
    }
}

export const revalidate = 60 * 60 * 12 // every 12 hour

const SchedulePage: FC = () => {
    return (
        <div className="flex flex-col items-center">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl p-2">
                Denver Nuggets Schedule
            </h1>
            <div className="sm:w-3/5">
                <Schedule caption="Denver Nuggets Schedule" />
            </div>
        </div>
    )
}

export default SchedulePage
