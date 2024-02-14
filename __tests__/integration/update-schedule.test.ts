import { describe, expect, it, beforeEach } from 'vitest'
import { updateTeams } from '@/server/functions/update-teams'
import { updateSchedule } from '@/server/functions/update-schedule'
import { round } from '@/lib/round'
import prisma from '../helpers/prisma'

describe('updateSchedule', () => {
    beforeEach(async () => {
        // this makes this test reliant on updateTeams
        // however due to database foreign key constraints it is necessary
        await updateTeams()
    })

    it('should update schedule when none are in db', async () => {
        await updateSchedule()

        const count = await prisma.game.count()
        // due to in season tournament, games will start at 80 and more added
        expect(count).toBeGreaterThanOrEqual(80)
        expect(count).toBeLessThanOrEqual(82)
    })

    it('should update schedule when some are in db', async () => {
        await updateSchedule()
        const firstCount = await prisma.game.count()
        expect(firstCount).toBeLessThanOrEqual(82)

        const half = round(firstCount / 2, 0)
        const games = await prisma.game.findMany({ take: half })
        await prisma.game.deleteMany({
            where: {
                id: {
                    in: games.map(game => game.id),
                },
            },
        })

        const secondCount = await prisma.game.count()
        expect(secondCount).toBe(firstCount - half)

        await updateSchedule()

        const thirdCount = await prisma.game.count()

        expect(thirdCount).toBe(firstCount)
        expect(thirdCount).toBeLessThanOrEqual(82)
    })

    it('should update scores of games in db', async () => {
        await updateSchedule()

        const firstGames = await prisma.game.findMany()
        const firstCount = firstGames.length

        expect(firstCount).toBeLessThanOrEqual(82)

        const gamesWithScores = firstGames.filter(
            game => game.home_score !== -1 && game.opponent_score !== -1
        )

        // it's possible that no games have been played yet
        if (gamesWithScores.length > 0) {
            await prisma.game.updateMany({
                where: {
                    id: {
                        in: gamesWithScores.map(game => game.id),
                    },
                },
                data: {
                    home_score: -1,
                    opponent_score: -1,
                },
            })

            const secondGames = await prisma.game.findMany()
            const secondCount = secondGames.length

            expect(secondCount).toBe(firstCount)
            secondGames.forEach(game => {
                expect(game.home_score).toBe(-1)
                expect(game.opponent_score).toBe(-1)
            })

            await updateSchedule()
            const thirdGames = await prisma.game.findMany()
            const thirdCount = thirdGames.length

            expect(thirdCount).toBe(firstCount)
            expect(thirdCount).toBeLessThanOrEqual(82)

            gamesWithScores.forEach(game => {
                const updatedGame = thirdGames.find(g => g.id === game.id)
                expect(updatedGame?.home_score).toBe(game.home_score)
                expect(updatedGame?.opponent_score).toBe(game.opponent_score)
            })
        }
    })

    it('should not update schedule when there are no changes', async () => {
        await updateSchedule()

        const firstCount = await prisma.game.count()
        expect(firstCount).toBeLessThanOrEqual(82)

        await updateSchedule()

        const secondCount = await prisma.game.count()
        expect(secondCount).toBe(firstCount)
    })
})
