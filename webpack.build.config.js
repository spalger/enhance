var webpack = require('webpack');
var dirname = require('path').dirname;
var join = require('path').join;

module.exports = function (paths, dev) {
  return {
    devtool: dev ? 'source-map' : null,
    context: paths.SRC,
    entry: paths.ENTRY,
    output: {
      path: dirname(paths.BUNDLE),
      filename: "[name].js",
      devtoolModuleFilenameTemplate: '[resource-path]',
    },
    module: {
      loaders: [
        // es6 modules
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!deku-scrub)|bower_components/,
          loader: '6to5-loader?experimental&comments=false&loose=classes'
        },

        {
          test: /\.html$/,
          loader: 'raw-loader'
        },

        // less styles
        {
          test: /\.less$/,
          loader: 'style-loader!css-loader?disableStructuralMinification!less-loader'
        },

        // css styles
        {
          test: /\.css$/,
          exclude: /highlight\.js/,
          loader: 'style-loader!css-loader'
        },

        // raw css styles
        {
          test: /highlight\.js\/.+\.css$/,
          loader: 'raw-loader'
        },

        { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff" },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" }
      ],
      noParse: [
        join(paths.ROOT, 'bower_components', 'pouchdb', 'dist', 'pouchdb.js')
      ]
    },

    // extend the lookup logic to simplify import ids
    //
    // allows `import 'style/main.less'` from anywhere, imports `src/style/main.less`
    resolve: {
      extensions: ['', '.js', '.json'],
      modulesDirectories: ['bower_components', 'node_modules'],
      root: [ join(paths.SRC, 'components'), join(paths.SRC, 'templates'), paths.SRC ],
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
