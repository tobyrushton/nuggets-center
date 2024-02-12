import { PrismaClient } from '@prisma/client'
import prisma from '../db/client'

interface Context {
    prisma: PrismaClient
}

export const createContext = (): Context => ({
    prisma,
})
