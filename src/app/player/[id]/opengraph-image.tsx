import { ImageResponse } from 'next/og'
import { serverClient } from '@/app/_trpc/serverClient'
import { PlayerPageProps } from './page'

export const runtime = 'edge'

export const alt = 'Player Image'

export const size = {
    width: 600,
    height: 436,
}

export const contentType = 'image/png'

const Image = async ({
    params: { id },
}: PlayerPageProps): Promise<ImageResponse> => {
    const { profile_url, first_name, last_name } = await serverClient.getPlayer(
        { id }
    )
    return new ImageResponse(
        <img src={profile_url} width={size.width} height={size.height} />,
        {
            ...size,
        }
    )
}

export default Image
