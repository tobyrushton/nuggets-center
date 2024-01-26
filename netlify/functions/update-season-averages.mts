import { Config } from '@netlify/functions'
import { updateSeasonAverages } from '../../src/server/functions/update-season-averages'

export default updateSeasonAverages

export const config: Config = {
    schedule: '@daily',
}
