import { z } from 'zod'
import { publicProcedure } from '../trpc'

/**
 * Retrieves a team based on the provided ID or name.
 *
 * @param {Object} input - The input parameters.
 * @param {string} input.id - The ID of the team (optional).
 * @param {string} input.name - The name of the team (optional).
 * @returns {Promise<{ team: Team }>} - The team object.
 */

export const getTeam = publicProcedure
    .input(
        z.object({
            id: z.string().optional(),
            name: z.string().optional(),
        })
    )
    .output(
        z.object({
            team: z.object({
                id: z.string(),
                name: z.string(),
                logo_url: z.string(),
            }),
        })
    )
    .query(async ({ ctx, input }) => {
        if (input.id) {
            const team = await ctx.prisma.team.findUniqueOrThrow({
                where: {
                    id: input.id,
                },
            })

            return { team }
        }

        if (input.name) {
            const team = await ctx.prisma.team.findFirstOrThrow({
                where: {
                    name: input.name,
                },
            })

            return { team }
        }

        throw new Error('You must provide an ID or name to retrieve a team.')
    })
