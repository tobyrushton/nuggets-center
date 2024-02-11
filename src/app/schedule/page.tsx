import 'server-only'
import { FC } from 'react'
import { Schedule } from '@/components/Schedule'

const SchedulePage: FC = () => {
    return (
        <main className="flex flex-col bg-black h-screen overflow-y-scroll">
            <div className="flex flex-col items-center">
                <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl text-white p-2">
                    Denver Nuggets Schedule
                </h1>
                <div className="sm:w-3/5">
                    <Schedule caption="Denver Nuggets Schedule" />
                </div>
            </div>
        </main>
    )
}

export default SchedulePage
