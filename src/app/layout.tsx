import type { Metadata } from 'next'
import { FC, ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { TRPCProvider } from '@/components/providers/TRPCProvider'
import { Navbar } from '@/components/Nav'
import './globals.css'

export const metadata: Metadata = {
    title: 'Nuggets Center',
    description: 'All obout the nuggets!',
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
                    {children}
                </TRPCProvider>
            </body>
        </html>
    )
}

export default RootLayout
