import { updateSchedule } from '../../../src/server/functions/update-schedule'
import { prismaMock } from '../../singleton'
import { scrapeSchedule } from '../../../src/server/scrapes/scrape-schedule'

jest.mock('../../../src/server/scrapes/scrape-schedule', () => ({
    __esModule: true,
    scrapeSchedule: jest.fn(),
}))

describe('updateSchedule', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should update the schedule in the database if there are new games', async () => {
        const mockSchedule = [
            { date: '2022-01-01', opponent_name: 'Team A', home: true },
            { date: '2022-01-02', opponent_name: 'Team B', home: false },
        ]
        const mockScheduleInDb = [
            {
                id: '1',
                date: '2022-01-01',
                opponent_id: '1',
                home: true,
                opponent_score: 101,
                home_score: 123,
            },
        ]
        const mockTeamsInDb = [
            { id: '1', name: 'Team A', logo_url: '' },
            { id: '2', name: 'Team B', logo_url: '' },
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
        expect(prismaMock.game.createMany).toHaveBeenCalledWith({
            data: [
                {
                    opponent_id: '2',
                    date: '2022-01-02',
                    home: false,
                    opponent_score: -1,
                    home_score: -1,
                },
            ],
        })
    })

    it('should not update the schedule in the database if there are no new games', async () => {
        const mockSchedule = [
            {
                date: '2022-01-01',
                opponent_name: 'Team A',
                home: true,
                opponent_score: 101,
                home_score: 123,
            },
            {
                date: '2022-01-02',
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
                }
            }),
        ]

        const mockTeamsInDb = [
            { id: '1', name: 'Team A', logo_url: '' },
            { id: '2', name: 'Team B', logo_url: '' },
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
        expect(prismaMock.game.createMany).not.toHaveBeenCalled()
    })
})
