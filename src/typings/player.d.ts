/* eslint @typescript-eslint/no-unused-vars: 0 */
// disabled rule due to it producing error

namespace player {
    interface IPlayer {
        id: string
        first_name: string
        last_name: string
        weight: number
        height_feet: number
        height_inches: number
        profile_url: string
    }

    interface ISeasonAverage {
        games_played: number
        player_id: string
        season: number
        min: string
        fgm: number
        fga: number
        fg3m: number
        fg3a: number
        ftm: number
        fta: number
        oreb: number
        dreb: number
        reb: number
        ast: number
        stl: number
        blk: number
        turnover: number
        pf: number
        pts: number
        fg_pct: number
        fg3_pct: number
        ft_pct: number
    }

    interface IGameStats {
        game_id: string
        player_id: string
        pts: number
        reb: number
        ast: number
        stl: number
        blk: number
        turnover: number
        min: string
        fgm: number
        fga: number
        fg3m: number
        fg3a: number
        ftm: number
        fta: number
        pf: number
        oreb: number
        dreb: number
        fg_pct: number
        fg3_pct: number
        ft_pct: number
    }
}
