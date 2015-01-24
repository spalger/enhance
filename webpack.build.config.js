var webpack = require('webpack');
var dirname = require('path').dirname;
var basename = require('path').basename;
var join = require('path').join;

module.exports = function (paths, dev) {
  return {
    devtool: dev ? 'source-map' : null,
    context: paths.SRC,
    entry: paths.ENTRY,
    output: {
      path: dirname(paths.BUNDLE),
      filename: basename(paths.BUNDLE),
      devtoolModuleFilenameTemplate: '[resource-path]',
    },
    module: {
      loaders: [
        // es6 modules
        {
          test: /\.js$/,
          exclude: /node_modules|bower_components/,
          loader: '6to5-loader?experimental&comments=false&loose=classes'
        },

        // less styles
        {
          test: /\.less$/,
          loader: 'style-loader!css-loader!less-loader'
        }
      ]
    },

    // extend the lookup logic to simplify import ids
    //
    // allows `import 'style/main.less'` from anywhere, imports `src/style/main.less`
    resolve: {
      extensions: ['', '.js', '.json'],
      modulesDirectories: ['bower_components', 'node_modules'],
      root: [ join(paths.SRC, 'components'), paths.SRC ],
      alias: {
        reflux: join(paths.ROOT, 'node_modules', 'reflux', 'src', 'index.js')
      }
    },

    // utilize bower.json/main setting for bower_components
    plugins: [
      new webpack.ResolverPlugin([
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
      ])
    ]
  };
};
