import { z } from 'zod'
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
            },
        })

        const record: IRecord = teamsWithScores.reduce<IRecord>(
            (acc, game) =>
                game.home_score > game.opponent_score
                    ? { ...acc, wins: acc.wins + 1 }
                    : { ...acc, losses: acc.losses + 1 },
            { wins: 0, losses: 0 }
        )

        return record
    })
