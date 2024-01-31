import jsdom from 'jsdom'

const { JSDOM } = jsdom

export interface IScheduleScrape {
    date: string
    home: boolean
    opponent_name: string
    // not all games have happened yet
    opponent_score?: number
    home_score?: number
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

    const schedule: IScheduleScrape[] = []

    rows.forEach(row => {
        const content = row.querySelectorAll('td')

        // dont want to scrape the header rows
        if (content[0].textContent === 'DATE') return

        // data that is the same for bothy completed and uncompleted games
        const dateString = content[0].textContent as string
        const date = dateString.slice(dateString.indexOf(' ') + 1)
        const opponent = content[1].textContent as string
        const [_, opponentName] = opponent.split(' ')
        const home = !opponent.includes('@')

        // if game completed -> in the past
        if (content.length === 7) {
            const score = content[2].textContent as string
            const [homeScore, opponentScore] = score
                .slice(1, score.length - 1)
                .split('-')
            schedule.push({
                date,
                home,
                opponent_name: opponentName,
                opponent_score: parseInt(opponentScore, 10),
                home_score: parseInt(homeScore, 10),
            })
        } // if game not completed -> in the future
        else if (content.length === 5) {
            // const time = content[2].textContent as string
            schedule.push({
                date,
                home,
                opponent_name: opponentName,
            })
        }
    })

    return schedule
}
