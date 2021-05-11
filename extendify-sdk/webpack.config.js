const webpack = require('webpack')
const path = require('path')
const NODE_ENV = process.env.NODE_ENV || 'development'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageminPlugin = require('imagemin-webpack')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')

/**
 * Utility methods for use when generating build configuration objects.
 */
const { join } = require('path')

/**
 * Given a string, returns a new string with dash separators converted to
 * camel-case equivalent. This is not as aggressive as `_.camelCase`, which
 * which would also upper-case letters following numbers.
 *
 * @param {string} string Input dash-delimited string.
 *
 * @return {string} Camel-cased string.
 */
const camelCaseDash = (string) => string.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase())

/**
 * Define externals to load components through the wp global.
 */
const externals = [
    'api-fetch',
    'block-editor',
    'blocks',
    'components',
    'compose',
    'data',
    'date',
    'htmlEntities',
    'hooks',
    'edit-post',
    'element',
    'editor',
    'i18n',
    'plugins',
    'viewport',
    'ajax',
    'codeEditor',
    'rich-text',
].reduce(
    (externals, name) => ({
        ...externals,
        [`@wordpress/${name}`]: `wp.${camelCaseDash(name)}`,
    }),
    {
        wp: 'wp',
        lodash: 'lodash', // WP loads lodash already.
        fetch: 'fetch', // Used in our debugger sidebar.
        react: 'React',
        'react-dom': 'ReactDOM',
    },
)

module.exports = externals

module.exports = {
    mode: NODE_ENV,
    entry: {
        ['extendify-sdk']: ['./src/index.js', './src/style.scss'],
    },
    output: {
        path: path.join(__dirname, './public/build'),
        filename: '[name].js',
    },
    externals: {
        lodash: 'lodash',
        ...externals,
    },

    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'], // Settings are in .svgrrc
            },
            {
                test: /.js?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                                '@babel/plugin-transform-async-to-generator',
                                '@babel/plugin-proposal-object-rest-spread',
                                [
                                    '@babel/plugin-transform-react-jsx',
                                    {
                                        pragma: 'wp.element.createElement',
                                    },
                                ],
                            ],
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ["postcss-preset-env"],
                            }
                        },
                    },
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new RemoveEmptyScriptsPlugin(),
        new ImageminPlugin({
            bail: false,
            cache: true,
            imageminOptions: {
                plugins: [['pngquant', { quality: [0.5, 0.5] }]],
            },
        }),
    ],
}
