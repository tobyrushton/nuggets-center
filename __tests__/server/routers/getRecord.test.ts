import { describe, it, expect } from 'vitest'
import { serverClient } from '@/app/_trpc/serverClient'
import { faker } from '@faker-js/faker'
import { prismaMock } from '../../singleton'
import {
    generateGameWithScore,
    validateSchedule,
    generateTeam,
} from '../../helpers/generators'

const mockTeams = Array.from({ length: 5 }, generateTeam)
const mockTeamNames = mockTeams.map(team => team.name)

describe('api/getRecord', () => {
    it('should return the team record', async () => {
        const mockGames = validateSchedule(
            Array.from({ length: 80 }, () => ({
                ...generateGameWithScore(mockTeamNames),
                id: faker.string.uuid(),
                opponent_id: faker.string.uuid(),
            }))
        ) as any

        prismaMock.game.findMany.mockResolvedValueOnce(mockGames)

        const record = await serverClient.getRecord()

        expect(prismaMock.game.findMany).toHaveBeenCalledWith({
            where: {
                home_score: {
                    not: -1,
                },
                opponent_score: {
                    not: -1,
                },
            },
        })

        expect(record.wins + record.losses).toBe(80)
    })

    it('should return empty record if no games have been played', async () => {
        prismaMock.game.findMany.mockResolvedValueOnce([])

        const record = await serverClient.getRecord()

        expect(prismaMock.game.findMany).toHaveBeenCalledWith({
            where: {
                home_score: {
                    not: -1,
                },
                opponent_score: {
                    not: -1,
                },
            },
        })

        expect(record.wins).toBe(0)
        expect(record.losses).toBe(0)
    })

    it('should count wins and losses correctly', async () => {
        prismaMock.game.findMany.mockResolvedValueOnce([
            {
                ...generateGameWithScore(mockTeamNames),
                home_score: 100,
                opponent_score: 99,
            },
            {
                ...generateGameWithScore(mockTeamNames),
                home_score: 100,
                opponent_score: 99,
            },
            {
                ...generateGameWithScore(mockTeamNames),
                home_score: 99,
                opponent_score: 100,
            },
        ] as any)

        const record = await serverClient.getRecord()

        expect(prismaMock.game.findMany).toHaveBeenCalledWith({
            where: {
                home_score: {
                    not: -1,
                },
                opponent_score: {
                    not: -1,
                },
            },
        })
        expect(record).toEqual({ wins: 2, losses: 1 })
    })
})
