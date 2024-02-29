'use client'

import { FC } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export interface GameDateProps {
    date: Date
}

export const GameDate: FC<GameDateProps> = ({ date }) => {
    const tz = dayjs.tz.guess()
    return <>{dayjs(date).tz(tz).format('dddd, MMMM D, YYYY [at] h:mm A')}</>
}
