import { z } from 'zod'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import { publicProcedure } from '../trpc'

interface IRecord {
    wins: number
    losses: number
}

/**
 * Retrieves the record of a team based on the game scores.
 * @returns The record of the team, including the number of wins and losses.
 */
export const getRecord = publicProcedure
    .output(
        z.object({
            wins: z.number(),
            losses: z.number(),
        })
    )
    .query(async ({ ctx }) => {
        const teamsWithScores = await ctx.prisma.game.findMany({
            where: {
                home_score: {
                    not: -1,
                },
                opponent_score: {
                    not: -1,
                },
                type: 'REGULAR',
                season: getCurrentSeason(),
            },
        })

        const record: IRecord = teamsWithScores.reduce<IRecord>(
            (acc, game) => ({
                wins: game.home
                    ? acc.wins + (game.home_score > game.opponent_score ? 1 : 0)
                    : acc.wins +
                      (game.opponent_score > game.home_score ? 1 : 0),
                losses: game.home
                    ? acc.losses +
                      (game.home_score < game.opponent_score ? 1 : 0)
                    : acc.losses +
                      (game.opponent_score < game.home_score ? 1 : 0),
            }),
            { wins: 0, losses: 0 }
        )

        return record
    })
