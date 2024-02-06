import 'server-only'
import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export const Record: FC = async () => {
    const { wins, losses } = await serverClient.getRecord()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Record</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    {wins} - {losses}
                </p>
            </CardContent>
        </Card>
    )
}
