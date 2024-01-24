import { faker } from "@faker-js/faker";

export const generateGame = () => ({
    date: `${faker.number.int({ min: 1, max: 12 })}/${faker.number.int({ min: 1, max: 28 })}`,
    home: faker.datatype.boolean(),
    opponent_name: `${faker.location.city()} ${faker.word.noun()}`,
})

export const generateGameWithScore = () => ({
    ...generateGame(),
    opponent_score: faker.number.int({ min: 60, max: 150 }),
    home_score: faker.number.int({ min: 60, max: 150 }),
})