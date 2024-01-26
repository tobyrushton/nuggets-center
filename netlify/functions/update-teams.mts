import { Config } from '@netlify/functions'
import { updateTeams } from '../../src/server/functions/update-teams'

export default updateTeams

export const config: Config = {
    schedule: '@monthly',
}
