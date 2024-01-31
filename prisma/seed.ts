import { updateGameStats } from '../src/server/functions/update-game-stats'
import { updatePlayers } from '../src/server/functions/update-player'
import { updateTeams } from '../src/server/functions/update-teams'
import { updateSchedule } from '../src/server/functions/update-schedule'
import { updateSeasonAverages } from '../src/server/functions/update-season-averages'

const main = async ():Promise<void> => {
    await updateTeams()
    console.log('Teams updated')
    await updatePlayers()
    console.log('Players updated')
    await updateSchedule()
    console.log('Schedule updated')
    await updateGameStats()
    console.log('Game stats updated')
    await updateSeasonAverages()
    console.log('Season averages updated')
}

main()
    .then(() => {
        console.log('Seed successful')
        process.exit(0)
    })
    .catch(e => {
        console.error(e)
        process.exit(1)
    })