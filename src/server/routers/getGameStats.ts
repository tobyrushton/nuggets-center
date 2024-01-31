import { z } from 'zod'
import { publicProcedure } from '../trpc'

export const getGameStats = publicProcedure
    .input(
        z.object({
            game_id: z.string().optional(),
            player_id: z.string().optional(),
        })
    )
    .output(
        z.object({
            stats: z.array(
                z.object({
                    id: z.string(),
                    player_id: z.string(),
                    game_id: z.string(),
                    pts: z.number(),
                    ast: z.number(),
                    min: z.string(),
                    reb: z.number(),
                    fgm: z.number(),
                    fga: z.number(),
                    fg3m: z.number(),
                    fg3a: z.number(),
                    ftm: z.number(),
                    fta: z.number(),
                    stl: z.number(),
                    blk: z.number(),
                    turnover: z.number(),
                    pf: z.number(),
                    fg_pct: z.number(),
                    fg3_pct: z.number(),
                    ft_pct: z.number(),
                    player: z.object({
                        id: z.string(),
                        first_name: z.string(),
                        last_name: z.string(),
                        profile_url: z.string(),
                    }),
                })
            ),
        })
    )
    .query(async ({ ctx, input }) => {
        const stats = await ctx.prisma.playerGame.findMany({
            where: {
                game_id: input.game_id,
                player_id: input.player_id,
            },
            include: {
                player: true,
            },
        })

        return {
            stats: stats.map(stat => ({
                ...stat,
                player: {
                    id: stat.player.id,
                    first_name: stat.player.first_name,
                    last_name: stat.player.last_name,
                    profile_url: stat.player.profile_url,
                },
            })),
        }
    })
