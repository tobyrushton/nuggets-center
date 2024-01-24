import { faker } from '@faker-js/faker'

const positions = ['PG', 'SG', 'SF', 'PF', 'C']

export const generatePlayer = () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    position: faker.helpers.arrayElement(positions),
    height_feet: faker.number.int({ min: 6, max: 7 }),
    height_inches: faker.number.int({ min: 0, max: 11 }),
    weight: faker.number.int({ min: 180, max: 300 }),
    profile_url: faker.image.url(),
})
