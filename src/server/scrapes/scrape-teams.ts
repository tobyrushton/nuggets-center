import jsdom from 'jsdom'

const { JSDOM } = jsdom

interface ITeamScrape {
    name: string
    logo_url: string
}

export const scrapeTeams = async ():Promise<ITeamScrape[]> => {
    const res = await fetch('https://www.espn.co.uk/nba/teams')
    const dom = new JSDOM(await res.text())
    const teamLinks = dom.window.document.querySelectorAll('.TeamLinks')

    const teams: ITeamScrape[] = []
    teamLinks.forEach((teamLink) => {
        const teamName = teamLink.querySelector('h2')?.innerHTML

        // gets team abbreviation in order to get the link to the teams logo
        const linkToTeam = teamLink.querySelector('a')?.getAttribute('href')
        const teamAbbreviation = linkToTeam?.split('/')[5]
        
        const teamLogo = `https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${teamAbbreviation}.png`

        if (teamName && teamLogo) {
            teams.push({
                name: teamName,
                logo_url: teamLogo,
            })
        }
    })
    
    return teams
}