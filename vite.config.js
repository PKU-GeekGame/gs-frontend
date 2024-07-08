import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {compression} from 'vite-plugin-compression2'
import zlib from 'zlib';

//const API_URL = 'http://localhost:8010';
const API_URL = 'https://geekgame.pku.edu.cn';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
            sourcemap: process.env.GENERATE_SOURCEMAP!=='false',
            chunkSizeWarningLimit: 1500,
            reportCompressedSize: false,
            rollupOptions: {
                output: {
                    compact: true,
                    generatedCode: 'es2015',
                    manualChunks: {
                        vendor: ['antd', '@ant-design/icons', 'react', 'react-dom', 'react-router-dom', 'react-transition-group', 'react-lazyload', 'react-timeago'],
                    },
                }
            },
            minify: 'terser',
        },
        esbuild: {
            legalComments: 'none',
        },
        plugins: [
            react(),
            compression({
                include: /\.*$/,
                exclude: /\.(png|jpg|jpeg)$/i,
                algorithm: 'brotliCompress',
                compressionOptions: {
                    params: {
                        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                        [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
                    },
                },
            }),
        ],
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
