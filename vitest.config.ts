import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    test: {
        setupFiles: ['./__tests__/singleton.ts'],
    },
    plugins: [tsconfigPaths()]
})