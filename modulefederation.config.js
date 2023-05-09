const deps=require("./package.json").dependencies;

module.exports = {
    name: "guiding-star-site-main",
    remotes: {},
    shared: {
        react: {
            eager: true,
            import: 'react',
            singleton: true,
            requiredVersion: deps["react"],
        },
        antd: {
            import: 'antd',
            singleton: true,
            requiredVersion: deps["antd"],
        },
    },
};
