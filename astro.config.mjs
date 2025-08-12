import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { fileURLToPath } from "node:url";

/** @type {import('astro').AstroUserConfig} */
export default {
    integrations: [react(), tailwind({ applyBaseStyles: false })],
    server: {
        host: true,
        port: 4321
    },
    vite: {
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url))
            }
        },
        server: {
            fs: {
                strict: false
            }
        }
    }
};


