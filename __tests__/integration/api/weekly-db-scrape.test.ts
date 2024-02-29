import { describe, it, expect, beforeEach } from 'vitest'
import { GET } from '@/app/api/cron/weekly-db-scrape/route'
import { updateTeams } from '@/server/functions/update-teams'
import prisma from '../../helpers/prisma'

describe('GET /api/cron/weekly-db-scrape', () => {
    beforeEach(async () => {
        await updateTeams()
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
        const count = await prisma.team.count()
        expect(count).toBe(30)
        const count2 = await prisma.game.count()
        expect(count2).toBeGreaterThan(80)
    })
})
