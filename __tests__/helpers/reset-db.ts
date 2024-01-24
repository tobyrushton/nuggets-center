import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async () => {
    await prisma.$transaction([
        prisma.game.deleteMany(),
        prisma.playerGame.deleteMany(),
        prisma.player.deleteMany(),
        prisma.team.deleteMany(),
        prisma.seasonAverages.deleteMany(),
    ])
}