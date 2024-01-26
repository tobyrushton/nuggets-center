import { describe, expect, it } from 'vitest'
import { scrapeTeams } from '@/server/scrapes/scrape-teams'

describe('scrapeTeams', () => {
    it('should return an array of teams with correct attributes', async () => {
        const teams = await scrapeTeams()

        expect(teams).toBeInstanceOf(Array)
        expect(teams.length).toBeGreaterThan(0)

        teams.forEach(team => {
            const logoUrlRegex =
                /https:\/\/a\.espncdn\.com\/i\/teamlogos\/nba\/500\/scoreboard\/[A-Za-z]+\.png/i
            expect(typeof team.name).toBe('string')
            expect(logoUrlRegex.test(team.logo_url)).toBeTruthy()
        })
    })
})
