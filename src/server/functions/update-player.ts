import prisma from '../db/client'
import { scrapePlayers } from '../scrapes/scrape-players'

/**
 * @description updates the players in the database
 * @returns {Promise<void>}
 */
export const updatePlayers = async (): Promise<void> => {
    const players = await scrapePlayers()
    const playersInDb = await prisma.player.findMany()

    // if the players in the db is less than the players scraped
    // then we need to add the new players
    const playersNotInDb = players.filter(
        player =>
            !playersInDb.find(
                playerInDb =>
                    `${playerInDb.first_name} ${playerInDb.last_name}` ===
                    `${player.first_name} ${player.last_name}`
            )
    )

    if (playersNotInDb.length > 0)
        await prisma.player.createMany({
            data: playersNotInDb,
        })
}
