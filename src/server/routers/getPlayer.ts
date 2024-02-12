import { z } from 'zod'
import { publicProcedure } from '../trpc'

export const getPlayer = publicProcedure
    .input(
        z.object({
            id: z.string(),
        })
    )
    .output(
        z.object({
            id: z.string(),
            first_name: z.string(),
            last_name: z.string(),
            position: z.string(),
            height_feet: z.number(),
            height_inches: z.number(),
            weight: z.number(),
            profile_url: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        const player = await ctx.prisma.player.findUniqueOrThrow({
            where: {
                id: input.id,
            },
        })

        return player
    })
