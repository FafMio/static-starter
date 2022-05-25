module.exports = {
    entry: 'index.js',
    // ...
    module: {
        rules: [
            {
                test: /\.twig$/,
                use: [
                    {
                        loader: 'twing-loader',
                        options: {
                            environmentModulePath: require.resolve('./environment.js'),
                        }
                    }
                ]
            }
        ]
    }
}