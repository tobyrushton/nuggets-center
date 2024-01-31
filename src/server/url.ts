export const url =
    process.env.NODE_ENV === 'production'
        ? 'https://visionary-manatee-0747fe.netlify.app/api/trpc'
        : 'http://localhost:3000/api/trpc'
