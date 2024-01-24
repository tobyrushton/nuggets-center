import { describe, expect, it, Mock, beforeEach, vi } from 'vitest'
import { scrapeSeasonAverages } from '@/server/scrapes/scrape-season-averages'
import { updateSeasonAverages } from '@/server/functions/update-season-averages'
import { generatePlayer, generateSeasonAverage } from '../helpers/generators'
import prisma from '../helpers/prisma'

vi.mock('../../src/server/scrapes/scrape-season-averages', () => ({
    scrapeSeasonAverages: vi.fn(),
}))

const mockPlayers = Array.from({ length: 16 }, generatePlayer)
const mockSeasonAverages = mockPlayers.map(player => ({
    ...generateSeasonAverage(),
    player_name: `${player.first_name} ${player.last_name}`,
}))

describe('updateSeasonAverages', () => {
    beforeEach(async () => {
        await prisma.player.createMany({ data: mockPlayers })
    })

    it('should update season averages when none are in db', async () => {
        (scrapeSeasonAverages as Mock).mockResolvedValue(mockSeasonAverages)

        await updateSeasonAverages()

        const count = await prisma.seasonAverages.count()
        expect(count).toBe(16)
    })

    it('should update season averages when some are in db', async () => {
        (scrapeSeasonAverages as Mock).mockResolvedValue(
            mockSeasonAverages.slice(0, 8)
        )

        await updateSeasonAverages()

        const count = await prisma.seasonAverages.count()
        expect(count).toBe(8)
        ;(scrapeSeasonAverages as Mock).mockResolvedValue(mockSeasonAverages)

        await updateSeasonAverages()

        const secondCount = await prisma.seasonAverages.count()
        expect(secondCount).toBe(16)
    })

    it('should update season averages when they have changed', async () => {
        (scrapeSeasonAverages as Mock).mockResolvedValue(mockSeasonAverages)

        await updateSeasonAverages()

        const count = await prisma.seasonAverages.count()
        expect(count).toBe(16)
        ;(scrapeSeasonAverages as Mock).mockResolvedValue(
            mockSeasonAverages.map(average => ({
                ...average,
                min: 100, // cause an update
            }))
        )

        await updateSeasonAverages()

        const secondCount = await prisma.seasonAverages.count()
        expect(secondCount).toBe(16)

        const averages = await prisma.seasonAverages.findMany()

        averages.forEach(average => {
            expect(average.min).toBe('100')
        })
    })
})
