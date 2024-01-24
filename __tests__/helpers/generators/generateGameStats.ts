import { faker } from '@faker-js/faker'

export const generateGameStats = () => ({
    pts: faker.number.int({ min: 0, max: 50 }),
    ast: faker.number.int({ min: 0, max: 20 }),
    reb: faker.number.int({ min: 0, max: 30 }),
    stl: faker.number.int({ min: 0, max: 10 }),
    blk: faker.number.int({ min: 0, max: 10 }),
    turnover: faker.number.int({ min: 0, max: 10 }),
    pf: faker.number.int({ min: 0, max: 10 }),
    min: faker.number.float({ min: 0, max: 48 }).toString(),
    fgm: faker.number.int({ min: 0, max: 20 }),
    fga: faker.number.int({ min: 0, max: 30 }),
    fg3m: faker.number.int({ min: 0, max: 20 }),
    fg3a: faker.number.int({ min: 0, max: 20 }),
    ftm: faker.number.int({ min: 0, max: 20 }),
    fta: faker.number.int({ min: 0, max: 20 }),
    fg_pct: faker.number.float({ min: 0, max: 100 }),
    fg3_pct: faker.number.float({ min: 0, max: 100 }),
    ft_pct: faker.number.float({ min: 0, max: 100 }),
    date: `${faker.number.int({ min: 1, max: 12 })}/${faker.number.int({ min: 1, max: 28 })}`,
})
