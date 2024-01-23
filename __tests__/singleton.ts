import { PrismaClient } from '@prisma/client'
import { vi, beforeEach } from 'vitest'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'
import prisma from '../src/server/db/client'

vi.mock('../src/server/db/client', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
    mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>