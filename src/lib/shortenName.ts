/**
 * @description Shortens a name to first initial and last name
 * @param name string should be in format of "First Last"
 * @returns string
 */
export const shortenName = (name: string): string => {
    if (!name.includes(' ')) return name

    const [first, ...last] = name.split(' ')

    return `${first[0]}. ${last.join(' ')}`
}
