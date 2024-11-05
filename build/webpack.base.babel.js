import Babelrc from './babelrc.json';
import nodeExternals from 'webpack-node-externals';
import path from 'path';

export default function () {
    return {
        target: 'node',
        node: {
            __dirname: false,
            __filename: false
        },
        context: path.join(__dirname, '../src'),
        entry: {
            index: './index.js'
        },
        externals: [nodeExternals()],
        output: {
            path: path.join(__dirname, '../dist/'),
            filename: '[name].js',
            libraryTarget: 'commonjs2'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: Object.assign({}, Babelrc, { babelrc: false })
                    },
                    exclude: /node_modules/
                }
            ]
        }
    };
}
