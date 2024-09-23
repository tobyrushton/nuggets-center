import { describe, it, expect } from 'vitest'
import {
    getLogLinks,
    scrapeGameStats,
} from '@/server/scrapes/scrape-game-stats'

describe('getLogLinks', () => {
    it('should return an array of game log links', async () => {
        const logLinks = await getLogLinks()

        expect(logLinks).toBeInstanceOf(Array)
        expect(logLinks.length).toBeGreaterThan(0)

        logLinks.forEach(link => {
            const correctLogLinkRegex =
                /https:\/\/www\.espn\.co\.uk\/nba\/player\/gamelog\/_\/id\/[0-9]+\/[A-Za-z0-9]/i
            expect(correctLogLinkRegex.test(link)).toBeTruthy()
        })
    })
})

describe('scrapeGameStats', () => {
    it('should return an array of game stats', async () => {
        const logLinks = await getLogLinks()
        // only scrape first as all will be the same
        const gameStats = await scrapeGameStats(logLinks[0])

        expect(gameStats).toBeInstanceOf(Array)
        // expect(gameStats.length).toBeGreaterThan(0)

        gameStats.forEach(game => {
            const dateRegex = /[0-9]+\/[0-9]+/i
            expect(dateRegex.test(game.date)).toBeTruthy()
            expect(typeof game.fga).toBe('number')
            expect(typeof game.fg3m).toBe('number')
            expect(typeof game.fg3a).toBe('number')
            expect(typeof game.ftm).toBe('number')
            expect(typeof game.fta).toBe('number')
            expect(typeof game.pf).toBe('number')
            expect(typeof game.fg_pct).toBe('number')
            expect(typeof game.fg3_pct).toBe('number')
            expect(typeof game.ft_pct).toBe('number')
            expect(typeof game.fgm).toBe('number')
            expect(typeof game.pts).toBe('number')
            expect(typeof game.reb).toBe('number')
            expect(typeof game.ast).toBe('number')
            expect(typeof game.stl).toBe('number')
            expect(typeof game.blk).toBe('number')
            expect(typeof game.turnover).toBe('number')
            expect(typeof game.min).toBe('string')

            // validate
            expect(game.fga).toBeGreaterThanOrEqual(game.fgm)
            expect(game.fg3a).toBeGreaterThanOrEqual(game.fg3m)
            expect(game.fta).toBeGreaterThanOrEqual(game.ftm)
        })
    })
})
