import { describe, it, expect } from 'vitest'
import { serverClient } from '@/app/_trpc/serverClient'
import { faker } from '@faker-js/faker'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import { prismaMock } from '../../singleton'
import { generateSeasonAverage, generatePlayer } from '../../helpers/generators'

const mockPlayers = Array.from({ length: 5 }, generatePlayer)
const mockSeasonAverages = mockPlayers.map(player => ({
    ...generateSeasonAverage(),
    player_id: faker.string.uuid(),
    season: 24,
    id: faker.string.uuid(),
    player_name: `${player.first_name} ${player.last_name}`,
    min: '30',
}))

const completeMockData = mockSeasonAverages.map((seasonAverage, index) => ({
    ...seasonAverage,
    player: {
        ...mockPlayers[index],
        id: seasonAverage.player_id,
    },
}))

describe('api/getLeaders', () => {
    it('should return leaders for all categories', async () => {
        prismaMock.seasonAverages.findMany.mockResolvedValueOnce(
            completeMockData
        )
        const result = await serverClient.getLeaders({ category: 'pts' })

        expect(prismaMock.seasonAverages.findMany).toHaveBeenCalledWith({
            orderBy: {
                pts: 'desc',
            },
            include: {
                player: true,
            },
            where: {
                season: getCurrentSeason(),
            },
        })

        expect(result.leaders).toHaveLength(5)
    })

    it('should work with take argument', async () => {
        prismaMock.seasonAverages.findMany.mockResolvedValueOnce([
            completeMockData[0],
        ])
        const result = await serverClient.getLeaders({
            category: 'pts',
            take: 1,
        })

        expect(prismaMock.seasonAverages.findMany).toHaveBeenCalledWith({
            orderBy: {
                pts: 'desc',
            },
            take: 1,
            include: {
                player: true,
            },
            where: {
                season: getCurrentSeason(),
            },
        })

        expect(result.leaders).toHaveLength(1)
    })
})
