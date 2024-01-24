import { describe, it, vi, expect, Mock } from 'vitest'
import { scrapePlayers } from '@/server/scrapes/scrape-players'
import { updatePlayers } from '@/server/functions/update-player'
import { generatePlayer } from '../helpers/generators'
import prisma from '../helpers/prisma'

vi.mock('../../src/server/scrapes/scrape-players', () => ({
    scrapePlayers: vi.fn(),
}))

const mockPlayers = Array.from({ length: 16 }, generatePlayer)

describe('updatePlayers', () => {
    it('should add new players when none are in db', async () => {
        (scrapePlayers as Mock).mockResolvedValue(mockPlayers)
        await updatePlayers()

        const count = await prisma.player.count()
        expect(count).toBe(16)
    })

    it('should add new player when found in scrape', async () => {
        const newPlayer = generatePlayer()
        const players = [...mockPlayers, newPlayer]
        ;(scrapePlayers as Mock).mockResolvedValue(players)
        const { count: firstCount } = await prisma.player.createMany({
            data: mockPlayers,
        })
        expect(firstCount).toBe(16)

        await updatePlayers()

        const count = await prisma.player.count()
        expect(count).toBe(17)
    })

    it('should not update players that are already in db', async () => {
        (scrapePlayers as Mock).mockResolvedValue(mockPlayers)
        const { count: firstCount } = await prisma.player.createMany({
            data: mockPlayers,
        })

        expect(firstCount).toBe(16)

        await updatePlayers()

        const count = await prisma.player.count()
        expect(count).toBe(16)
    })
})
