import puppeteer from 'puppeteer'

interface IScrapeGameStats {
    pts: number
    reb: number
    ast: number
    stl: number
    blk: number
    turnover: number
    min: string
    fgm: number
    fga: number
    fg3m: number
    fg3a: number
    ftm: number
    fta: number
    pf: number
    fg_pct: number
    fg3_pct: number
    ft_pct: number
    date: string // used for matching
}

export interface IGameStats extends IScrapeGameStats {
    game_id: string
    player_id: number
}

/**
 * @description Get all the game log links for the players on the team
 * @returns array of links
 */
export const getLogLinks = async (): Promise<string[]> => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(
        'https://www.espn.co.uk/nba/team/roster/_/name/den/denver-nuggets'
    )

    const logLinks = await page.evaluate(() => {
        const links = Array.from(
            window.document.querySelectorAll('.Table__TD--headshot a')
        ).map(link => link.getAttribute('href'))
        return links as string[]
    })

    await browser.close()

    return Array.from(logLinks).map(link =>
        link.replace('player', 'player/gamelog')
    )
}

/**
 * @description Scrape the game stats for a player
 * @param url - url of the game log
 * @returns array of game stats
 */
export const scrapeGameStats = async (
    url: string
): Promise<IScrapeGameStats[]> => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    const stats = await page.evaluate(() => {
        const gameStatsScrape: IScrapeGameStats[] = []

        const table =
            window.document.querySelector('.Table__Title')?.parentElement

        // if player has not played this season
        if (!table) return gameStatsScrape

        const rows = (table as Element).querySelectorAll('.Table__TR')

        rows.forEach(row => {
            const cells = row.querySelectorAll('.Table__TD')
            const regex = /[A-Za-z]+ [0-9]+\/[0-9]+/i
            if (
                cells[0] &&
                regex.test(cells[0].textContent as string) &&
                !cells[1].textContent?.includes('*') // indicates it was a special game, ASG
            ) {
                const date = cells[0].textContent?.split(' ')[1] as string
                const pts = cells[16].textContent as string
                const reb = cells[10].textContent as string
                const ast = cells[11].textContent as string
                const blk = cells[12].textContent as string
                const stl = cells[13].textContent as string
                const pf = cells[14].textContent as string
                const turnover = cells[15].textContent as string
                const min = cells[3].textContent as string
                const [fgm, fga] = (cells[4].textContent as string).split('-')
                const fg_pct = cells[5].textContent as string
                const [fg3m, fg3a] = (cells[6].textContent as string).split('-')
                const fg3_pct = cells[7].textContent as string
                const [ftm, fta] = (cells[8].textContent as string).split('-')
                const ft_pct = cells[9].textContent as string

                gameStatsScrape.push({
                    pts: parseFloat(pts),
                    reb: parseFloat(reb),
                    ast: parseFloat(ast),
                    blk: parseFloat(blk),
                    stl: parseFloat(stl),
                    pf: parseFloat(pf),
                    turnover: parseFloat(turnover),
                    min,
                    fgm: parseFloat(fgm),
                    fga: parseFloat(fga),
                    fg3m: parseFloat(fg3m),
                    fg3a: parseFloat(fg3a),
                    ftm: parseFloat(ftm),
                    fta: parseFloat(fta),
                    fg_pct: parseFloat(fg_pct),
                    fg3_pct: parseFloat(fg3_pct),
                    ft_pct: parseFloat(ft_pct),
                    date,
                })
            }
        })

        return gameStatsScrape
    })

    await browser.close()

    return stats
}
