import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {compression} from 'vite-plugin-compression2'
import {createHtmlPlugin} from 'vite-plugin-html';
import zlib from 'zlib';
import fs from 'fs';
import {minify_sync} from 'terser';

import {WISH_ROOT, TEMPLATE_ROOT, WISH_VER} from './src/api_config';

const API_ENV = process.env['VITE_APP_MOCK_API_ENV'] || null;
const API_URL = API_ENV ? process.env['MOCK_API_URL_'+API_ENV] : 'https://geekgame.pku.edu.cn';
const API_COOKIE = API_ENV ? (process.env['MOCK_API_COOKIE_'+API_ENV] || null) : null;

const preload_script_src = minify_sync(
    fs.readFileSync('src/index-preloaded.js', 'utf-8')
        .replace(/\{__WISH_ROOT__}/g, WISH_ROOT)
        .replace(/\{__WISH_VER__}/g, WISH_VER)
        .replace(/\{__TEMPLATE_ROOT__}/g, TEMPLATE_ROOT)
).code;

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
            terserOptions: {
                ecma: 2020,
                module: true,
                compress: {
                    passes: 2,
                },
            },
        },
        esbuild: {
            legalComments: 'none',
        },
        plugins: [
            react(),
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        PRELOAD_SCRIPT: preload_script_src,
                    },
                },
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
