import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {compression} from 'vite-plugin-compression2'
import {createHtmlPlugin} from 'vite-plugin-html';
import {resolve} from 'path';
import zlib from 'zlib';

const API_ENV = process.env['MOCK_API_ENV'] || 'DEV';
const API_URL = process.env['MOCK_API_URL_'+API_ENV] || 'https://geekgame.pku.edu.cn';
const API_COOKIE = process.env['MOCK_API_COOKIE_'+API_ENV] || '';

export default defineConfig(() => {
    return {
        build: {
            target: ['es2020', 'firefox78', 'chrome79', 'safari13'],
            outDir: 'build',
            assetsInlineLimit: 8192,
            sourcemap: process.env.GENERATE_SOURCEMAP!=='false',
            chunkSizeWarningLimit: 1500,
            reportCompressedSize: false,
            rollupOptions: {
                output: {
                    compact: true,
                    generatedCode: 'es2015',
                    manualChunks: {
                        vendor: ['antd', '@ant-design/icons', 'react', 'react-dom', 'react-router-dom', 'react-transition-group', 'react-lazyload', 'react-timeago'],
                        Table: ['antd/es/table', 'antd/es/tree', 'antd/es/tree-select', 'rc-tree', './src/widget/Table'],
                    },
                },
            },
            minify: 'terser',
        },
        resolve: {
            alias: [{
                find: /^(\.\/(?:noFound|serverError|unauthorized))$/,
                replacement: '$1',
                customResolver: (source, importer, options) => {
                    if(importer && /\/node_modules\/antd\/es\/result\/index\.js$/.test(importer)) {
                        return resolve(__dirname, 'src/empty.js');
                    }
                    return null;
                },
            }],
        },
        esbuild: {
            legalComments: 'none',
        },
        plugins: [
            react(),
            createHtmlPlugin({
                minify: true,
            }),
            compression({
                include: /\.*$/,
                exclude: /\.(png|jpg|jpeg|webp|mp3|ogg|webm)$/i,
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
            host: '0.0.0.0',
            port: 3000,
            proxy: {
                '/service': {
                    target: API_URL,
                    changeOrigin: true,
                    ws: true,
                    headers: API_COOKIE ? {'Cookie': API_COOKIE} : {},
                },
            },
        },
    };
});
