import { describe, expect, it, vi, Mock } from 'vitest'
import { prismaMock } from '../../singleton'
import { updateGameScores } from '../../../src/server/functions/update-game-scores'
import { scrapeGameScores } from '../../../src/server/scrapes/scrape-game-scores'

vi.mock('../../../src/server/scrapes/scrape-game-scores', () => ({
    scrapeGameScores: vi.fn(),
}))

const mockGameStats = [
    {
        date: new Date('01/01/24').toISOString(),
        home_score: -1,
        opponent_score: -1,
    },
    {
        date: new Date('01/02/24').toISOString(),
        home_score: -1,
        opponent_score: -1,
    },
]

describe('updateGameScores', () => {
    it('should update game scores', async () => {
        prismaMock.game.findMany.mockResolvedValue(
            mockGameStats.map((gameStat, idx) => ({
                id: `${idx}`,
                home: false,
                opponent_id: `${idx}`,
                opponent_name: 'opponent',
                ...gameStat,
            }))
        )

        ;(scrapeGameScores as Mock).mockResolvedValue([
            {
                date: new Date('01/01/24').toISOString(),
                home_score: 120,
                opponent_score: 134,
            },
            {
                date: new Date('01/02/24').toISOString(),
                home_score: 120,
                opponent_score: 134,
            },
        ])

        await updateGameScores()

        expect(prismaMock.game.findMany).toHaveBeenCalled()
        expect(scrapeGameScores).toHaveBeenCalled()
        expect(prismaMock.game.update).toHaveBeenCalledTimes(2)
        expect(prismaMock.game.update).toHaveBeenCalledWith({
            where: { id: '0' },
            data: {
                home_score: 120,
                opponent_score: 134,
            },
        })
        expect(prismaMock.game.update).toHaveBeenCalledWith({
            where: { id: '1' },
            data: {
                home_score: 120,
                opponent_score: 134,
            },
        })
    })
})