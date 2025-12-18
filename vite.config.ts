import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
                'resources/js/Pages/Home.jsx',
            ],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],

    base: '/build/',

    build: {
        manifest: true,
        outDir: '../public_html/build',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                app: 'resources/js/app.jsx',
                home: 'resources/js/Pages/Home.jsx'
            }
        }
    },

    esbuild: {
        jsx: 'automatic'
    },

    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy')
        }
    }
});