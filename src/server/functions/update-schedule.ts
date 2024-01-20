import prisma from '../db/client'
import { scrapeSchedule } from '../scrapes/scrape-schedule'

/**
 * @description updates the schedule in the database
 * @returns {Promise<void>}
 */
export const updateSchedule = async (): Promise<void> => {
    const schedule = await scrapeSchedule()
    const scheduleInDb = await prisma.game.findMany()
    const teamsInDb = await prisma.team.findMany()

    // if the schedule in the db is less than the schedule scraped
    // then we need to add the new schedule
    if (scheduleInDb.length < schedule.length) {
        const newSchedule = schedule.filter(
            schedule =>
                !scheduleInDb.some(
                    scheduleInDb => scheduleInDb.date === schedule.date
                )
        )

        const newScheduleWithTeamIds = newSchedule.map(schedule => {
            const opponent_id = teamsInDb.find(
                team => team.name === schedule.opponent_name
            )?.id as string

            // scores are undefined if the game is in the future so score is set to -1 (impossible score)
            return {
                opponent_id,
                date: schedule.date,
                home: schedule.home,
                opponent_score: schedule.opponent_score ?? -1,
                home_score: schedule.home_score ?? -1,
            }
        })
        await prisma.game.createMany({ data: newScheduleWithTeamIds })
    }
}
