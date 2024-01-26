import { Config } from '@netlify/functions'
import { updateSchedule } from '../../src/server/functions/update-schedule'

export default updateSchedule

export const config: Config = {
    schedule: '@weekly',
}
