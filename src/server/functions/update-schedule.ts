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

    // if the schedule in the db is less than the schedule scraped
    // then we need to add the new schedule
    if (scheduleInDb.length < schedule.length) {
        const newSchedule = schedule.filter(
            game => !scheduleInDb.some(gameInDb => gameInDb.date === game.date)
        )

        const newScheduleWithTeamIds = newSchedule.map(game => {
            const opponent_id = teamsInDb.find(
                team => team.name === game.opponent_name
            )?.id as string

            // scores are undefined if the game is in the future so score is set to -1
            return {
                opponent_id,
                date: game.date,
                home: game.home,
                opponent_score: game.opponent_score ?? -1,
                home_score: game.home_score ?? -1,
            }
        })
        await prisma.game.createMany({ data: newScheduleWithTeamIds })
    }
}
