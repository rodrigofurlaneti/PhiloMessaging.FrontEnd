/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                philo: {
                    bg: '#0b141a',
                    card: '#1f2c33',
                    input: '#2a3942',
                    primary: '#10b981',
                }
            }
        },
    },
    plugins: [],
}