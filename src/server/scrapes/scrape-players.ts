import puppeteer from 'puppeteer'
import { round } from '@/lib/round'

interface IPlayerScrape {
    first_name: string
    last_name: string
    position: string
    weight: number
    height_feet: number
    height_inches: number
    profile_url: string
}

/**
 * Scrape player data from ESPN
 * @returns {Promise<IPlayerScrape[]>} Array of player data
 */
export const scrapePlayers = async (): Promise<IPlayerScrape[]> => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(
        'https://www.espn.co.uk/nba/team/roster/_/name/den/denver-nuggets'
    )
    await page.exposeFunction('round', round)

    const players = await page.evaluate(async () => {
        const rosterTableBody =
            window.document.querySelectorAll('.Table__TBODY tr')

        const playerScrape: IPlayerScrape[] = []

        for (let i = 0; i < rosterTableBody.length; i++) {
            const row = rosterTableBody[i]
            const profileUrl = row.querySelector('img')?.getAttribute('alt')
            const name = row.querySelector('td:nth-child(2) a')?.textContent
            const position = row.querySelector('td:nth-child(3)')?.textContent
            const heightMeters = row
                .querySelector('td:nth-child(5)')
                ?.textContent?.split(' ')[0]
            const weightKG = row
                .querySelector('td:nth-child(6)')
                ?.textContent?.split(' ')[0]

            const weight = weightKG
                ? parseFloat((parseInt(weightKG, 10) * 2.20462).toFixed(0))
                : 0
            const feet = heightMeters ? parseFloat(heightMeters) * 3.28084 : 0
            const heightFeet = feet ? Math.floor(feet) : 0
            const heightInches = feet ? Math.round((feet - heightFeet) * 12) : 0

            if (!name) throw new Error(`Invalid name: ${name}`)
            if (!position) throw new Error(`Invalid position: ${position}`)
            if (!weight) throw new Error(`Invalid weight: ${weight}`)
            if (!heightFeet)
                throw new Error(`Invalid heightFeet: ${heightFeet}`)
            if (!heightInches)
                throw new Error(`Invalid heightInches: ${heightInches}`)
            if (!profileUrl)
                throw new Error(`Invalid profileUrl: ${profileUrl}`)

            const index = name.indexOf(' ')
            const [firstName, lastName] = [
                name.slice(0, index),
                name.slice(index + 1),
            ]

            playerScrape.push({
                first_name: firstName,
                last_name: lastName,
                position: position || '',
                weight,
                height_feet: heightFeet,
                height_inches: heightInches,
                profile_url: profileUrl,
            })
        }

        return playerScrape
    })

    await browser.close()

    return players
}
