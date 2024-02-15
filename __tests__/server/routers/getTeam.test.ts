import { describe, expect, it } from 'vitest'
import { serverClient } from '@/app/_trpc/serverClient'
import { faker } from '@faker-js/faker'
import { generateTeam } from '../../helpers/generators'
import { prismaMock } from '../../singleton'

const mockTeams = Array.from({ length: 10 }, generateTeam).map(team => ({
    ...team,
    id: faker.string.uuid(),
}))

describe('getTeam', () => {
    it('should return a team based on the provided ID', async () => {
        const team = mockTeams[0]
        prismaMock.team.findUniqueOrThrow.mockResolvedValue(team)
        const response = await serverClient.getTeam({ id: team.id })
        expect(response).toEqual({ team })
    })

    it('should return a team based on the provided name', async () => {
        const team = mockTeams[0]
        prismaMock.team.findFirstOrThrow.mockResolvedValue(team)
        const response = await serverClient.getTeam({ name: team.name })
        expect(response).toEqual({ team })
    })

    it('should throw an error if neither an ID or name is provided', async () => {
        await expect(serverClient.getTeam({})).rejects.toThrow(
            'You must provide an ID or name to retrieve a team.'
        )
    })
})
