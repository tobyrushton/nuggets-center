/* eslint @typescript-eslint/no-unused-vars: 0 */
// disabled rule due to it producing error

namespace team {
    interface ITeam {
        id: number
        name: string
        logo_url: string
    }

    interface IGame {
        id: string
        date: string
        home: boolean
        opponent_id: number
        opponent_score: number
        home_score: number
        season: number
    }
}
