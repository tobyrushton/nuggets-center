/**
 * @description returns the date of the game
 * @param {string} date - the date of the game in format mm/dd
 */
export const getDateOfGame = (date: string): Date => {
    const month = new Date(date).getMonth()

    const todaysYear = new Date().getFullYear()
    const todaysMonth = new Date().getMonth()

    let year: number = 0

    if (todaysMonth > 6) {
        if (month > 6) year = todaysYear
        else year = todaysYear + 1
    } else if (month > 6) year = todaysYear - 1
    else year = todaysYear

    return new Date(`${date} ${year}`)
}
