import { getDateOfGame } from '@/lib/getDateOfGame'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import { sameDay } from '@/lib/sameDay'
import prisma from '../db/client'
import { scrapeGameStats, getLogLinks } from '../scrapes/scrape-game-stats'

const getPlayerName = (rawName: string): string => {
    const name = rawName.replace('-', ' ')
    if (name.includes('jr')) return name.replace('-jr', ' jr.')
    return name
}

/**
 * @description Update the game stats for all players
 */
export const updateGameStats = async (): Promise<void> => {
    const [links, players, games] = await Promise.all([
        getLogLinks(),
        prisma.player.findMany(),
        prisma.game.findMany({
            orderBy: {
                date: 'asc',
            },
        }),
    ])

    await Promise.all(
        links.map(async link => {
            const playerNameWithDash = link.split('/')[9]
            const gameStats = await scrapeGameStats(
                link.replace(
                    playerNameWithDash,
                    `type/nba/year/${getCurrentSeason()}`
                )
            )

            const playerName = getPlayerName(playerNameWithDash)
            const player = players.find(
                plyer =>
                    `${plyer.first_name} ${plyer.last_name}`.toLowerCase() ===
                    playerName
            )

            if (!player) return

            const gameStatsInDb = await prisma.playerGame.findMany({
                where: {
                    player_id: player.id,
                },
            })

            const gamesWithIds = gameStats
                .map(gameStat => {
                    const dateISO = getDateOfGame(gameStat.date).toISOString()
                    const game = games.find(gme => sameDay(gme.date, dateISO))

                    const { date: _, ...rest } = gameStat

                    if (!game)
                        return {
                            ...rest,
                            game_id: '',
                            player_id: player.id,
                        }

                    return {
                        ...rest,
                        game_id: game.id,
                        player_id: player.id,
                    }
                })
                .filter(gameStat => gameStat.game_id !== '')

            const filteredGameStats = gamesWithIds.filter(
                gameStat =>
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
