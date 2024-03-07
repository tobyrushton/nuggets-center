import type { Handler, APIGatewayProxyResultV2 } from 'aws-lambda'
import { updateGameStats } from '../functions/update-game-stats'
import { updatePlayers } from '../functions/update-player'
import { updateSeasonAverages } from '../functions/update-season-averages'
import { updateSchedule } from '../functions/update-schedule'

export const handler: Handler = async (): Promise<APIGatewayProxyResultV2> => {
    try {
        await Promise.all([
            updateGameStats(),
            updatePlayers(),
            updateSeasonAverages(),
            updateSchedule(),
        ])
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        }
    }
}
