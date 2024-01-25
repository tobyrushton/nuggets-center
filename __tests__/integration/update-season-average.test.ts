import { describe, expect, it, beforeEach } from 'vitest'
import { updatePlayers } from '@/server/functions/update-player'
import { updateSeasonAverages } from '@/server/functions/update-season-averages'
import { round } from '@/lib/round'
import prisma from '../helpers/prisma'

describe('updateSeasonAverages', () => {
    beforeEach(async () => {
        // this makes this test reliant on updatePlayers
        // however due to database foreign key constraints it is necessary
        await updatePlayers()
    })

    it('should update season averages when none are in db', async () => {
        const playerCount = await prisma.player.count()
        await updateSeasonAverages()

        const count = await prisma.seasonAverages.count()
        // the reason for this is injured players will not have season averages
        expect(count).toBeLessThanOrEqual(playerCount)
        // incredibly unlikely that there will be less than 13 players with season averages
        expect(count).toBeGreaterThanOrEqual(13)
    })

    it('should update season averages when some are in db', async () => {
        await updateSeasonAverages()
        const firstCount = await prisma.seasonAverages.count()

        const half = round(firstCount / 2, 0)
        const averages = await prisma.seasonAverages.findMany({ take: half })

        await prisma.seasonAverages.deleteMany({
            where: {
                id: {
                    in: averages.map(average => average.id),
                },
            },
        })

        const secondCount = await prisma.seasonAverages.count()

        expect(secondCount).toBe(firstCount - half)

        await updateSeasonAverages()

        const thirdCount = await prisma.seasonAverages.count()
        expect(thirdCount).toBe(firstCount)
    })

    it('should update season averages when they have changed', async () => {
        await updateSeasonAverages()

        const firstAverages = await prisma.seasonAverages.findMany()
        const firstCount = firstAverages.length

        await Promise.all(
            firstAverages.map(async average => {
                await prisma.seasonAverages.update({
                    where: { id: average.id },
                    data: {
                        games_played: 100, // an impossible amount of games to have played
                    },
                })
            })
        )

        await updateSeasonAverages()
        const secondAverages = await prisma.seasonAverages.findMany()
        const secondCount = secondAverages.length

        expect(secondCount).toBe(firstCount)

        firstAverages.forEach((average, index) => {
            expect(average.games_played).toBe(
                secondAverages[index].games_played
            )
            expect(average.pts).toBe(secondAverages[index].pts)
            expect(average.ast).toBe(secondAverages[index].ast)
            expect(average.reb).toBe(secondAverages[index].reb)
            expect(average.stl).toBe(secondAverages[index].stl)
            expect(average.blk).toBe(secondAverages[index].blk)
            expect(average.fg_pct).toBe(secondAverages[index].fg_pct)
            expect(average.fg3_pct).toBe(secondAverages[index].fg3_pct)
            expect(average.ft_pct).toBe(secondAverages[index].ft_pct)
            expect(average.fga).toBe(secondAverages[index].fga)
            expect(average.fgm).toBe(secondAverages[index].fgm)
            expect(average.fg3a).toBe(secondAverages[index].fg3a)
            expect(average.fg3m).toBe(secondAverages[index].fg3m)
            expect(average.fta).toBe(secondAverages[index].fta)
            expect(average.ftm).toBe(secondAverages[index].ftm)
            expect(average.turnover).toBe(secondAverages[index].turnover)
            expect(average.pf).toBe(secondAverages[index].pf)
            expect(average.min).toBe(secondAverages[index].min)
        })
    })
})
