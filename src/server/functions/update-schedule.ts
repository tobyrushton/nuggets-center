import { scheduleGameIsEqual } from '@/lib/scheduleGameIsEqual'
import { sameDay } from '@/lib/sameDay'
import prisma from '../db/client'
import { scrapeSchedule } from '../scrapes/scrape-schedule'

/**
 * @description updates the schedule in the database
 * @returns {Promise<void>}
 */
export const updateSchedule = async (): Promise<void> => {
    const [schedule, scheduleInDb, teamsInDb] = await Promise.all([
        scrapeSchedule(),
        prisma.game.findMany(),
        prisma.team.findMany(),
    ])

    const newGamesNotInDb = schedule.filter(
        game =>
            !scheduleInDb.some(gameInDb => sameDay(game.date, gameInDb.date))
    )

    const gamesToUpdate = schedule.filter(game =>
        scheduleInDb.some(
            gameInDb =>
                sameDay(gameInDb.date, game.date) &&
                !scheduleGameIsEqual(game, gameInDb)
        )
    )

    if (gamesToUpdate.length > 0)
        await Promise.all(
            gamesToUpdate.map(async game => {
                const gameId = scheduleInDb.find(gameInDb =>
                    sameDay(gameInDb.date, game.date)
                )?.id

                if (!gameId) return

                const { opponent_name: _, ...gameData } = game
                await prisma.game.update({
                    where: { id: gameId },
                    data: gameData,
                })
            })
        )

    if (newGamesNotInDb.length > 0)
        await Promise.all(
            newGamesNotInDb.map(async game => {
                const opponent_name_last_space =
                    game.opponent_name.lastIndexOf(' ')
                const opponent_name_split = game.opponent_name.slice(
                    opponent_name_last_space + 1
                )
                const opponent_id = teamsInDb.find(team =>
                    team.name.includes(opponent_name_split)
                )?.id

                if (!opponent_id) return

                await prisma.game.create({
                    data: {
                        opponent_id,
                        date: game.date,
                        home: game.home,
                        home_score: game.home_score,
                        opponent_score: game.opponent_score,
                    },
                })
            })
        )
}
