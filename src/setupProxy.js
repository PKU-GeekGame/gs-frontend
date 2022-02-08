// only used for developing, see:
// https://create-react-app.dev/docs/proxying-api-requests-in-development#configuring-the-proxy-manually

const { createProxyMiddleware } = require('http-proxy-middleware');

const API_URL = 'http://localhost:8000';

module.exports = function(app) {
    app.use(
        '/service',
        createProxyMiddleware({
            target: API_URL,
            changeOrigin: true,
        })
    );
};