import { faker } from '@faker-js/faker'

export const generateTeam = () => ({
    name: `${faker.location.city()} ${faker.word.noun()}`,
    logo_url: faker.image.url(),
})