const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
                'border-radius-base': '4px',
                'box-shadow-base': '0 1px 6px rgba(0, 0, 0, 0.2), 0 3px 12px 0 rgba(0, 0, 0, 0.08)',
                'carousel-dot-height': '8px',
                'animation-duration-slow': '.2s', // modal
                'animation-duration-base': '.14s', // popover
                'animation-duration-fast': '.08s', // tooltip
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};