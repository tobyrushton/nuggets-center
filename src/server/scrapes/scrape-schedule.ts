/* eslint-disable no-await-in-loop */

import puppeteer from 'puppeteer'
import { getCurrentSeason } from '@/lib/getCurrentSeason'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export interface IScheduleScrape {
    date: string
    home: boolean
    opponent_name: string
    opponent_score: number
    home_score: number
}

const convertTime12to24 = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ')

    const [hours, minutes] = time.split(':') as [string, string]

    let newHours = hours

    if (hours === '12') {
        newHours = '00'
    }

    if (modifier === 'PM') {
        newHours = String(parseInt(hours, 10) + 12)
    }

    return `${newHours}:${minutes}`
}

const formatDate = (dateString: string, time: string): string =>
    dayjs.tz(`${dateString} ${time}`, 'America/New_York').toISOString()

/**
 * @description scrapes the schedule from espn.co.uk
 * @returns {Promise<IScheduleScrape[]>} scraped schedule
 */
export const scrapeSchedule = async (): Promise<IScheduleScrape[]> => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(
        `https://www.basketball-reference.com/teams/DEN/${getCurrentSeason()}_games.html`
    )
    await page.exposeFunction('convertTime12to24', convertTime12to24)
    await page.exposeFunction('formatDate', formatDate)

    const schedule = await page.evaluate(async () => {
        const rows = window.document.getElementsByTagName('tr')

        const scheduleScrape: IScheduleScrape[] = []

        for (let i = 0; i < rows.length; i++) {
            const content = rows[i].children

            // dont want to scrape the header rows
            if (
                !(
                    content[0]?.className === 'thead' ||
                    content[0].textContent === 'G'
                )
            ) {
                // data that is the same for bothy completed and uncompleted games
                const dateString = content[1].children[0].textContent as string
                const rawTimeString = content[2].textContent as string
                const formattedTimeString = rawTimeString.replace('p', ' PM')
                const time = await convertTime12to24(formattedTimeString)
                const date = await formatDate(dateString, time)

                const home = content[5].textContent !== '@'

                const opponentName = content[6].children[0]
                    .textContent as string

                const teamScoreRaw = parseInt(
                    content[9].textContent as string,
                    10
                )
                const opponentScoreRaw = parseInt(
                    content[10].textContent as string,
                    10
                )
                const teamScore = Number.isNaN(teamScoreRaw) ? -1 : teamScoreRaw
                const opponentScore = Number.isNaN(opponentScoreRaw)
                    ? -1
                    : opponentScoreRaw

                scheduleScrape.push({
                    date,
                    home,
                    opponent_name: opponentName,
                    opponent_score: home ? opponentScore : teamScore,
                    home_score: home ? teamScore : opponentScore,
                })
            }
        }

        return scheduleScrape
    })

    await browser.close()

    return schedule
}
