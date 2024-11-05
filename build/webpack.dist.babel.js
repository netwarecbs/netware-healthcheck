import baseWebpackConfiguration from './webpack.base.babel';
import merge from 'webpack-merge';

export default function () {
    const baseConfiguration = baseWebpackConfiguration();
    return merge(
        baseConfiguration,
        {
            mode: 'production'
        }
    );
}
