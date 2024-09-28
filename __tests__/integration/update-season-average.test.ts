import { describe, expect, it, beforeEach } from 'vitest'
import { updatePlayers } from '@/server/functions/update-player'
import { updateSeasonAverages } from '@/server/functions/update-season-averages'
import { round } from '@/lib/round'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import prisma from '../helpers/prisma'

describe('updateSeasonAverages', () => {
    beforeEach(async () => {
        // this makes this test reliant on updatePlayers
        // however due to database foreign key constraints it is necessary
        await updatePlayers()
    })

    it('should update season averages when none are in db', async () => {
        // if season hasn't started yet, this will be 0
        // so skip test
        if (getCurrentSeason() > new Date().getFullYear() && new Date().getMonth() < 11) return
        
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

        firstAverages.forEach(average => {
            const secondAverage = secondAverages.find(
                avg => avg.id === average.id
            )
            if (!secondAverage) throw new Error('secondAverage not found')
            expect(average.games_played).toBe(secondAverage.games_played)
            expect(average.pts).toBe(secondAverage.pts)
            expect(average.ast).toBe(secondAverage.ast)
            expect(average.reb).toBe(secondAverage.reb)
            expect(average.stl).toBe(secondAverage.stl)
            expect(average.blk).toBe(secondAverage.blk)
            expect(average.fg_pct).toBe(secondAverage.fg_pct)
            expect(average.fg3_pct).toBe(secondAverage.fg3_pct)
            expect(average.ft_pct).toBe(secondAverage.ft_pct)
            expect(average.fga).toBe(secondAverage.fga)
            expect(average.fgm).toBe(secondAverage.fgm)
            expect(average.fg3a).toBe(secondAverage.fg3a)
            expect(average.fg3m).toBe(secondAverage.fg3m)
            expect(average.fta).toBe(secondAverage.fta)
            expect(average.ftm).toBe(secondAverage.ftm)
            expect(average.turnover).toBe(secondAverage.turnover)
            expect(average.pf).toBe(secondAverage.pf)
            expect(average.min).toBe(secondAverage.min)
        })
    })
})
