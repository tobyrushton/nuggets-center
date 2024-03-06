import puppeteer from 'puppeteer'

interface ITeamScrape {
    name: string
    logo_url: string
}

export const scrapeTeams = async (): Promise<ITeamScrape[]> => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://www.espn.co.uk/nba/teams')

    const teams = await page.evaluate(() => {
        const teamLinks = window.document.querySelectorAll('.TeamLinks')
        const teamsScrape: ITeamScrape[] = []
        teamLinks.forEach(teamLink => {
            const teamName = teamLink.querySelector('h2')?.innerHTML

            // gets team abbreviation in order to get the link to the teams logo
            const linkToTeam = teamLink.querySelector('a')?.getAttribute('href')
            const teamAbbreviation = linkToTeam?.split('/')[5]

            const teamLogo = `https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${teamAbbreviation}.png`

            if (teamName && teamLogo) {
                teamsScrape.push({
                    name: teamName,
                    logo_url: teamLogo,
                })
            }
        })

        return teamsScrape
    })

    await browser.close()

    return teams
}
