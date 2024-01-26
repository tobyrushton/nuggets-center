import { describe, it, expect } from 'vitest'
import { updatePlayers } from '@/server/functions/update-player'
import prisma from '../helpers/prisma'

describe('updatePlayers', () => {
    it('should add new players when none are in db', async () => {
        await updatePlayers()

        const count = await prisma.player.count()

        // nba team will have bteween 14-18 players
        expect(count).toBeGreaterThanOrEqual(14)
        expect(count).toBeLessThanOrEqual(18)
    })

    it('should add new player when found in scrape', async () => {
        await updatePlayers()

        const firstCount = await prisma.player.count()
        const random = await prisma.player.findFirst()
        await prisma.player.delete({
            where: { id: (random as { id: string }).id },
        })
        const secondCount = await prisma.player.count()

        expect(secondCount).toBe(firstCount - 1)

        await updatePlayers()

        const thirdCount = await prisma.player.count()
        expect(thirdCount).toBe(firstCount)
    })

    it('should not update players that are already in db', async () => {
        await updatePlayers()

        const firstCount = await prisma.player.count()

        await updatePlayers()

        const secondCount = await prisma.player.count()

        expect(firstCount).toBe(secondCount)
    })
})
