import { z } from 'zod'
import { publicProcedure } from '../trpc'

/**
 * Retrieves the schedule of games.
 * @param {Object} input - The input parameters.
 * @param {number} input.take - The number of games to retrieve (optional).
 * @returns {Object} - The schedule of games.
 * @returns {Array} schedule - An array of game objects.
 * @returns {string} schedule.id - The ID of the game.
 * @returns {Date} schedule.date - The date of the game.
 * @returns {Object} schedule.opponent - The opponent of the game.
 * @returns {string} schedule.opponent.id - The ID of the opponent.
 * @returns {string} schedule.opponent.name - The name of the opponent.
 * @returns {string} schedule.opponent.logo_url - The URL of the opponent's logo.
 * @returns {number} schedule.opponent_score - The opponent's score (optional).
 * @returns {number} schedule.home_score - The home team's score (optional).
 */
export const getSchedule = publicProcedure
    .input(
        z
            .object({
                take: z.number(),
            })
            .optional()
    )
    .output(
        z.object({
            schedule: z.array(
                z.object({
                    id: z.string(),
                    date: z.date(),
                    opponent: z.object({
                        id: z.string(),
                        name: z.string(),
                        logo_url: z.string(),
                    }),
                    opponent_score: z.number().optional(),
                    home_score: z.number().optional(),
                })
            ),
        })
    )
    .query(async ({ ctx, input }) => {
        const schedule = await ctx.prisma.game.findMany({
            take: input?.take,
            include: {
                opponent: true,
            },
        })

        return {
            schedule: schedule.map(game => ({
                ...game,
                date: new Date(game.date),
            })),
        }
    })
