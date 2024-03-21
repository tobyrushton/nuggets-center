import { ImageResponse } from 'next/og'
import { serverClient } from '@/app/_trpc/serverClient'
import { TeamPageProps } from './page'

export const alt = 'Team Logo'
export const size = {
    width: 256,
    height: 256,
}

export const contentType = 'image/png'

const Image = async ({
    params: { id },
}: TeamPageProps): Promise<ImageResponse> => {
    const { team } = await serverClient.getTeam({ id })

    return new ImageResponse(
        (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={team.logo_url}
                alt={team.name}
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
