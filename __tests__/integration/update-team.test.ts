import { describe, it, Mock, vi, expect } from 'vitest'
import { updateTeams } from '@/server/functions/update-teams'
import { scrapeTeams } from '@/server/scrapes/scrape-teams'
import { generateTeam } from '../helpers/generators'
import prisma from '../helpers/prisma'

vi.mock('../../src/server/scrapes/scrape-teams', () => ({
    scrapeTeams: vi.fn(),
}))

const mockTeams = Array.from({ length: 30 }, generateTeam)

describe('updateTeams', () => {
    it('should add new teams when none are in db', async () => {
        (scrapeTeams as Mock).mockResolvedValue(mockTeams)
        await updateTeams()

        const count = await prisma.team.count()
        expect(count).toBe(30)
    })

    it('should add new team when one is not in db', async () => {
        const newTeam = generateTeam()
        const teams = [...mockTeams, newTeam]
        ;(scrapeTeams as Mock).mockResolvedValue(teams)
        const { count: firstCount } = await prisma.team.createMany({
            data: mockTeams,
        })
        expect(firstCount).toBe(30)

        await updateTeams()

        const count = await prisma.team.count()
        expect(count).toBe(31)
    })

    it('should not update teams that are already in db', async () => {
        (scrapeTeams as Mock).mockResolvedValue(mockTeams)
        const { count: firstCount } = await prisma.team.createMany({
            data: mockTeams,
        })

        expect(firstCount).toBe(30)

        await updateTeams()

        const count = await prisma.team.count()
        expect(count).toBe(30)
    })
})
