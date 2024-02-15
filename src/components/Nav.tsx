'use client'

import { FC } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Logo from '../../public/nuggets_logo.png'

export const Navbar: FC = () => {
    const pathname = usePathname()

    return (
        <div className="bg-powder-blue w-screen h-16 shadow-xl flex flex-row py-2 px-5 gap-5 items-center">
            <Link href="/">
                <Image src={Logo} alt="nuggets logo" width={85} height={60} />
            </Link>
            <Link
                href="/"
                className={cn('text-l hover:text-white text-slate-300', {
                    'text-white': pathname === '/',
                })}
            >
                Home
            </Link>
            <Link
                href="/schedule"
                className={cn('text-l hover:text-white text-slate-300', {
                    'text-white': pathname === '/schedule',
                })}
            >
                Schedule
            </Link>
            <Link
                href="/roster"
                className={cn('text-l hover:text-white text-slate-300', {
                    'text-white': pathname === '/roster',
                })}
            >
                Roster
            </Link>
            <Link
                href="/leaders"
                className={cn('text-l hover:text-white text-slate-300', {
                    'text-white': pathname === '/leaders',
                })}
            >
                Leaders
            </Link>
        </div>
    )
}
