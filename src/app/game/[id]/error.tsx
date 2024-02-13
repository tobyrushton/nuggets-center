'use client'

import { FC } from 'react'

const GameError: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl p-2">
                Game not found
            </h1>
            <p className="text-neutral-400 text-center">
                The game you are looking for does not exist or is not available
            </p>
        </div>
    )
}

export default GameError
