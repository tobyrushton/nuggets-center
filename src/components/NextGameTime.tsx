'use client'

import { FC } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

interface INextGameTimeProps {
    // should be in ISO format
    nextGameTime: string
}

export const NextGameTime: FC<INextGameTimeProps> = ({ nextGameTime }) => {
    const tz = dayjs.tz.guess()
    return <>{dayjs(nextGameTime).tz(tz).format('dddd MMM D [at] h A')}</>
}
