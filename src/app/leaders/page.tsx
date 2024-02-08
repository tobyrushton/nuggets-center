import 'server-only'

import { FC, Suspense } from 'react'
import {
    LeaderCard,
    LeadersSkeleton,
    categories,
} from '@/components/LeaderCard'

const LeadersPage: FC = () => {
    return (
        <main className="absolute w-full h-full bg-black overflow-y-auto">
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
        </main>
    )
}

export default LeadersPage
