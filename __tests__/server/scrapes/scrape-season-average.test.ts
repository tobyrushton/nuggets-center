import { describe, it, expect } from 'vitest'
import { scrapeSeasonAverages } from '@/server/scrapes/scrape-season-averages'

describe('scrapeSeasonAverages', () => {
    it('should return an array of season averages with correct attributes', async () => {
        const seasonAverages = await scrapeSeasonAverages()

        expect(seasonAverages).toBeInstanceOf(Array)
        // expect(seasonAverages.length).toBeGreaterThan(0)

        seasonAverages.forEach(seasonAverage => {
            expect(typeof seasonAverage.player_name).toBe('string')
            expect(typeof seasonAverage.games_played).toBe('number')
            expect(typeof seasonAverage.min).toBe('number')
            expect(typeof seasonAverage.pts).toBe('number')
            expect(typeof seasonAverage.oreb).toBe('number')
            expect(typeof seasonAverage.dreb).toBe('number')
            expect(typeof seasonAverage.reb).toBe('number')
            expect(typeof seasonAverage.ast).toBe('number')
            expect(typeof seasonAverage.stl).toBe('number')
            expect(typeof seasonAverage.blk).toBe('number')
            expect(typeof seasonAverage.turnover).toBe('number')
            expect(typeof seasonAverage.pf).toBe('number')
            expect(typeof seasonAverage.fgm).toBe('number')
            expect(typeof seasonAverage.fga).toBe('number')
            expect(typeof seasonAverage.fg_pct).toBe('number')
            expect(typeof seasonAverage.fg3m).toBe('number')
            expect(typeof seasonAverage.fg3a).toBe('number')
            expect(typeof seasonAverage.fg3_pct).toBe('number')
            expect(typeof seasonAverage.ftm).toBe('number')
            expect(typeof seasonAverage.fta).toBe('number')
            expect(typeof seasonAverage.ft_pct).toBe('number')

            // validate
            expect(seasonAverage.fga).toBeGreaterThanOrEqual(seasonAverage.fgm)
            expect(seasonAverage.fg3a).toBeGreaterThanOrEqual(
                seasonAverage.fg3m
            )
            expect(seasonAverage.fta).toBeGreaterThanOrEqual(seasonAverage.ftm)
        })
    })
})
