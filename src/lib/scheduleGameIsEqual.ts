interface IGameNoIds extends Omit<team.IGame, 'id' | 'opponent_id'> {}

/**
 * Checks if two schedule games are equal.
 * @param game1 - The first game to compare.
 * @param game2 - The second game to compare.
 * @returns True if the games are equal, false otherwise.
 */
export const scheduleGameIsEqual = (
    game1: IGameNoIds,
    game2: IGameNoIds
): boolean =>
    game1.date === game2.date &&
    game1.home === game2.home &&
    game1.home_score === game2.home_score &&
    game1.opponent_score === game2.opponent_score
