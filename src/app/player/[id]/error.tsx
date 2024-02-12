'use client'

import { FC } from 'react'

const Error: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl text-white p-2">
                Player not found
            </h1>
            <p className="text-neutral-400 text-center">
                The player you are looking for does not exist or is not
                available
            </p>
        </div>
    )
}

export default Error
