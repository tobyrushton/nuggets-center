import { describe, it, expect, beforeEach } from 'vitest'
import { GET } from '@/app/api/cron/daily-db-scrape/route'
import { updateSchedule } from '@/server/functions/update-schedule'
import { updatePlayers } from '@/server/functions/update-player'
import prisma from '../../helpers/prisma'
import { updateTeams } from '@/server/functions/update-teams'

describe('GET /api/cron/daily-db-scrape', () => {
  beforeEach(async () => {
    await updateTeams()
    await Promise.all([
      updatePlayers(),
      updateSchedule(),
    ])
  })

  it('should return 200', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
  })

  it('should take less than 10 seconds', async () => {
    const start = Date.now()
    await GET()
    const end = Date.now()
    expect(end - start).toBeLessThan(10000)

    // validate function worked
    const count = await prisma.player.count()
    expect(count).toBeGreaterThan(12)
    expect(count).toBeLessThanOrEqual(18)

    const count2 = await prisma.playerGame.count()
    expect(count2).toBeGreaterThan(12)

    const count3 = await prisma.seasonAverages.count()
    expect(count3).toBeGreaterThan(12)
    expect(count3).toBeLessThanOrEqual(18)
  })
})