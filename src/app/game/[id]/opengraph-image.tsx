import { ImageResponse } from 'next/og'
import NextImage from 'next/image'
import { serverClient } from '@/app/_trpc/serverClient'
import { GamePageProps } from './page'

export const runtime = 'edge'

export const alt = 'Game Image'

export const size = {
    width: 256,
    height: 256,
}

export const contentType = 'image/png'

const Image = async ({
    params: { id },
}: GamePageProps): Promise<ImageResponse> => {
    const { game } = await serverClient.getGame({ id })

    return new ImageResponse(
        (
            <NextImage
                src={game.opponent.logo_url}
                alt={`Denver Nuggets ${game.home ? 'vs' : '@'} ${game.opponent.name}`}
                width={size.width}
                height={size.height}
            />
        ),
        {
            ...size,
        }
    )
}

export default Image
