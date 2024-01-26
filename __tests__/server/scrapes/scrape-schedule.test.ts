import { describe, it, expect } from 'vitest'
import { scrapeSchedule } from '@/server/scrapes/scrape-schedule'

describe('scrapeSchedule', () => {
    it('should return an array of games with correct attributes', async () => {
        const schedule = await scrapeSchedule()

        expect(schedule).toBeInstanceOf(Array)
        expect(schedule.length).toBeGreaterThan(0)

        schedule.forEach(game => {
            const dateRegex = /[0-9]+ [A-Za-z]+/i
            expect(dateRegex.test(game.date)).toBeTruthy()
            expect(typeof game.home).toBe('boolean')
            expect(typeof game.opponent_name).toBe('string')
            if (game.opponent_score || game.home_score) {
                expect(typeof game.opponent_score).toBe('number')
                expect(typeof game.home_score).toBe('number')
            }
        })
    })
})
