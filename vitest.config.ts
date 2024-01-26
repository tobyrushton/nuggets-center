import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    test: {
        include: ['./__tests__/**/*.test.ts', '!__tests__/integration/**/*'],
        setupFiles: ['./__tests__/singleton.ts'],
        pool: 'forks'
    },
    plugins: [tsconfigPaths()]
})