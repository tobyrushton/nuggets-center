import prisma from '../db/client'
import { scrapeTeams } from '../scrapes/scrape-teams'

/**
 * @description updates the teams in the database
 * @returns {Promise<void>}
 */
export const updateTeams = async (): Promise<void> => {
    const [teams, teamsInDb] = await Promise.all([
        scrapeTeams(),
        prisma.team.findMany(),
    ])

    const teamsNotInDb = teams.filter(
        team => !teamsInDb.some(teamInDb => teamInDb.name === team.name)
    )

    if (teamsNotInDb.length > 0)
        await prisma.team.createMany({
            data: teamsNotInDb,
        })
}
