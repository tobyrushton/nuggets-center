import { describe, it, expect, vi } from 'vitest'
import { getCurrentSeason } from '@/lib/getCurrentSeason'


describe('getCurrentSeason', () => {
    it('should return the correct season when its the year behind', () => {
        vi.useFakeTimers().setSystemTime(new Date('2023-10-10'))
        const season = getCurrentSeason()
        expect(season).toBe(2024)
    })

    it('should return the correct season when its the current year', () => {
        vi.useFakeTimers().setSystemTime(new Date('2024-01-01'))
        const season = getCurrentSeason()
        expect(season).toBe(2024)
    })
})
