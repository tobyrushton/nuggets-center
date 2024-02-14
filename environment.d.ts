declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_VERCEL_URL: string
            NODE_ENV: 'development' | 'production'
        }
    }
}

export {}