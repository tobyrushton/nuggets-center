import prisma from '../db/client'
import { scrapeTeams } from '../scrapes/scrape-teams'

/**
 * @description updates the teams in the database
 * @returns {Promise<void>}
 */
export const updateTeams = async (): Promise<void> => {
    const teams = await scrapeTeams()
    const teamsInDb = await prisma.team.findMany()

    // if the teams in the db is less than the teams scraped
    // then we need to add the new teams
    if (teamsInDb.length < teams.length) {
        const newTeams = teams.filter(
            team => !teamsInDb.some(teamInDb => teamInDb.name === team.name)
        )
        await prisma.team.createMany({ data: newTeams })
    }
}
