import { describe, it, expect } from 'vitest'
import { serverClient } from '@/app/_trpc/serverClient'
import { faker } from '@faker-js/faker'
import { prismaMock } from '../../singleton'
import { generateGameStats, generatePlayer } from '../../helpers/generators'

const mockGameStats = Array.from({ length: 10 }, () => ({
    ...generateGameStats(),
    id: faker.string.uuid(),
    game_id: faker.string.uuid(),
    player_id: faker.string.uuid(),
    player: {
        ...generatePlayer(),
        id: faker.string.uuid(),
    },
    game: {
        id: faker.string.uuid(),
        date: faker.date.recent(),
    },
}))

describe('api/getGameStats', () => {
    it('should get the game stats when called with a game id', async () => {
        prismaMock.playerGame.findMany.mockResolvedValueOnce(mockGameStats)

        const game_id = faker.string.uuid()

        const { stats } = await serverClient.getGameStats({ game_id })

        expect(prismaMock.playerGame.findMany).toHaveBeenCalledWith({
            where: {
                game_id,
            },
            include: {
                player: true,
                game: true,
            },
            orderBy: {
                game: {
                    date: 'desc',
                },
            },
            cacheStrategy: { ttl: 60 * 60 },
        })

        expect(stats).toHaveLength(mockGameStats.length)
    })

    it('should get the game stats when called with a player id', async () => {
        prismaMock.playerGame.findMany.mockResolvedValueOnce(mockGameStats)

        const player_id = faker.string.uuid()

        const { stats } = await serverClient.getGameStats({ player_id })

        expect(prismaMock.playerGame.findMany).toHaveBeenCalledWith({
            where: {
                player_id,
            },
            include: {
                player: true,
                game: true,
            },
            orderBy: {
                game: {
                    date: 'desc',
                },
            },
            cacheStrategy: { ttl: 60 * 60 },
        })

        expect(stats).toHaveLength(mockGameStats.length)
    })
})
