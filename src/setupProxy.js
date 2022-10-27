// only used for developing, see:
// https://create-react-app.dev/docs/proxying-api-requests-in-development#configuring-the-proxy-manually

const { createProxyMiddleware } = require('http-proxy-middleware');

const API_URL = 'http://localhost:8010';

module.exports = function(app) {
    app.use(
        '/service',
        createProxyMiddleware('/service', {
            target: API_URL,
            changeOrigin: true,
            ws: true,
        })
    );
};