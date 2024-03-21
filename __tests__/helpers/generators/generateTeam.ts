import { faker } from '@faker-js/faker'

export const generateTeam = (): { name: string; logo_url: string } => ({
    name: `${faker.location.city()} ${faker.word.noun()}`,
    logo_url: faker.image.url(),
})
