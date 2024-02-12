import { describe, it, expect } from 'vitest'
import { serverClient } from '@/app/_trpc/serverClient'
import { getDateOfGame } from '@/lib/getDateOfGame'
import { prismaMock } from '../../singleton'
import { generateGameWithScore, generateTeam } from '../../helpers/generators'

const mockTeam = generateTeam()
const generatedGame = generateGameWithScore([mockTeam.name])
const mockGame = {
    ...generatedGame,
    date: getDateOfGame(generatedGame.date).toISOString(),
}

describe('api/getGame', () => {
    it('should return a game', async () => {
        prismaMock.game.findUniqueOrThrow.mockResolvedValueOnce({
            id: '1',
            date: mockGame.date,
            opponent: {
                id: '1',
                name: mockTeam.name,
                logo_url: mockTeam.logo_url,
            },
            opponent_score: mockGame.opponent_score,
            home_score: mockGame.home_score,
            home: true,
        } as any)

        const game = await serverClient.getGame({ id: '1' })

        expect(prismaMock.game.findUniqueOrThrow).toHaveBeenCalledWith({
            where: {
                id: '1',
            },
            select: {
                id: true,
                date: true,
                opponent: true,
                opponent_score: true,
                home_score: true,
                home: true,
            },
        })
        expect(game).toEqual({
            game: {
                id: '1',
                date: new Date(mockGame.date),
                opponent: {
                    id: '1',
                    name: mockTeam.name,
                    logo_url: mockTeam.logo_url,
                },
                opponent_score: mockGame.opponent_score,
                home_score: mockGame.home_score,
                home: true,
            },
        })
    })

    it('should throw an error if the game does not exist', async () => {
        prismaMock.game.findUniqueOrThrow.mockRejectedValueOnce(
            new Error('Game not found')
        )

        await expect(serverClient.getGame({ id: '1' })).rejects.toThrow(
            'Game not found'
        )
    })
})
