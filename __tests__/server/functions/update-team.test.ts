import { describe, it, expect, vi, Mock } from 'vitest'
import { faker } from '@faker-js/faker'
import { updateTeams } from '../../../src/server/functions/update-teams'
import { scrapeTeams } from '../../../src/server/scrapes/scrape-teams'
import { prismaMock } from '../../singleton'

vi.mock('../../../src/server/scrapes/scrape-teams', () => ({
    scrapeTeams: vi.fn(),
}))

const generateTeam = (): Omit<team.ITeam, 'id'> => ({
    name: faker.lorem.word(),
    logo_url: faker.internet.url(),
})

const mockTeams = Array.from({ length: 10 }, generateTeam)

describe('updateTeams', () => {
    it('should add new teams', async () => {
        // eslint-disable-next-line
        (scrapeTeams as Mock).mockResolvedValue(mockTeams)
        prismaMock.team.findMany.mockResolvedValue([])

        await updateTeams()

        expect(prismaMock.team.createMany).toHaveBeenCalledWith({
            data: mockTeams,
        })
    })

    it('should not add new teams if teams are already in db', async () => {
        // eslint-disable-next-line
        (scrapeTeams as Mock).mockResolvedValue(mockTeams)
        prismaMock.team.findMany.mockResolvedValue(
            mockTeams.map(team => ({ ...team, id: faker.string.uuid() }))
        )

        await updateTeams()

        expect(prismaMock.team.createMany).not.toHaveBeenCalled()
    })

    it('should add new teams to db when teams are already in db', async () => {
        const newMockTeams = [...mockTeams]
        const newTeam = generateTeam()
        newMockTeams[0] = newTeam
        prismaMock.team.findMany.mockResolvedValue(
            mockTeams.map(team => ({ ...team, id: faker.string.uuid() }))
        )
        ;(scrapeTeams as Mock).mockResolvedValue(newMockTeams)

        await updateTeams()

        expect(prismaMock.team.createMany).toHaveBeenCalledWith({
            data: [newTeam],
        })
    })
})
