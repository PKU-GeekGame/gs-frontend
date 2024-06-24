import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

//const API_URL = 'http://localhost:8010';
const API_URL = 'https://geekgame.pku.edu.cn';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
            sourcemap: process.env.GENERATE_SOURCEMAP!=='false',
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                output: {
                    compact: true,
                    generatedCode: 'es2015',
                    manualChunks: {
                        vendor: ['antd', '@ant-design/icons', 'react', 'react-dom', 'react-router-dom', 'react-transition-group', 'react-lazyload', 'react-timeago'],
                    },
                }
            }
        },
        esbuild: {
            legalComments: 'none',
        },
        plugins: [react()],
        server: {
            open: true,
            port: 3000,
            proxy: {
                '/service': {
                    target: API_URL,
                    changeOrigin: true,
                    ws: true,
                },
            },
        },
    };
});
