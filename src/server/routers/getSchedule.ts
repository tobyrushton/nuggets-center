import { z } from 'zod'
import { publicProcedure } from '../trpc'
import { getCurrentSeason } from '@/lib/getCurrentSeason'

/**
 * Retrieves the schedule of games.
 * @param {Object} input - The input parameters.
 * @param {number} input.take - The number of games to retrieve (optional).
 * @param {string} input.method - The method to retrieve games (optional).
 * @param {string} input.opponentId - The ID of the opponent to retrieve games for (optional).
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
        z.object({
            take: z.number().optional(),
            method: z.enum(['next', 'last', 'all']).optional(),
            opponentId: z.string().optional(),
        })
    )
    .output(
        z.object({
            schedule: z.array(
                z.object({
                    id: z.string(),
                    date: z.date(),
                    home: z.boolean(),
                    opponent: z.object({
                        id: z.string(),
                        name: z.string(),
                        logo_url: z.string(),
                    }),
                    opponent_score: z.number(),
                    home_score: z.number(),
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
            orderBy:
                input.method && input.method !== 'all'
                    ? {
                          date: input.method === 'next' ? 'asc' : 'desc',
                      }
                    : { date: 'asc' },
            where: {
                    ...input.method && input.method !== 'all'
                        ? {
                            home_score:
                                input.method === 'next' ? -1 : { not: -1 },
                            opponent_score:
                                input.method === 'next' ? -1 : { not: -1 },
                        }
                        : input.opponentId
                        ? { opponent_id: input.opponentId }
                        : undefined,
                    season: getCurrentSeason(),
            }
        })

        return {
            schedule: schedule.map(game => ({
                ...game,
                date: new Date(game.date),
            })),
        }
    })
