namespace team {
    interface ITeam {
        id : number
        name: number
        logo_url: string
    }

    interface IGame {
        id: string
        date: string
        home: boolean
        opponent_id: number
        opponent_name: string
        opponent_logo_url: string
        opponent_score: number
        home_score: number
    }
}