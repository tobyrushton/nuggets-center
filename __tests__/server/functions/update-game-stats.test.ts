import { describe, expect, it, vi, beforeEach, Mock } from 'vitest'
import { prismaMock } from '../../singleton'
import { updateGameStats } from '../../../src/server/functions/update-game-stats'
import {
    scrapeGameStats,
    getLogLinks,
} from '../../../src/server/scrapes/scrape-game-stats'
import { getDateOfGame } from '../../../src/lib/getDateOfGame'

vi.mock('../../../src/server/scrapes/scrape-game-stats', () => ({
    scrapeGameStats: vi.fn(),
    getLogLinks: vi.fn(),
}))

const mockGameStats = [
    {
        date: '01/01',
        pts: 25,
        reb: 12,
        ast: 10,
        blk: 1,
        stl: 0,
        pf: 1,
        turnover: 2,
        min: '34',
        fgm: 10,
        fga: 20,
        fg3m: 5,
        fg3a: 10,
        ftm: 5,
        fta: 5,
        fg_pct: 50,
        fg3_pct: 50,
        ft_pct: 100,
    },
    {
        date: '01/02',
        pts: 25,
        reb: 12,
        ast: 10,
        blk: 1,
        stl: 0,
        pf: 1,
        turnover: 2,
        min: '34',
        fgm: 10,
        fga: 20,
        fg3m: 5,
        fg3a: 10,
        ftm: 5,
        fta: 5,
        fg_pct: 50,
        fg3_pct: 50,
        ft_pct: 100,
    },
]
const mockPlayersInDb = [
    {
        id: '1',
        first_name: 'Player',
        last_name: 'A',
        profile_url: '',
        position: 'PG',
        height_feet: 6,
        height_inches: 0,
        weight: 180,
    },
    {
        id: '2',
        first_name: 'Player',
        last_name: 'B',
        profile_url: '',
        position: 'SG',
        height_feet: 6,
        height_inches: 4,
        weight: 200,
    },
]
const mockGamesInDb = [
    {
        id: '1',
        date: new Date('2023-01-01').toISOString(),
        opponent_id: '1',
        home: true,
        opponent_score: 101,
        home_score: 123,
    },
    {
        id: '2',
        date: new Date('2023-01-02').toISOString(),
        opponent_id: '2',
        home: false,
        opponent_score: 120,
        home_score: 134,
    },
]

describe('updateGameStats', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers().setSystemTime(new Date('2023-01-03'))
    })

    it('should update the game stats in the database if there are new games', async () => {
        const mockGameStatsInDb = [
            {
                id: '1',
                player_id: '1',
                game_id: '1',
                ...mockGameStats[0],
            },
        ]

        // Mock the return values of the mocked functions
        ;(getLogLinks as Mock).mockResolvedValue([
            '_/_/_/_/_/_/_/_/player-a',
            '_/_/_/_/_/_/_/_/player-b',
        ])
        ;(scrapeGameStats as Mock).mockResolvedValue(mockGameStats)
        prismaMock.player.findMany.mockResolvedValue(mockPlayersInDb)
        prismaMock.game.findMany.mockResolvedValue(mockGamesInDb)
        prismaMock.playerGame.findMany.mockResolvedValue(mockGameStatsInDb)
        prismaMock.playerGame.createMany.mockResolvedValue({
            count: mockGameStats.length,
        })

        await updateGameStats()

        // Verify that the functions were called with the expected arguments
        expect(getLogLinks).toHaveBeenCalled()
        expect(scrapeGameStats).toHaveBeenCalledTimes(2)
        expect(prismaMock.player.findMany).toHaveBeenCalled()
        expect(prismaMock.game.findMany).toHaveBeenCalled()
        expect(prismaMock.playerGame.findMany).toHaveBeenCalled()
        expect(prismaMock.playerGame.createMany).toHaveBeenCalledWith({
            data: [
                {
                    game_id: '2',
                    player_id: '1',
                    ...mockGameStats[1],
                    date: getDateOfGame(mockGameStats[1].date).toISOString(),
                },
            ],
        })
    })

    it('should not update when there is no games', async () => {
        const mockGameStatsInDb = mockGameStats.map((gameStat, index) => ({
            id: `${index + 1}`,
            player_id: '1',
            game_id: `${index + 1}`,
            ...gameStat,
            date: getDateOfGame(gameStat.date).toISOString(),
        }))

        ;(getLogLinks as Mock).mockResolvedValue([
            '_/_/_/_/_/_/_/_/player-a',
            '_/_/_/_/_/_/_/_/player-b',
        ])
        ;(scrapeGameStats as Mock).mockResolvedValue(mockGameStats)
        prismaMock.player.findMany.mockResolvedValue(mockPlayersInDb)
        prismaMock.game.findMany.mockResolvedValue(mockGamesInDb)
        prismaMock.playerGame.findMany.mockResolvedValue(mockGameStatsInDb)

        await updateGameStats()

        // Verify that the functions were called with the expected arguments
        expect(getLogLinks).toHaveBeenCalled()
        expect(scrapeGameStats).toHaveBeenCalledTimes(2)
        expect(prismaMock.player.findMany).toHaveBeenCalled()
        expect(prismaMock.game.findMany).toHaveBeenCalled()
        expect(prismaMock.playerGame.findMany).toHaveBeenCalled()
        expect(prismaMock.playerGame.createMany).not.toHaveBeenCalled()
    })
})
