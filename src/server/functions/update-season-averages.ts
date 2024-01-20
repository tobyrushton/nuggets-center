import prisma from '../db/client'
import { scrapeSeasonAverages } from '../scrapes/scrape-season-averages'

/**
 * @description updates the season averages in the database
 * @returns {Promise<void>}
 */
export const updateSeasonAverages = async (): Promise<void> => {
    const seasonAverages = await scrapeSeasonAverages()
    const seasonAveragesInDb = await prisma.seasonAverages.findMany({
        include: { player: true },
    })

    // if the season averages in the db is less than the season averages scraped
    // then we need to add the new season averages
    if (seasonAveragesInDb.length < seasonAverages.length) {
        const newSeasonAverages = seasonAverages.filter(
            seasonAverage =>
                !seasonAveragesInDb.some(
                    seasonAverageInDb =>
                        `${seasonAverageInDb.player.first_name} ${seasonAverageInDb.player.last_name}` ===
                        seasonAverage.player_name
                )
        )

        const newSeasonAveragesWithPlayerId = newSeasonAverages.map(
            seasonAverage => {
                const player = seasonAveragesInDb.find(
                    seasonAverageInDb =>
                        seasonAverageInDb.player.first_name ===
                            seasonAverage.player_name.split(' ')[0] &&
                        seasonAverageInDb.player.last_name ===
                            seasonAverage.player_name.split(' ')[1]
                )

                const { player_name: _, min, ...rest } = seasonAverage
                return {
                    ...rest,
                    player_id: player?.player_id as string,
                    season: '2023-24',
                    min: min.toString(),
                }
            }
        )

        await prisma.seasonAverages.createMany({
            data: newSeasonAveragesWithPlayerId,
        })
    }
}
