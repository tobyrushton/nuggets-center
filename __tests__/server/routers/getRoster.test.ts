import { describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { serverClient } from '@/app/_trpc/serverClient'
import { prismaMock } from '../../singleton'
import { generatePlayer } from '../functions/update-player.test'

const mockPlayers = Array.from({ length: 5 }, () => ({
    ...generatePlayer(),
    id: faker.string.uuid(),
}))

describe('api/getRoster', () => {
    it('should return the roster', async () => {
        prismaMock.player.findMany.mockResolvedValueOnce(mockPlayers)

        const { roster } = await serverClient.getRoster()

        expect(prismaMock.player.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                position: true,
                profile_url: true,
            },
        })

        expect(roster).toHaveLength(5)
    })
})
