/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'a.espncdn.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
