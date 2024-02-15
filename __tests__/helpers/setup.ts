import { beforeEach, vi } from 'vitest'
import prisma from './prisma'
import resetDb from './reset-db'

vi.mock('../../src/server/db/client', () => ({
    default: prisma
}))

beforeEach(async () => {
    await resetDb()
})
