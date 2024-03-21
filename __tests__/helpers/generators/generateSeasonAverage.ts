import { faker } from '@faker-js/faker'

export const generateSeasonAverage = (): Omit<
    player.ISeasonAverage,
    'id' | 'player_id' | 'min' | 'season'
> & { player_name: string; min: number } => ({
    player_name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    games_played: faker.number.int({ min: 0, max: 82 }),
    min: faker.number.float({ min: 0, max: 48 }),
    pts: faker.number.float({ min: 0, max: 50 }),
    oreb: faker.number.float({ min: 0, max: 10 }),
    dreb: faker.number.float({ min: 0, max: 20 }),
    reb: faker.number.float({ min: 0, max: 30 }),
    ast: faker.number.float({ min: 0, max: 20 }),
    stl: faker.number.float({ min: 0, max: 10 }),
    blk: faker.number.float({ min: 0, max: 10 }),
    turnover: faker.number.float({ min: 0, max: 10 }),
    pf: faker.number.float({ min: 0, max: 10 }),
    fgm: faker.number.float({ min: 0, max: 20 }),
    fga: faker.number.float({ min: 0, max: 30 }),
    fg_pct: faker.number.float({ min: 0, max: 100 }),
    fg3a: faker.number.float({ min: 0, max: 20 }),
    fg3m: faker.number.float({ min: 0, max: 20 }),
    fg3_pct: faker.number.float({ min: 0, max: 100 }),
    ftm: faker.number.float({ min: 0, max: 20 }),
    fta: faker.number.float({ min: 0, max: 20 }),
    ft_pct: faker.number.float({ min: 0, max: 100 }),
})
