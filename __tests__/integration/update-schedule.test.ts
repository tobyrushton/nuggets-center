import { describe, expect, it, vi, Mock, beforeEach } from 'vitest'
import {
    scrapeSchedule,
    IScheduleScrape,
} from '@/server/scrapes/scrape-schedule'
import { updateSchedule } from '@/server/functions/update-schedule'
import { getDateOfGame } from '@/lib/getDateOfGame'
import { faker } from '@faker-js/faker'
import {
    generateGame,
    generateTeam,
    generateGameWithScore,
    validateSchedule,
} from '../helpers/generators'
import prisma from '../helpers/prisma'

vi.mock('../../src/server/scrapes/scrape-schedule', () => ({
    scrapeSchedule: vi.fn(),
}))

const mockTeams = Array.from({ length: 30 }, generateTeam)
const teamNames = mockTeams.map(team => team.name)
const mockSchedule = validateSchedule(
    Array.from({ length: 80 }, () => generateGame(teamNames))
)
const mockScheduleWithScoreAndNot: IScheduleScrape[] = validateSchedule(
    (
        Array.from({ length: 40 }, () =>
            generateGameWithScore(teamNames)
        ) as IScheduleScrape[]
    ).concat(Array.from({ length: 40 }, () => generateGame(teamNames)))
)

describe('updateSchedule', () => {
    beforeEach(async () => {
        await prisma.team.createMany({ data: mockTeams })
    })

    it('should update schedule when none are in db', async () => {
        (scrapeSchedule as Mock).mockResolvedValue(mockSchedule)

        await updateSchedule()

        const count = await prisma.game.count()
        expect(count).toBe(80)

        const games = await prisma.game.findMany()

        mockSchedule.forEach(game => {
            const createdGame = games.find(
                gameCreated =>
                    gameCreated.date === getDateOfGame(game.date).toISOString()
            )
            expect(createdGame).toBeTruthy()
        })
    })

    it('should set schedule with some with score and some without', async () => {
        ;(scrapeSchedule as Mock).mockResolvedValue(mockScheduleWithScoreAndNot)

        await updateSchedule()

        const count = await prisma.game.count()
        expect(count).toBe(80)
    })

    it('should update schedule when some are in db', async () => {
        let newMockSchedule = [...mockSchedule]
        ;(scrapeSchedule as Mock).mockResolvedValueOnce(newMockSchedule)

        await updateSchedule()

        const count = await prisma.game.count()
        expect(count).toBe(80)

        const newGames = Array.from({ length: 2 }, () =>
            generateGame(teamNames)
        )
        newMockSchedule.push(...newGames)
        newMockSchedule = validateSchedule(newMockSchedule)
        ;(scrapeSchedule as Mock).mockResolvedValueOnce(newMockSchedule)

        await updateSchedule()

        const newCount = await prisma.game.count()
        expect(newCount).toBe(82)
    })

    it('should update scores of games in db', async () => {
        (scrapeSchedule as Mock).mockResolvedValue(mockScheduleWithScoreAndNot)

        await updateSchedule()

        const scoreToChange = faker.number.int({ min: 40, max: 79 })
        const gameToUpdate = await prisma.game.findUnique({
            where: {
                date: getDateOfGame(
                    mockScheduleWithScoreAndNot[scoreToChange].date
                ).toISOString(),
            },
        })
        const count = await prisma.game.count()
        expect(count).toBe(80)
        expect(gameToUpdate).toBeTruthy()

        const newMockSchedule = [...mockScheduleWithScoreAndNot]
        const scores = {
            home_score: faker.number.int({ min: 60, max: 150 }),
            opponent_score: faker.number.int({ min: 60, max: 150 }),
        }

        newMockSchedule[scoreToChange] = {
            ...newMockSchedule[scoreToChange],
            ...scores,
        }
        ;(scrapeSchedule as Mock).mockResolvedValue(newMockSchedule)

        await updateSchedule()

        const newCount = await prisma.game.count()
        expect(newCount).toBe(80)

        const updatedGame = await prisma.game.findUnique({
            where: {
                id: gameToUpdate?.id,
            },
        })

        expect(updatedGame).toBeTruthy()
        expect(updatedGame?.home_score).toBe(scores.home_score)
        expect(updatedGame?.opponent_score).toBe(scores.opponent_score)
        expect(updatedGame?.opponent_id).toBe(gameToUpdate?.opponent_id)
        expect(updatedGame?.date).toBe(gameToUpdate?.date)
    })
})
