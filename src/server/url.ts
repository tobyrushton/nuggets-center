export const url =
    process.env.NODE_ENV === 'production'
        ? 'https://nuggets-center.vercel.app/api/trpc'
        : 'http://localhost:3000/api/trpc'
