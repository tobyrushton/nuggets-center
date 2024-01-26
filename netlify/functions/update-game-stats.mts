import { updateGameStats } from '../../src/server/functions/update-game-stats'

export default updateGameStats

export const config = {
    schedule: '@daily',
}
