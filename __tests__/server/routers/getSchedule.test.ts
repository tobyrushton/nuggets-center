import { describe, it, expect } from 'vitest'
import { serverClient } from '@/app/_trpc/serverClient'
import { faker } from '@faker-js/faker'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import { prismaMock } from '../../singleton'
import {
    generateGameWithScore,
    validateSchedule,
    generateTeam,
} from '../../helpers/generators'

const mockTeams = Array.from({ length: 5 }, generateTeam)
const mockTeamNames = mockTeams.map(team => team.name)

const mockSchedule = validateSchedule(
    Array.from(
        { length: 80 },
        () =>
            ({
                ...generateGameWithScore(mockTeamNames),
                id: faker.string.uuid(),
                opponent: {
                    ...faker.helpers.arrayElement(mockTeams),
                    id: faker.string.uuid(),
                },
                // eslint-disable-next-line
    } as any))
).map(game => ({
    ...game,
    id: faker.string.uuid(),
    opponent_id: faker.string.uuid(),
}))

describe('api/getSchedule', () => {
    it('should return the schedule', async () => {
        prismaMock.game.findMany.mockResolvedValueOnce(mockSchedule)

        const { schedule } = await serverClient.getSchedule({})

        expect(prismaMock.game.findMany).toHaveBeenCalledWith({
            include: {
                opponent: true,
            },
            orderBy: {
                date: 'asc',
            },
            where: {
                season: getCurrentSeason(),
            },
        })

        expect(schedule).toHaveLength(80)
    })

    it('should return the schedule with a limit', async () => {
        prismaMock.game.findMany.mockResolvedValueOnce(mockSchedule.slice(0, 5))

        const { schedule } = await serverClient.getSchedule({ take: 5 })

        expect(prismaMock.game.findMany).toHaveBeenCalledWith({
            take: 5,
            include: {
                opponent: true,
            },
            orderBy: {
                date: 'asc',
            },
            where: {
                season: getCurrentSeason(),
            },
        })

        expect(schedule).toHaveLength(5)
    })

    it('should return the schedule with a limit and method type next', async () => {
        prismaMock.game.findMany.mockResolvedValueOnce(mockSchedule.slice(0, 5))

        const { schedule } = await serverClient.getSchedule({
            take: 5,
            method: 'next',
        })

        expect(prismaMock.game.findMany).toHaveBeenCalledWith({
            take: 5,
            orderBy: {
                date: 'asc',
            },
            where: {
                home_score: -1,
                opponent_score: -1,
                season: getCurrentSeason(),
            },
            include: {
                opponent: true,
            },
        })

        expect(schedule).toHaveLength(5)
    })

    it('should return the schedule with a limit and method type last', async () => {
        prismaMock.game.findMany.mockResolvedValueOnce(mockSchedule.slice(0, 5))

        const { schedule } = await serverClient.getSchedule({
            take: 5,
            method: 'last',
        })

        expect(prismaMock.game.findMany).toHaveBeenCalledWith({
            take: 5,
            orderBy: {
                date: 'desc',
            },
            where: {
                home_score: {
                    not: -1,
                },
                opponent_score: {
                    not: -1,
                },
                season: getCurrentSeason(),
            },
            include: {
                opponent: true,
            },
        })

        expect(schedule).toHaveLength(5)
    })
})
