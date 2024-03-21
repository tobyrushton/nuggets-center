import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const reset = async (): Promise<void> => {
    await prisma.$transaction([
        prisma.seasonAverages.deleteMany(),
        prisma.playerGame.deleteMany(),
        prisma.game.deleteMany(),
        prisma.player.deleteMany(),
        prisma.team.deleteMany(),
    ])
}

export default reset
