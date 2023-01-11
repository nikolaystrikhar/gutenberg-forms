/** @type {import('tailwindcss').Config} */

module.exports = {
	prefix: 'gufo-',
	content: [
		"./*.php",
		"./**/*.php",
		"./components/*.js",
		"./layout/*.js",
		"./pages/*.js",
		"./pages/**/*.js",
	],
	theme: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
}
