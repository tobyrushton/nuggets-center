import { z } from 'zod'
import { publicProcedure } from '../trpc'
import { getCurrentSeason } from '@/lib/getCurrentSeason'

const leaderTypes = [
    'pts',
    'ast',
    'reb',
    'stl',
    'blk',
    'fgm',
    'fga',
    'fg3m',
    'fg3a',
    'ftm',
    'fta',
    'oreb',
    'dreb',
    'turnover',
    'pf',
    'min',
    'games_played',
    'fg_pct',
    'fg3_pct',
    'ft_pct',
] as const

/**
 * Retrieves the leaders based on the specified category and take value.
 * @param {Object} input - The input object containing the category and take values.
 * @param {string} input.category - The category of leaders to retrieve.
 * @param {number} [input.take] - The number of leaders to retrieve (optional).
 * @returns {Object} - The object containing the leaders array.
 * @returns {Array} leaders - The array of leader objects.
 * @returns {string} leaders.player_id - The ID of the player.
 * @returns {string} leaders.player_name - The name of the player.
 * @returns {number} leaders.value - The value of the leader.
 */
export const getLeaders = publicProcedure
    .input(
        z.object({
            category: z.enum(leaderTypes),
            take: z.number().optional(),
        })
    )
    .output(
        z.object({
            leaders: z.array(
                z.object({
                    player_id: z.string(),
                    player_name: z.string(),
                    value: z.number(),
                    profile_url: z.string(),
                })
            ),
        })
    )
    .query(async ({ ctx, input }) => {
        const leaders = await ctx.prisma.seasonAverages.findMany({
            orderBy: {
                [input.category]: 'desc',
            },
            take: input.take,
            include: {
                player: true,
            },
            where: {
                season: getCurrentSeason(),
            }
        })

        return {
            leaders: leaders.length > 0 ? leaders.map(leader => ({
                player_id: leader.player.id,
                player_name: `${leader.player.first_name} ${leader.player.last_name}`,
                profile_url: leader.player.profile_url,
                value:
                    input.category === 'min'
                        ? parseFloat(leader[input.category])
                        : leader[input.category],
            })): (await ctx.prisma.player.findMany({ take: input.take })).map(player => ({
                player_id: player.id,
                player_name: `${player.first_name} ${player.last_name}`,
                profile_url: player.profile_url,
                value: -1,
            })),
        }
    })
