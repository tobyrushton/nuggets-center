import { scrapePlayers } from '@/server/scrapes/scrape-players'
import { describe, it, expect } from 'vitest'

const positions = ['PG', 'SG', 'SF', 'PF', 'C', 'F', 'G']

describe('scrapePlayers', () => {
    it('should return an array of players with correct attributes', async () => {
        const players = await scrapePlayers()
        expect(players).toBeInstanceOf(Array)
        expect(players.length).toBeGreaterThan(0)

        players.forEach(player => {
            // check player has all the required fields of correct types
            const positionIsCorrect = positions.includes(player.position)
            // no nba player has ever been shorter than 5 foot or taller than 7 foot
            const heightIsCorrect =
                [5, 6, 7].includes(player.height_feet) &&
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(
                    player.height_inches
                )
            expect(positionIsCorrect).toBeTruthy()
            expect(heightIsCorrect).toBeTruthy()
            expect(typeof player.first_name).toBe('string')
            expect(typeof player.last_name).toBe('string')
            expect(typeof player.height_inches).toBe('number')
            expect(typeof player.height_feet).toBe('number')
            expect(typeof player.weight).toBe('number')
            expect(typeof player.profile_url).toBe('string')

            // check there is no extra spaces in name
            expect(player.first_name.trim()).toEqual(player.first_name)
            expect(player.last_name.trim()).toEqual(player.last_name)

            // check profile url is valid
            const profileUrlRegex =
                /https:\/\/a\.espncdn\.com\/i\/headshots\/nba\/players\/full\/[0-9]+\.png/i
            expect(profileUrlRegex.test(player.profile_url)).toBeTruthy()
        })
    })
})
