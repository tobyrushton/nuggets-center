import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { FC, ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { Navbar } from '@/components/Nav'
import './globals.css'

export const metadata: Metadata = {
    title: 'Nuggets Center',
    description: 'All about the Denver Nuggets!',
    metadataBase: new URL('https://nuggetscenter.xyz'),
    openGraph: {
        images: [
            {
                url: './nuggets_logo.png',
                width: 1200,
                height: 630,
                alt: 'Nuggets Logo',
            },
        ],
    },
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
                <Analytics />
                <SpeedInsights />
                <Navbar />
                <main className="absolute w-full h-[calc(100%-4rem)] bg-white dark:bg-black overflow-y-auto text-black dark:text-white">
                    {children}
                </main>
            </body>
        </html>
    )
}

export default RootLayout
