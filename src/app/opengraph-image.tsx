import { ImageResponse } from 'next/og'
import NextImage from 'next/image'
import nuggets_logo from './nuggets_logo.png'

export const runtime = 'edge'

export const alt = 'Nuggets Center'
export const size = {
    width: 1024,
    height: 721,
}

export const contentType = 'image/png'

const Image = (): ImageResponse =>
    new ImageResponse(
        (
            <NextImage
                src={nuggets_logo}
                alt="Nuggets Center"
                width={size.width}
                height={size.height}
            />
        ),
        {
            ...size,
        }
    )

export default Image
