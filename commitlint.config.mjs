export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'header-max-length': [2, 'always', 200],
		'subject-case': [2, 'always', ['lower-case', 'upper-case', 'camel-case', 'kebab-case', 'pascal-case', 'sentence-case', 'snake-case', 'start-case']],
	},
};
