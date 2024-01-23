import { describe, it, expect, vi } from 'vitest'
import { getDateOfGame } from '../../src/lib/getDateOfGame'

describe('getDateOfGame()', () => {
    it('should return a date object', () => {
        const date = getDateOfGame('10/10')
        expect(date).toBeInstanceOf(Date)
    })

    it('should return a date object with the correct date when correct year', () => {
        vi.useFakeTimers().setSystemTime(new Date('2023-10-01'))
        const date = getDateOfGame('10/10')
        expect(date.getFullYear()).toBe(2023)
        const date2 = getDateOfGame('10/25')
        expect(date2.getFullYear()).toBe(2023)
        const date3 = getDateOfGame('11/12')
        expect(date3.getFullYear()).toBe(2023)
        const date4 = getDateOfGame('12/12')
        expect(date4.getFullYear()).toBe(2023)
    })

    it('should return a date object with the correct date when year ahead', () => {
        vi.useFakeTimers().setSystemTime(new Date('2024-01-01'))
        const date = getDateOfGame('10/10')
        expect(date.getFullYear()).toBe(2023)
        const date2 = getDateOfGame('10/25')
        expect(date2.getFullYear()).toBe(2023)
        const date3 = getDateOfGame('11/12')
        expect(date3.getFullYear()).toBe(2023)
        const date4 = getDateOfGame('12/12')
        expect(date4.getFullYear()).toBe(2023)
    })

    it('should return a date object with the correct date when year behind', () => {
        vi.useFakeTimers().setSystemTime(new Date('2023-10-01'))
        const date = getDateOfGame('01/01')
        expect(date.getFullYear()).toBe(2024)
        const date2 = getDateOfGame('01/25')
        expect(date2.getFullYear()).toBe(2024)
        const date3 = getDateOfGame('02/12')
        expect(date3.getFullYear()).toBe(2024)
        const date4 = getDateOfGame('03/12')
        expect(date4.getFullYear()).toBe(2024)
    })
})
