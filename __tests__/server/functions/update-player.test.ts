import { describe, it, expect, vi, Mock } from 'vitest'
import { scrapePlayers } from '../../../src/server/scrapes/scrape-players'
import { faker } from '@faker-js/faker'
import { prismaMock } from '../../singleton'
import { updatePlayers } from '../../../src/server/functions/update-player'

vi.mock('../../../src/server/scrapes/scrape-players', () => ({
    scrapePlayers: vi.fn(),
}))

const positions = ['PG', 'SG', 'SF', 'PF', 'C']

export const generatePlayer = () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    position: faker.helpers.arrayElement(positions),
    height_feet: faker.number.int({ min: 6, max: 7 }),
    height_inches: faker.number.int({ min: 0, max: 11 }),
    weight: faker.number.int({ min: 180, max: 300 }),
    profile_url: faker.internet.url(),
})

const mockPlayers = Array.from({ length: 10 }, generatePlayer)

describe('updatePlayers', () => {
    it('should update players', async () => {
        (scrapePlayers as Mock).mockResolvedValue(mockPlayers)
        prismaMock.player.findMany.mockResolvedValue([])
        prismaMock.player.createMany.mockResolvedValue({ count: 10 })

        await updatePlayers()

        expect(prismaMock.player.findMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.player.createMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.player.createMany).toHaveBeenCalledWith({
            data: mockPlayers,
        })
    })

    it('should not update players if players are already in db', async () => {
        const mockPlayersInDb = mockPlayers.map((player, index) => ({
            ...player,
            id: `${index + 1}`,
        }))

        ;(scrapePlayers as Mock).mockResolvedValue(mockPlayers)
        prismaMock.player.findMany.mockResolvedValue(mockPlayersInDb)

        await updatePlayers()

        expect(prismaMock.player.findMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.player.createMany).toHaveBeenCalledTimes(0)
    })

    it('should create new players if players are not in db', async () => {
        const mockPlayersInDb = mockPlayers.map((player, index) => ({
            ...player,
            id: `${index + 1}`,
        }))

        const newMockPlayers = [...mockPlayers]
        newMockPlayers[0] = generatePlayer()
        ;(scrapePlayers as Mock).mockResolvedValue(newMockPlayers)
        prismaMock.player.findMany.mockResolvedValue(mockPlayersInDb)
        prismaMock.player.createMany.mockResolvedValue({ count: 1 })

        await updatePlayers()

        expect(prismaMock.player.findMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.player.createMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.player.createMany).toHaveBeenCalledWith({
            data: [newMockPlayers[0]],
        })
    })
})
