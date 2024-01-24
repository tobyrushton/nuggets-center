import { scheduleGameIsEqual } from '@/lib/scheduleGameIsEqual'
import { getDateOfGame } from '@/lib/getDateOfGame'
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
            !scheduleInDb.some(
                gameInDb =>
                    getDateOfGame(game.date).toISOString() === gameInDb.date
            )
    )

    const gamesToUpdate = schedule.filter(game =>
        scheduleInDb.some(
            gameInDb =>
                getDateOfGame(game.date).toISOString() === gameInDb.date &&
                !scheduleGameIsEqual(
                    { opponent_score: -1, home_score: -1, ...game },
                    gameInDb
                )
        )
    )

    if (gamesToUpdate.length > 0)
        await Promise.all(
            gamesToUpdate.map(async game => {
                const gameId = scheduleInDb.find(
                    gameInDb =>
                        getDateOfGame(game.date).toISOString() === gameInDb.date
                )?.id

                if (!gameId) return

                const { opponent_name: _, ...gameData } = game
                await prisma.game.update({
                    where: { id: gameId },
                    data: {
                        ...gameData,
                        date: getDateOfGame(game.date).toISOString(),
                    },
                })
            })
        )

    if (newGamesNotInDb.length > 0)
        await Promise.all(
            newGamesNotInDb.map(async game => {
                const opponent_id = teamsInDb.find(
                    team => team.name === game.opponent_name
                )?.id

                if (!opponent_id) return

                await prisma.game.create({
                    data: {
                        opponent_id,
                        date: getDateOfGame(game.date).toISOString(),
                        home: game.home,
                        opponent_score: game.opponent_score ?? -1,
                        home_score: game.home_score ?? -1,
                    },
                })
            })
        )
}
