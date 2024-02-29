import { NextResponse } from 'next/server'
import { updateGameStats } from '@/server/functions/update-game-stats'
import { updatePlayers } from '@/server/functions/update-player'
import { updateSeasonAverages } from '@/server/functions/update-season-averages'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

// cron job to be ran daily
export const GET = async (): Promise<NextResponse> => {
    try {
        await Promise.all([
            updateGameStats(),
            updatePlayers(),
            updateSeasonAverages(),
        ])
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, error })
    }
}
