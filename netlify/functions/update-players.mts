import { Config } from '@netlify/functions'
import { updatePlayers } from '../../src/server/functions/update-player'

export default updatePlayers

export const config: Config = {
    schedule: '@weekly',
}
