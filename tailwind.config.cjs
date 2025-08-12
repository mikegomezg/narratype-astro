/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
        "./*.{astro,html}"
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#f5f7ff",
                    100: "#e8edff",
                    200: "#cdd9ff",
                    300: "#aebfff",
                    400: "#879fff",
                    500: "#667fff",
                    600: "#4a5ff1",
                    700: "#3946c9",
                    800: "#303ca1",
                    900: "#2b3580"
                }
            }
        }
    },
    plugins: []
};


