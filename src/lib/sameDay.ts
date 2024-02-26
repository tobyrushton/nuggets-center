import dayjs from 'dayjs'

export const sameDay = (d1: string, d2: string): boolean => {
    if (d1.split('T')[0] === d2.split('T')[0]) return true
    // espn shows dates according to uk time,
    // so we need to check if the dates are within 20 hours of each other
    const date1 = dayjs(d1)
    const diff = date1.diff(d2, 'h')
    return Math.abs(diff) <= 20
}
