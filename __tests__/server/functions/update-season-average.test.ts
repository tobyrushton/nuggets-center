import { describe, it, expect, vi, Mock, beforeAll } from 'vitest'
import { faker } from '@faker-js/faker'
import { scrapeSeasonAverages } from '../../../src/server/scrapes/scrape-season-averages'
import { updateSeasonAverages } from '../../../src/server/functions/update-season-averages'
import { prismaMock } from '../../singleton'
import { generateSeasonAverage, generatePlayer } from '../../helpers/generators'

vi.mock('../../../src/server/scrapes/scrape-season-averages', () => ({
    scrapeSeasonAverages: vi.fn(),
}))

const mockSeasonAverages = Array.from({ length: 10 }, generateSeasonAverage)

describe('updateSeasonAverages', () => {
    beforeAll(() => {
        vi.useFakeTimers().setSystemTime(new Date('2023-01-01'))
    })

    it('should update season averages', async () => {
        // eslint-disable-next-line
        (scrapeSeasonAverages as Mock).mockResolvedValue(mockSeasonAverages)
        const mockSeasonAveragesInDb = mockSeasonAverages.map(
            ({ player_name, ...seasonAverage }) => ({
                ...seasonAverage,
                id: faker.string.uuid(),
                season: 2023,
                min: seasonAverage.min.toString(),
                player_id: faker.string.uuid(),
                games_played: 100, // this should cause an update
                player: {
                    ...generatePlayer(),
                    id: faker.string.uuid(),
                    first_name: player_name.slice(0, player_name.indexOf(' ')),
                    last_name: player_name.slice(player_name.indexOf(' ') + 1),
                },
            })
        )
        prismaMock.seasonAverages.findMany.mockResolvedValue(
            mockSeasonAveragesInDb
        )

        await updateSeasonAverages()

        expect(prismaMock.seasonAverages.createMany).not.toHaveBeenCalled()

        mockSeasonAverages.forEach(
            ({ player_name: _, ...seasonAverage }, index) => {
                expect(prismaMock.seasonAverages.update).toHaveBeenCalledWith({
                    data: {
                        ...seasonAverage,
                        player_id: mockSeasonAveragesInDb[index].player_id,
                        id: mockSeasonAveragesInDb[index].id,
                        season: 2023,
                        min: seasonAverage.min.toString(),
                    },
                    where: {
                        id: mockSeasonAveragesInDb[index].id,
                    },
                })
            }
        )
    })

    it('should not update season averages if season averages are already in db', async () => {
        const mockSeasonAveragesInDb = mockSeasonAverages.map(
            ({ player_name, ...seasonAverage }) => ({
                ...seasonAverage,
                id: faker.string.uuid(),
                season: 2023,
                min: seasonAverage.min.toString(),
                player_id: faker.string.uuid(),
                player: {
                    ...generatePlayer(),
                    id: faker.string.uuid(),
                    first_name: player_name.slice(0, player_name.indexOf(' ')),
                    last_name: player_name.slice(player_name.indexOf(' ') + 1),
                },
            })
        )

        ;(scrapeSeasonAverages as Mock).mockResolvedValue(mockSeasonAverages)
        prismaMock.seasonAverages.findMany.mockResolvedValue(
            mockSeasonAveragesInDb
        )

        await updateSeasonAverages()

        expect(prismaMock.seasonAverages.update).toHaveBeenCalledTimes(0)
    })

    it('should create new season averages if season averages are not in db', async () => {
        const newMockSeasonAverages = [
            ...mockSeasonAverages,
            generateSeasonAverage(),
        ]
        ;(scrapeSeasonAverages as Mock).mockResolvedValue(newMockSeasonAverages)
        const mockSeasonAveragesInDb = mockSeasonAverages.map(
            ({ player_name, ...seasonAverage }) => ({
                ...seasonAverage,
                id: faker.string.uuid(),
                season: 2023,
                min: seasonAverage.min.toString(),
                player_id: faker.string.uuid(),
                player: {
                    ...generatePlayer(),
                    id: faker.string.uuid(),
                    first_name: player_name.slice(0, player_name.indexOf(' ')),
                    last_name: player_name.slice(player_name.indexOf(' ') + 1),
                },
            })
        )
        prismaMock.seasonAverages.findMany.mockResolvedValue(
            mockSeasonAveragesInDb
        )
        const mockPlayer = {
            ...generatePlayer(),
            id: faker.string.uuid(),
            first_name: newMockSeasonAverages[
                newMockSeasonAverages.length - 1
            ].player_name.slice(
                0,
                newMockSeasonAverages[
                    newMockSeasonAverages.length - 1
                ].player_name.indexOf(' ')
            ),
            last_name: newMockSeasonAverages[
                newMockSeasonAverages.length - 1
            ].player_name.slice(
                newMockSeasonAverages[
                    newMockSeasonAverages.length - 1
                ].player_name.indexOf(' ') + 1
            ),
        }
        prismaMock.player.findFirst.mockResolvedValue(mockPlayer)

        const { player_name: _, ...newSeasonAverage } =
            newMockSeasonAverages[newMockSeasonAverages.length - 1]

        await updateSeasonAverages()

        expect(prismaMock.player.findFirst).toHaveBeenCalledWith({
            where: {
                first_name: mockPlayer.first_name,
                last_name: mockPlayer.last_name,
            },
        })
        expect(prismaMock.seasonAverages.create).toHaveBeenCalledTimes(1)
        expect(prismaMock.seasonAverages.create).toHaveBeenCalledWith({
            data: {
                ...newSeasonAverage,
                player_id: mockPlayer.id,
                season: 2023,
                min: newSeasonAverage.min.toString(),
            },
        })
    })
})
