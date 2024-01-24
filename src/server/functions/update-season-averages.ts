import { seasonAverageIsEqual } from '@/lib/seasonAverageIsEqual'
import prisma from '../db/client'
import { scrapeSeasonAverages } from '../scrapes/scrape-season-averages'

/**
 * @description updates the season averages in the database
 * @returns {Promise<void>}
 */
export const updateSeasonAverages = async (): Promise<void> => {
    const [seasonAverages, seasonAveragesInDb] = await Promise.all([
        scrapeSeasonAverages(),
        prisma.seasonAverages.findMany({
            include: { player: true },
        }),
    ])

    const newSeasonAverages = seasonAverages.filter(
        seasonAverage =>
            !seasonAveragesInDb.some(
                seasonAverageInDb =>
                    `${seasonAverageInDb.player.first_name} ${seasonAverageInDb.player.last_name}` ===
                    seasonAverage.player_name
            )
    )

    const seasonAveragesToUpdate = seasonAveragesInDb
        .map(seasonAverageInDb => {
            const seasonAverage = seasonAverages.find(
                average =>
                    `${seasonAverageInDb.player.first_name} ${seasonAverageInDb.player.last_name}` ===
                    average.player_name
            )

            if (!seasonAverage) return undefined
            const { player_name: _, ...rest } = seasonAverage
            const { player: __, id, player_id, ...restInDb } = seasonAverageInDb
            if (
                seasonAverageIsEqual(
                    { ...rest, season: '2023-24', min: rest.min.toString() },
                    restInDb
                )
            )
                return undefined
            return {
                ...rest,
                player_id,
                season: '2023-24',
                min: rest.min.toString(),
                id,
            }
        })
        .filter(
            seasonAverage => seasonAverage !== undefined
        ) as unknown as (player.ISeasonAverage & { id: string })[]

    if (newSeasonAverages.length > 0) {
        await Promise.all(
            newSeasonAverages.map(async seasonAverage => {
                const spaceIndex = seasonAverage.player_name.indexOf(' ')
                const first_name = seasonAverage.player_name.slice(
                    0,
                    spaceIndex
                )
                const last_name = seasonAverage.player_name.slice(
                    spaceIndex + 1
                )

                const player = await prisma.player.findFirst({
                    where: {
                        first_name,
                        last_name,
                    },
                })

                if (!player) return // TODO: handle this error
                const { player_name: _, ...rest } = seasonAverage

                await prisma.seasonAverages.create({
                    data: {
                        ...rest,
                        player_id: player.id,
                        season: '2023-24',
                        min: seasonAverage.min.toString(),
                    },
                })
            })
        )
    }

    if (seasonAveragesToUpdate.length > 0)
        await Promise.all(
            seasonAveragesToUpdate.map(async seasonAverage => {
                await prisma.seasonAverages.update({
                    where: {
                        id: seasonAverage.id,
                    },
                    data: seasonAverage,
                })
            })
        )
}
