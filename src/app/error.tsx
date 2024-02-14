'use client'

import { FC } from 'react'

const Error: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl p-2">
                An error has occured
            </h1>
            <p className="text-neutral-400 text-center">Please try again.</p>
        </div>
    )
}

export default Error
