import { sameDay } from '@/lib/sameDay'
import prisma from '../db/client'
import { scrapeGameScores } from '../scrapes/scrape-game-scores'

export const updateGameScores = async (): Promise<void> => {
    const [scheduleInDb, gameScores] = await Promise.all([
        prisma.game.findMany(),
        scrapeGameScores(),
    ])

    const gamesToUpdate = scheduleInDb.filter(game => {
        const matchingGameScore = gameScores.find(gameScore =>
            sameDay(game.date, gameScore.date)
        )

        return (
            matchingGameScore &&
            (game.home_score !== matchingGameScore.home_score ||
                game.opponent_score !== matchingGameScore.opponent_score)
        )
    })

    if (gamesToUpdate.length > 0)
        await Promise.all(
            gamesToUpdate.map(async game => {
                const matchingGameScore = gameScores.find(gameScore =>
                    sameDay(game.date, gameScore.date)
                )

                if (!matchingGameScore) return

                await prisma.game.update({
                    where: { id: game.id },
                    data: {
                        home_score: matchingGameScore.home_score,
                        opponent_score: matchingGameScore.opponent_score,
                    },
                })
            })
        )
}
