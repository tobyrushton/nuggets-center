import { NextResponse } from 'next/server'
import { updateTeams } from '@/server/functions/update-teams'
import { updateSchedule } from '@/server/functions/update-schedule'

// cron job to be ran weekly
export const GET = async (): Promise<NextResponse> => {
    try {
        await Promise.all([updateTeams(), updateSchedule()])
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, error })
    }
}
