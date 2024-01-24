import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
    await prisma.$transaction([
        prisma.seasonAverages.deleteMany(),
        prisma.playerGame.deleteMany(),
        prisma.game.deleteMany(),
        prisma.player.deleteMany(),
        prisma.team.deleteMany(),
    ])
}
