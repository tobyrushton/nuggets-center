import { getDateOfGame } from '@/lib/getDateOfGame'
import prisma from '../db/client'
import { scrapeGameStats, getLogLinks } from '../scrapes/scrape-game-stats'

/**
 * @description Update the game stats for all players
 */
export const updateGameStats = async (): Promise<void> => {
    const [links, players, games] = await Promise.all([
        getLogLinks(),
        prisma.player.findMany(),
        prisma.game.findMany(),
    ])

    await Promise.all(
        links.map(async link => {
            const gameStats = await scrapeGameStats(link)

            const playerName = link.split('/')[6].replace('-', ' ')
            const player = players.find(
                plyer =>
                    `${plyer.first_name} ${plyer.last_name}`.toLowerCase() ===
                    playerName
            )

            if (!player)
                throw new Error(`Player ${playerName} not found in database`)

            const gameStatsInDb = await prisma.playerGame.findMany({
                where: {
                    player_id: player.id,
                },
            })

            const gamesWithIds = gameStats.map(gameStat => {
                const dateISO = getDateOfGame(gameStat.date).toISOString()
                const game = games.find(gme => gme.date === dateISO)

                if (!game) throw new Error(`Game not found for date ${dateISO}`)

                return {
                    ...gameStat,
                    date: dateISO,
                    game_id: game.id,
                    player_id: player.id,
                }
            })

            const filteredGameStats = gamesWithIds.filter(gameStat =>
                !gameStatsInDb.find(
                    gmeStatInDb => gmeStatInDb.game_id === gameStat.game_id
                )
            )
            
            if (filteredGameStats.length > 0)
                await prisma.playerGame.createMany({
                    data: filteredGameStats,
                })
        })
    )
}
