export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'header-max-length': [1, 'always', 100],
		'body-max-line-length': [1, 'always', Infinity],
		'subject-case': [1, 'always', ['lower-case', 'upper-case', 'camel-case', 'kebab-case', 'pascal-case', 'sentence-case', 'snake-case', 'start-case']],
		'body-leading-blank': [1, 'always'],
	},
};
