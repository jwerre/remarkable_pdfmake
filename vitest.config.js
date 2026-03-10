import { defineConfig } from 'vitest/config';

const TEST_ROOT = 'test';

export default defineConfig({
	test: {
		include: [`${TEST_ROOT}/**/*.{test,spec}.js`],

		// Environment
		environment: 'node',

		// Reporter
		reporters: ['verbose'],

		// Global variables
		globals: true,
	},
});
