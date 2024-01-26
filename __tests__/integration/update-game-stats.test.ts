import { describe, expect, it, beforeEach } from 'vitest'
import { updateGameStats } from '@/server/functions/update-game-stats'
import { updateSchedule } from '@/server/functions/update-schedule'
import { updatePlayers } from '@/server/functions/update-player'
import { updateTeams } from '@/server/functions/update-teams'
import { round } from '@/lib/round'
import prisma from '../helpers/prisma'

describe('updateGameStats', () => {
    beforeEach(async () => {
        // db dependencies
        await Promise.all([updateTeams(), updatePlayers()])
        await updateSchedule()
    })

    it('should add game stats when none are in db', async () => {
        await updateGameStats()

        const count = await prisma.playerGame.count()
        expect(count).toBeGreaterThan(0)
    })

    it('should add new game stats when some are in db', async () => {
        await updateGameStats()
        const firstCount = await prisma.playerGame.count()

        const half = round(firstCount / 2, 0)
        const games = await prisma.playerGame.findMany({ take: half })
        const ids = games.map(game => game.id)
        await prisma.playerGame.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        const secondCount = await prisma.playerGame.count()
        expect(secondCount).toBe(firstCount - half)

        await updateGameStats()

        const thirdCount = await prisma.playerGame.count()
        expect(thirdCount).toBe(firstCount)
    })

    it('should not add new game stats when all are in db', async () => {
        await updateGameStats()
        const firstCount = await prisma.playerGame.count()

        await updateGameStats()

        const secondCount = await prisma.playerGame.count()
        expect(secondCount).toBe(firstCount)
    })
})
