import type { Handler, APIGatewayProxyResultV2 } from 'aws-lambda'
import { updateTeams } from '../functions/update-teams'

export const handler: Handler = async (): Promise<APIGatewayProxyResultV2> => {
    try {
        await updateTeams()
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
