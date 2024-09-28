// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ISeasonAverageNoId extends Omit<player.ISeasonAverage, 'player_id'> {}

/**
 * Checks if two player season averages are equal.
 * @param first - The first player season average.
 * @param second - The second player season average.
 * @returns True if the season averages are equal, false otherwise.
 */
export const seasonAverageIsEqual = (
    first: ISeasonAverageNoId,
    second: ISeasonAverageNoId
): boolean =>
    first.games_played === second.games_played &&
    first.season === second.season &&
    first.min === second.min &&
    first.fgm === second.fgm &&
    first.fga === second.fga &&
    first.fg3m === second.fg3m &&
    first.fg3a === second.fg3a &&
    first.ftm === second.ftm &&
    first.fta === second.fta &&
    first.oreb === second.oreb &&
    first.dreb === second.dreb &&
    first.reb === second.reb &&
    first.ast === second.ast &&
    first.stl === second.stl &&
    first.blk === second.blk &&
    first.turnover === second.turnover &&
    first.pf === second.pf &&
    first.pts === second.pts &&
    first.fg_pct === second.fg_pct &&
    first.fg3_pct === second.fg3_pct &&
    first.ft_pct === second.ft_pct
