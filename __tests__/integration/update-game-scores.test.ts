import { describe, expect , it, beforeEach } from "vitest"
import { updateGameScores } from "@/server/functions/update-game-scores"
import { updateTeams } from "@/server/functions/update-teams"
import { updateSchedule } from "@/server/functions/update-schedule"
import prisma from '../helpers/prisma'

describe('updateGameScores', () => {
    beforeEach(async () => {
        await updateTeams()
        await updateSchedule()
    })

    it('should update game scores', async () => {
        const game = await prisma.game.findFirst()

        expect(game).not.toBeNull()
        if(!game) return

        await prisma.game.update({
            where: {
                // error handled in expect
                id: game.id
            },
            data: {
                home_score: -1,
                opponent_score: -1
            }
        })

        const game2 = await prisma.game.findUnique({
            where: { id: game.id }
        })
        if(!game2) return

        expect(game2.home_score).toBe(-1)
        expect(game2.opponent_score).toBe(-1)

        await updateGameScores()

        const game3 = await prisma.game.findUnique({
            where: { id: game.id }
        })
        if(!game3) return
        expect(game3.home_score).toBe(game.home_score)
        expect(game3.opponent_score).toBe(game.opponent_score)
    })
})
