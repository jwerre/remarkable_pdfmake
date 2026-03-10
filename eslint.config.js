import js from '@eslint/js';
import globals from 'globals';

export default [
	// 1. Use recommended defaults as a baseline
	js.configs.recommended,
	{
		// 2. Define environment and language options
		languageOptions: {
			ecmaVersion: 2019,
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2015,
			},
		},
		// 3. Define what to ignore globally
		ignores: ['node_modules/**/*', 'dist/**/*'],
		// 4. Custom Rules
		rules: {
			indent: ['error', 'tab', { SwitchCase: 1 }],
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single', { avoidEscape: true }],
			semi: ['error', 'always'],
			'no-console': 'warn', // Changed to 'warn' to keep production logs clean
			'no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'none',
					ignoreRestSiblings: false,
				},
			],
			// Recommendation: Ensure you use file extensions for ESM compatibility
			'import/extensions': 'off',
		},
	},
];
