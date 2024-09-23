import { z } from 'zod'
import { publicProcedure } from '../trpc'
import { getCurrentSeason } from '@/lib/getCurrentSeason'

/**
 * Retrieves the season average statistics for a player.
 * @param {string} id - The ID of the player.
 * @returns {Promise<{ seasonAverage: SeasonAverage }>} - The season average statistics for the player.
 */
export const getSeasonAverage = publicProcedure
    .input(
        z.object({
            id: z.string(),
        })
    )
    .output(
        z.object({
            seasonAverage: z.object({
                id: z.string(),
                player_id: z.string(),
                season: z.number(),
                min: z.string(),
                fgm: z.number(),
                fga: z.number(),
                fg_pct: z.number(),
                fg3m: z.number(),
                fg3a: z.number(),
                fg3_pct: z.number(),
                ftm: z.number(),
                fta: z.number(),
                ft_pct: z.number(),
                oreb: z.number(),
                dreb: z.number(),
                reb: z.number(),
                ast: z.number(),
                stl: z.number(),
                blk: z.number(),
                turnover: z.number(),
                pf: z.number(),
                pts: z.number(),
                games_played: z.number(),
            }).nullable(),
        })
    )
    .query(async ({ ctx, input }) => {
        const seasonAverage = await ctx.prisma.seasonAverages.findUnique(
            {
                where: {
                    player_id: input.id,
                    season: getCurrentSeason(),
                },
            }
        )

        return { seasonAverage }
    })
