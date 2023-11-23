import jsdom from 'jsdom'

const { JSDOM } = jsdom

interface IScheduleScrape {
    date: string
    home: boolean
    opponent_name: string
    // not all games have happened yet
    opponent_score?: number
    home_score?: number
}

/**
 * @param {NodeListOf<Element>} rows - the rows of the schedule table
 * @returns {Number} index of the date of the last game of the calendar year
 */
const findIndexOfLastGameOfTheCalendarYear = (
    // eslint-disable-next-line no-undef
    rows: NodeListOf<Element>
): number => {
    const decemberGamesIndex: number[] = []

    rows.forEach((row, index) => {
        const date = row.querySelectorAll('td')[0].textContent as string
        // dont check the header row
        if (date === 'DATE') return
        if (new Date(date).getMonth() === 11) decemberGamesIndex.push(index)
    })

    return decemberGamesIndex[decemberGamesIndex.length - 1]
}

/**
 * @description scrapes the schedule from espn.co.uk
 * @returns {Promise<IScheduleScrape[]>} scraped schedule
 */
export const scrapeSchedule = async (): Promise<IScheduleScrape[]> => {
    const res = await fetch(
        'https://www.espn.co.uk/nba/team/schedule/_/name/den/denver-nuggets'
    )
    const dom = new JSDOM(await res.text())
    const rows = dom.window.document.querySelectorAll('.Table__TR')

    const lastGame = findIndexOfLastGameOfTheCalendarYear(rows)

    const schedule: IScheduleScrape[] = []

    rows.forEach((row, index) => {
        const content = row.querySelectorAll('td')

        // dont want to scrape the header rows
        if (content[0].textContent === 'DATE') return

        // data that is the same for bothy completed and uncompleted games
        const date = content[0].textContent as string
        const opponent = content[1].textContent as string
        const [homeIndicator, opponentName] = opponent.split(' ')
        const home = homeIndicator === 'vs.'

        const year =
            index > lastGame
                ? new Date().getFullYear() + 1
                : new Date().getFullYear()

        // if game completed -> in the past
        if (content.length === 7) {
            const score = content[2].textContent as string
            const [homeScore, opponentScore] = score
                .slice(1, score.length - 1)
                .split('-')
            schedule.push({
                date: new Date(`${date} ${year}`).toISOString(),
                home,
                opponent_name: opponentName,
                opponent_score: parseInt(opponentScore, 10),
                home_score: parseInt(homeScore, 10),
            })
        } // if game not completed -> in the future
        else if (content.length === 5) {
            const time = content[2].textContent as string
            schedule.push({
                date: new Date(`${date} ${time} ${year}`).toISOString(),
                home,
                opponent_name: opponentName,
            })
        }
    })

    return schedule
}
