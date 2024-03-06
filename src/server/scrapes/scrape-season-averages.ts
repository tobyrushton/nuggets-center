import puppeteer from 'puppeteer'

interface IGameStatsScrape {
    games_played: number
    min: number
    pts: number
    oreb: number
    dreb: number
    reb: number
    ast: number
    stl: number
    blk: number
    turnover: number
    pf: number
}

interface IShootingStatsScrape {
    fgm: number
    fga: number
    fg3m: number
    fg3a: number
    ftm: number
    fta: number
    fg_pct: number
    fg3_pct: number
    ft_pct: number
}

interface ISeasonAveragesScrape extends IGameStatsScrape, IShootingStatsScrape {
    player_name: string
}

export const scrapeSeasonAverages = async (): Promise<
    ISeasonAveragesScrape[]
> => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
        width: 1920,
        height: 1080,
    })
    await page.goto('https://www.espn.co.uk/nba/team/stats/_/name/den')

    const seasonAverages = await page.evaluate(() => {
        const tables = window.document.querySelectorAll('.Table')

        // as the names are stored in a different table but have the same index
        // array of the names is created in order to track their indexes in the table
        const namesElement = tables[0].querySelectorAll('.Table__TD a')
        const names = Array.from(namesElement).map(
            name => name.textContent
        ) as string[]

        const gameStats: IGameStatsScrape[] = names.map((name, index) => {
            const statsRow = tables[1].querySelectorAll('.Table__TR')[index + 1]
            const statsContent = statsRow.querySelectorAll('.Table__TD')
            const statsArray = Array.from(statsContent).map(
                stat => stat.textContent
            ) as string[]

            return {
                games_played: parseInt(statsArray[0], 10),
                min: parseFloat(statsArray[2]),
                pts: parseFloat(statsArray[3]),
                oreb: parseFloat(statsArray[4]),
                dreb: parseFloat(statsArray[5]),
                reb: parseFloat(statsArray[6]),
                ast: parseFloat(statsArray[7]),
                stl: parseFloat(statsArray[8]),
                blk: parseFloat(statsArray[9]),
                turnover: parseFloat(statsArray[10]),
                pf: parseFloat(statsArray[11]),
            }
        })

        const shootingStats: IShootingStatsScrape[] = names.map(
            (name, index) => {
                const statsRow =
                    tables[3].querySelectorAll('.Table__TR')[index + 1]
                const statsContent = statsRow.querySelectorAll('.Table__TD')
                const statsArray = Array.from(statsContent).map(
                    stat => stat.textContent
                ) as string[]

                return {
                    fgm: parseFloat(statsArray[0]),
                    fga: parseFloat(statsArray[1]),
                    fg_pct: parseFloat(statsArray[2]),
                    fg3m: parseFloat(statsArray[3]),
                    fg3a: parseFloat(statsArray[4]),
                    fg3_pct: parseFloat(statsArray[5]),
                    ftm: parseFloat(statsArray[6]),
                    fta: parseFloat(statsArray[7]),
                    ft_pct: parseFloat(statsArray[8]),
                }
            }
        )

        const seasonAveragesScrape: ISeasonAveragesScrape[] = names.map(
            (name, index) => ({
                player_name: name,
                ...gameStats[index],
                ...shootingStats[index],
            })
        )

        return seasonAveragesScrape
    })

    await browser.close()

    return seasonAverages
}
