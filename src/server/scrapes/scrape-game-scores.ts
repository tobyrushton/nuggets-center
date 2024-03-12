import jsdom from 'jsdom'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import { getDateOfGame } from '@/lib/getDateOfGame'

const { JSDOM } = jsdom

interface IGameScoreScrape {
    date: string
    home_score: number
    opponent_score: number
}

export const scrapeGameScores = async (): Promise<IGameScoreScrape[]> => {
    const res = await fetch(
        `https://www.espn.co.uk/nba/team/schedule/_/name/den/season/${getCurrentSeason()}`
    )
    const dom = new JSDOM(await res.text())
    const rows = dom.window.document.querySelectorAll('.Table__TR')

    const gameScores: IGameScoreScrape[] = []

    for (let i = 0; i < rows.length; i++) {
        const content = rows[i].querySelectorAll('td')
        if (!(content[0].textContent === 'DATE' || content.length === 1)) {
            const date = getDateOfGame(
                content[0].textContent as string
            ).toISOString()
            const home = !content[1].textContent?.includes('@')

            if (content.length === 7) {
                const score = content[2].textContent as string
                const win = score.includes('W')
                const [winnersScoreRaw, losersScoreRaw] = score
                    .slice(1)
                    .split('-')
                const winnersScore = parseInt(winnersScoreRaw, 10)
                const losersScore = parseInt(losersScoreRaw, 10)

                gameScores.push({
                    date,
                    home_score: home
                        ? win
                            ? winnersScore
                            : losersScore
                        : win
                          ? losersScore
                          : winnersScore,
                    opponent_score: home
                        ? win
                            ? losersScore
                            : winnersScore
                        : win
                          ? winnersScore
                          : losersScore,
                })
            } else
                gameScores.push({
                    date,
                    home_score: -1,
                    opponent_score: -1,
                })
        }
    }

    return gameScores
}
