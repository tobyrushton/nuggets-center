declare global {
    namespace NodeJS {
        interface ProcessEnv {
            VERCEL_URL: string
            NODE_ENV: 'development' | 'production'
        }
    }
}

export {}