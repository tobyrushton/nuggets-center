import { faker } from '@faker-js/faker'
import { IScheduleScrape } from '@/server/scrapes/scrape-schedule'

export const generateGame = (teamNames: string[]) => ({
    date: `${faker.number.int({ min: 1, max: 12 })}/${faker.number.int({ min: 1, max: 28 })}`,
    home: faker.datatype.boolean(),
    opponent_name: faker.helpers.arrayElement(teamNames),
})

export const generateGameWithScore = (teamNames: string[]) => ({
    ...generateGame(teamNames),
    opponent_score: faker.number.int({ min: 60, max: 150 }),
    home_score: faker.number.int({ min: 60, max: 150 }),
})

export const validateSchedule = (
    schedule: IScheduleScrape[]
): IScheduleScrape[] => {
    const dates = new Map<string, boolean>()

    return schedule.map(game => {
        if (dates.has(game.date)) {
            let newDate = `${faker.number.int({ min: 1, max: 12 })}/${faker.number.int({ min: 1, max: 28 })}`
            while (dates.has(newDate))
                newDate = `${faker.number.int({ min: 1, max: 12 })}/${faker.number.int({ min: 1, max: 28 })}`
            dates.set(newDate, true)
            return { ...game, date: newDate }
        }
        dates.set(game.date, true)
        return game
    })
}
