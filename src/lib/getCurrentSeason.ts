/**
 * Returns the current season based on the current month and year.
 * If the current month is greater than or equal to August (8th month),
 * it returns the next year as the current season.
 * Otherwise, it returns the current year as the current season.
 * @returns The current season as a number.
 */
export const getCurrentSeason = (): number => {
    const date = new Date()

    const currentMonth = date.getMonth()
    const currentyear = date.getFullYear()

    if (currentMonth >= 8) {
        return currentyear + 1
    }
    return currentyear
}
