import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['__tests__/integration/**/*.ts'],
    setupFiles: ['__tests__/helpers/setup.ts'],
    fileParallelism: false,
    testTimeout: 10000
  },
  plugins: [tsconfigPaths()],
})