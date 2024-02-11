'use client'

import { FC } from 'react'

const TeamError: FC = () => {
    return (
        <main className="absolute h-full w-full bg-black text-white overflow-y-scroll">
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl text-white p-2">
                    Team not found
                </h1>
                <p className="text-neutral-400 text-center">
                    The team you are looking for does not exist.
                </p>
            </div>
        </main>
    )
}

export default TeamError
