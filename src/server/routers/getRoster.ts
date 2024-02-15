import { z } from 'zod'
import { publicProcedure } from '../trpc'

/**
 * Retrieves the roster of players.
 * @returns An object containing an array of player objects.
 */
export const getRoster = publicProcedure
    .output(
        z.object({
            roster: z.array(
                z.object({
                    id: z.string(),
                    first_name: z.string(),
                    last_name: z.string(),
                    position: z.string(),
                    profile_url: z.string(),
                })
            ),
        })
    )
    .query(async ({ ctx }) => {
        const roster = await ctx.prisma.player.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                position: true,
                profile_url: true,
            },
            cacheStrategy: {
                ttl: 60 * 60,
            },
        })

        return { roster }
    })
