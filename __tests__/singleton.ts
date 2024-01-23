import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prisma from '../src/server/db/client'

jest.mock('../src/server/db/client', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
    mockReset(prismaMock)
})
