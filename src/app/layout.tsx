import type { Metadata, Viewport } from 'next'
import { FC, ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { TRPCProvider } from '@/components/providers/TRPCProvider'
import { Navbar } from '@/components/Nav'
import './globals.css'

export const metadata: Metadata = {
    title: 'Nuggets Center',
    description: 'All about the Denver Nuggets!',
    metadataBase: new URL(process.env.VERCEL_URL),
}

export const viewport: Viewport = {
    themeColor: '#418fde',
}

interface RootLayoutProps {
    children: ReactNode
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="en">
            <body className={GeistSans.className}>
                <TRPCProvider>
                    <Navbar />
                    <main className="absolute w-full h-[calc(100%-4rem)] bg-white dark:bg-black overflow-y-auto text-black dark:text-white">
                        {children}
                    </main>
                </TRPCProvider>
            </body>
        </html>
    )
}

export default RootLayout
