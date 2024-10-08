import { describe, it, expect } from 'vitest'
import { serverClient } from '@/app/_trpc/serverClient'
import { faker } from '@faker-js/faker'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import { prismaMock } from '../../singleton'
import { generateSeasonAverage } from '../../helpers/generators'

const mockSeasonAverage = {
    ...generateSeasonAverage(),
    id: faker.string.uuid(),
    season: 24,
    player_id: faker.string.uuid(),
    min: '',
}

describe('api/getSeasonAverage', () => {
    it('should return the season average', async () => {
        prismaMock.seasonAverages.findUnique.mockResolvedValueOnce(
            mockSeasonAverage
        )

        const id = faker.string.uuid()

        const { seasonAverage } = await serverClient.getSeasonAverage({ id })

        expect(prismaMock.seasonAverages.findUnique).toHaveBeenCalledWith({
            where: {
                player_id: id,
                season: getCurrentSeason(),
            },
        })

        const { player_name: _, ...rest } = mockSeasonAverage
        expect(seasonAverage).toEqual(rest)
    })
})
