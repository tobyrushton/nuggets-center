import { ImageResponse } from 'next/og'

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
            <img
                src="./nuggets_logo.png"
                width={size.width}
                height={size.height}
            />
        ),
        {
            ...size,
        }
    )

export default Image
