import { getCurrentSeason } from '@/lib/getCurrentSeason'
import jsdom from 'jsdom'

const { JSDOM } = jsdom

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
    const year = getCurrentSeason()
    const res = await fetch(`https://www.espn.co.uk/nba/team/stats/_/name/den/season/${year}/seasontype/2`)
    const dom = new JSDOM(await res.text())

    // if season has not started the page will not exist and will be routed to the last season
    // so we need to check that the page is correct
    const title = dom.window.document.querySelector('title')?.textContent
    const pageYear = title?.split('-')[1]
    if (pageYear !== (year - 2000).toString()) {
        console.log(pageYear, year)
        console.log('Season has not started yet')
        return []
    }

    const tables = dom.window.document.querySelectorAll('.Table')

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

    const shootingStats: IShootingStatsScrape[] = names.map((name, index) => {
        const statsRow = tables[3].querySelectorAll('.Table__TR')[index + 1]
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
    })

    const seasonAverages: ISeasonAveragesScrape[] = names.map(
        (name, index) => ({
            player_name: name,
            ...gameStats[index],
            ...shootingStats[index],
        })
    )

    return seasonAverages
}
