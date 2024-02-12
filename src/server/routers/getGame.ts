import { z } from 'zod'
import { publicProcedure } from '../trpc'

/**
 * Retrieves a game based on the provided ID.
 *
 * @param {string} id - The ID of the game.
 * @returns {Promise<{ game: Game }>} - The game object.
 */
export const getGame = publicProcedure
    .input(
        z.object({
            id: z.string(),
        })
    )
    .output(
        z.object({
            game: z.object({
                id: z.string(),
                date: z.date(),
                opponent: z.object({
                    id: z.string(),
                    name: z.string(),
                    logo_url: z.string(),
                }),
                home: z.boolean(),
                opponent_score: z.number(),
                home_score: z.number(),
            }),
        })
    )
    .query(async ({ ctx, input }) => {
        const game = await ctx.prisma.game.findUniqueOrThrow({
            where: {
                id: input.id,
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

        return { game: { ...game, date: new Date(game.date) } }
    })
