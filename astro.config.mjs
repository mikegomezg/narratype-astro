import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from '@astrojs/node';
import { fileURLToPath } from "node:url";

export default defineConfig({
    integrations: [react(), tailwind({ applyBaseStyles: false })],
    output: 'server',
    adapter: node({ mode: 'standalone' }),
    experimental: { session: true },
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
});


