import 'server-only'

import { FC, Suspense } from 'react'
import {
    LeaderCard,
    LeadersSkeleton,
    categories,
} from '@/components/LeaderCard'
import { Metadata } from 'next'
import { getCurrentSeason } from '@/lib/getCurrentSeason'

export const generateMetadata = (): Metadata => {
    const currentSeason = getCurrentSeason()
    return {
        title: `Nuggets Leaders ${currentSeason - 1}-${currentSeason}`,
        description: `Nuggets Leaders for the ${currentSeason} season.`,
    }
}

// has to be dynamic else prerender error
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const LeadersPage: FC = () => {
    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 p-5">
            {categories.map(category => (
                <Suspense
                    key={category.abbr}
                    fallback={<LeadersSkeleton category={category} />}
                >
                    <LeaderCard category={category} />
                </Suspense>
            ))}
        </div>
    )
}

export default LeadersPage
