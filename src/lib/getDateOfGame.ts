/**
 * @description returns the date of the game
 * @param {string} date - the date of the game in format mm/dd
 */
export const getDateOfGame = (date: string): Date => {
    const [month] = date.split('/')
    const monthInt = parseInt(month, 10)

    const todaysYear = new Date().getFullYear()
    const todaysMonth = new Date().getMonth()

    let year: number = 0

    if (todaysMonth > 6) {
        if (monthInt > 6) year = todaysYear
        else year = todaysYear + 1
    } else if (monthInt > 6) year = todaysYear - 1
    else year = todaysYear

    return new Date(`${date} ${year}`)
}
