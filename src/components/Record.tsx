import 'server-only'
import { FC } from 'react'
import { serverClient } from '@/app/_trpc/serverClient'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

export const RecordSkeleton: FC = async () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Record</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-10" />-
                    <Skeleton className="h-6 w-10" />
                </div>
            </CardContent>
        </Card>
    )
}

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
