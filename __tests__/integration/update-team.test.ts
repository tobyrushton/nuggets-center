import { describe, it, expect } from 'vitest'
import { updateTeams } from '@/server/functions/update-teams'
import prisma from '../helpers/prisma'

describe('updateTeams', () => {
    it('should add new teams when none are in db', async () => {
        await updateTeams()

        const count = await prisma.team.count()
        expect(count).toBe(30)
    })

    it('should add new team when one is not in db', async () => {
        await updateTeams()

        const firstCount = await prisma.team.count()
        expect(firstCount).toBe(30)

        const random = await prisma.team.findFirst()
        await prisma.team.delete({
            where: { id: (random as { id: string }).id },
        })

        const secondCount = await prisma.team.count()
        expect(secondCount).toBe(29)

        await updateTeams()

        const thirdCount = await prisma.team.count()
        expect(thirdCount).toBe(30)
    })

    it('should not update teams that are already in db', async () => {
        await updateTeams()

        const firstCount = await prisma.team.count()
        expect(firstCount).toBe(30)

        await updateTeams()

        const secondCount = await prisma.team.count()
        expect(secondCount).toBe(30)
    })
})
