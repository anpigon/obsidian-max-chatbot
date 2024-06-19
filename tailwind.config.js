/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			keyframes: {
				blink: {
					'0%, 100%': {opacity: 1},
					'49.9%': {opacity: 1},
					'50%, 50.1%': {opacity: 0},
				},
			},
			animation: {
				blink: 'blink 1.3s infinite',
			},
		},
	},
	corePlugins: {
		preflight: false,
	},
	plugins: [require('daisyui')],
};
