import { updateSchedule } from '../../../src/server/functions/update-schedule'
import { prismaMock } from '../../singleton'
import { scrapeSchedule } from '../../../src/server/scrapes/scrape-schedule'
import { getDateOfGame } from '@/lib/getDateOfGame'

jest.mock('../../../src/server/scrapes/scrape-schedule', () => ({
    __esModule: true,
    scrapeSchedule: jest.fn(),
}))

const mockTeamsInDb = [
    { id: '1', name: 'Team A', logo_url: '' },
    { id: '2', name: 'Team B', logo_url: '' },
]

describe('updateSchedule', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.useFakeTimers().setSystemTime(new Date('2024-01-01'))
    })

    it('should update the schedule in the database if there are new games', async () => {
        const mockSchedule = [
            { date: '01/01', opponent_name: 'Team A', home: true },
            { date: '01/02', opponent_name: 'Team B', home: false },
            { date: '01/03', opponent_name: 'Team B', home: true },
        ]
        const mockScheduleInDb = [
            {
                id: '1',
                date: new Date('2024-01-01').toISOString(),
                opponent_id: '1',
                home: true,
                opponent_score: 101,
                home_score: 123,
            },
        ]

        // Mock the return values of the mocked functions
        ;(scrapeSchedule as jest.Mock).mockResolvedValue(mockSchedule)
        prismaMock.game.findMany.mockResolvedValue(mockScheduleInDb)
        prismaMock.team.findMany.mockResolvedValue(mockTeamsInDb)
        prismaMock.game.createMany.mockResolvedValue({
            count: mockSchedule.length,
        })

        await updateSchedule()

        // Verify that the functions were called with the expected arguments
        expect(scrapeSchedule).toHaveBeenCalled()
        expect(prismaMock.game.findMany).toHaveBeenCalled()
        expect(prismaMock.team.findMany).toHaveBeenCalled()
        expect(prismaMock.game.create).toHaveBeenCalledWith({
            data:
                {
                    opponent_id: '2',
                    date: new Date('2024-01-02').toISOString(),
                    home: false,
                    opponent_score: -1,
                    home_score: -1,
                },
        })
        expect(prismaMock.game.create).toHaveBeenCalledWith({
            data:
                {
                    opponent_id: '2',
                    date: new Date('2024-01-03').toISOString(),
                    home: true,
                    opponent_score: -1,
                    home_score: -1,
                },
        })
    })

    it('should not update the schedule in the database if there are no new games', async () => {
        const mockSchedule = [
            {
                date: '01/01',
                opponent_name: 'Team A',
                home: true,
                opponent_score: 101,
                home_score: 123,
            },
            {
                date: '01/01',
                opponent_name: 'Team B',
                home: false,
                opponent_score: 120,
                home_score: 134,
            },
        ]

        const mockScheduleInDb = [
            ...mockSchedule.map((game, index) => {
                const { opponent_name: _, ...rest } = game
                return {
                    id: index.toString(),
                    opponent_id: index.toString(),
                    ...rest,
                    date: getDateOfGame(game.date).toISOString(),
                }
            }),
        ]

        // Mock the return values of the mocked functions
        ;(scrapeSchedule as jest.Mock).mockResolvedValue(mockSchedule)
        prismaMock.game.findMany.mockResolvedValue(mockScheduleInDb)
        prismaMock.team.findMany.mockResolvedValue(mockTeamsInDb)

        await updateSchedule()

        // Verify that the functions were called with the expected arguments
        expect(scrapeSchedule).toHaveBeenCalled()
        expect(prismaMock.game.findMany).toHaveBeenCalled()
        expect(prismaMock.team.findMany).toHaveBeenCalled()
        expect(prismaMock.game.create).not.toHaveBeenCalled()
    })

    it('should update game if changed', async () => {
        const mockSchedule = [
            {
                date: '01/01',
                opponent_name: 'Team A',
                home: true,
                opponent_score: 101,
                home_score: 123,
            },
            {
                date: '01/02',
                opponent_name: 'Team B',
                home: false,
                opponent_score: 120,
                home_score: 134,
            },
        ]

        const mockScheduleInDb = [
            ...mockSchedule.map((game, index) => {
                return {
                    id: index.toString(),
                    opponent_id: index.toString(),
                    date: getDateOfGame(game.date).toISOString(),
                    home_score: -1,
                    opponent_score: -1,
                    home: game.home,
                    opponent_name: game.opponent_name,
                }
            }),
        ]

        // Mock the return values of the mocked functions
        ;(scrapeSchedule as jest.Mock).mockResolvedValue(mockSchedule)
        prismaMock.game.findMany.mockResolvedValue(mockScheduleInDb)
        prismaMock.team.findMany.mockResolvedValue(mockTeamsInDb)

        await updateSchedule()

        // Verify that the functions were called with the expected arguments
        expect(scrapeSchedule).toHaveBeenCalled()
        expect(prismaMock.game.findMany).toHaveBeenCalled()
        expect(prismaMock.team.findMany).toHaveBeenCalled()
        mockSchedule.forEach((game, index) => {
            expect(prismaMock.game.update).toHaveBeenCalledWith({
                where: { id: index.toString() },
                data: {
                    ...game,
                    date: getDateOfGame(game.date).toISOString(),
                },
            })
        })
    })
})
