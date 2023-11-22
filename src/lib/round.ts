/** Round number
 * @param {number} num - Number to round
 * @param {number} places - Number of decimal places to round to, default 2
 */
export const round = (num: number, places: number = 2): number =>
    parseFloat(num.toFixed(places))
