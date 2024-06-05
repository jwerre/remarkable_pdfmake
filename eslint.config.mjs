export default [
	{
		// files: [
		// 	'*.mjs',
		// 	'lib/**/*.mjs',
		// ],
		ignores: ['dist/**/*', 'node_modules/**/*'],
		rules: {
			indent: [
				'error',
				'tab',
				{
					SwitchCase: 1,
				},
			],
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single', { avoidEscape: true }],
			semi: ['error', 'always'],
			'no-console': 'off',
			'no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'none',
					ignoreRestSiblings: false,
				},
			],
		},
	},
];

// {
// 	"extends": "eslint:recommended",
// 	"env": {
// 		"node": true,
// 		"mocha": true,
// 		"es6": true
// 	},
// 	"parserOptions": {
// 		"ecmaVersion": 8,
// 		"sourceType": "module",
// 		"ecmaFeatures" : {
// 			"globalReturn": false,
// 			"impliedStrict": true,
// 			"jsx": false
// 		}
// 	},
// 	"rules": {
// 		"indent": [
// 			"error",
// 			"tab",
// 			{
// 				"SwitchCase": 1
// 			}
// 		],
// 		"linebreak-style": [
// 			"error",
// 			"unix"
// 		],
// 		"quotes": [
// 			"error",
// 			"single"
// 		],
// 		"semi": [
// 			"error",
// 			"always"
// 		],
// 		"no-console": "off",

// 		"no-unused-vars": [
// 			"error",
// 			{
// 				"vars": "all",
// 				"args": "none",
// 				"ignoreRestSiblings": false
// 			}
// 		]
// 	}
// }
