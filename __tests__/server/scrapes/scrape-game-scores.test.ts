import { describe, it, expect } from 'vitest'
import { scrapeGameScores } from '@/server/scrapes/scrape-game-scores'

describe('scrapeGameScores', () => {
    it('should return an array of game scores', async () => {
        const gameScores = await scrapeGameScores()

        expect(gameScores).toBeInstanceOf(Array)
        expect(gameScores.length).toBeGreaterThan(0)

        gameScores.forEach(game => {
            const isoRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/i
            expect(isoRegex.test(game.date)).toBeTruthy()
            expect(typeof game.home_score).toBe('number')
            expect(typeof game.opponent_score).toBe('number')
        })
    })
})