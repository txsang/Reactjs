const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const dotenv = require('dotenv').config().parsed

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const config = Object.assign(require('./src/constants/config'), dotenv)
const {
  NODE_ENV,
  PORT,
  API_URL
} = config

const sourcePath = path.join(__dirname, './')

let _module = {
  rules: [
    {
      test: /\.(ico|jpg|jpeg|png|eot|ttf|woff|svg)/,
      loader: 'file-loader'
    }, {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: [['es2015', {
          'modules': false
        }], 'react', 'stage-2'],
        plugins: ['transform-runtime', 'transform-decorators-legacy']
      }
    }, {
      test: /\.less$/,
      // use: ['css-loader', 'less-loader']
      use: ExtractTextPlugin.extract({
        use: [
          'css-loader',
          'less-loader'
        ]
      })
    }, {
      test: /\.(scss|css)$/,
      include: /components\/partials\//,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: true,
              localIdentName: '[local]'
            }
          },
          'sass-loader'
        ]
      })
    }, {
      test: /\.(css|scss)$/,
      exclude: /components\/partials\//,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: true,
              localIdentName: '[local]'
            }
          },
          'sass-loader'
        ]
      })
    }, {
      test: /\.(txt)$/,
      loader: 'raw-loader',
      include: path.resolve(__dirname, './components/layout/main/modules')
    }, {
      test: /\.(md)$/,
      loader: ExtractTextPlugin.extract({
        use: [
          'html', 'highlight', 'markdown'
        ]
      })
    }
  ],
  noParse: [/jszip.js$/]
}

module.exports = function (env) {
  const isProd = NODE_ENV === 'production'

  const envars = {
    NODE_ENV: JSON.stringify(NODE_ENV),
    API_URL: JSON.stringify(API_URL),
    PORT: JSON.stringify(PORT)
  }

  const plugins = [
    new webpack.EnvironmentPlugin(envars),
    new webpack.DefinePlugin({
      'process.env': envars
    }),
    new ExtractTextPlugin({ filename: (isProd ? '[hash]-docs.css' : 'docs.css'), allChunks: true }),
    new webpack.NamedModulesPlugin()
  ]

  if (isProd) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true
        },
        output: {
          comments: false
        }
      })
    )
  } else {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.LoaderOptionsPlugin({
        debug: true,
        options: {
          context: __dirname
        }
      })
    )
  }

  let appEntry = {
    vendor: [
      'babel-polyfill'
    ],
    app: [
      'jquery',
      'moment/moment.js',
      './node_modules/font-awesome/css/font-awesome.min.css',
      'assets/style/main.scss',
      'react-toastify/dist/ReactToastify.css'
    ]
  }

  let appResolver = {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    alias: {
      'jquery': path.resolve(__dirname, 'node_modules') + '/jquery/src/jquery.js',
      'base': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
      'assets': path.resolve(__dirname, './src/assets'),
      'reducers': path.resolve(__dirname, './src/reducers'),
      'actions': path.resolve(__dirname, './src/actions'),
      'constants': path.resolve(__dirname, './src/constants'),
      'components': path.resolve(__dirname, './src/components'),
      'api': path.resolve(__dirname, './src/api')
    },
    modules: [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
      sourcePath
    ]
  }

  let devServerConfig = {
    contentBase: path.resolve(__dirname, './src'),
    publicPath: '/static',
    historyApiFallback: true,
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    compress: isProd,
    inline: !isProd,
    hot: !isProd,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m'
      }
    }
  }

  let commonConfig = {
    devtool: isProd ? 'source-map' : 'eval-source-map',
    context: sourcePath,
    entry: appEntry,
    output: {
      path: path.join(__dirname, 'build'),
      publicPath: isProd ? '/' : '/static',
      filename: isProd ? '[hash]-bundle.js' : 'bundle.js'
    },
    module: _module,
    resolve: appResolver,
    plugins,
    performance: isProd && {
      hints: 'warning'
    },
    stats: {
      colors: {
        green: '\u001b[32m'
      }
    },
    node: {
      fs: 'empty',
      child_process: 'empty',
      global: true,
      process: true,
      Buffer: true,
      __filename: true,
      __dirname: true,
      setImmediate: false
    },
    externals: [
      {
        './cptable': 'var cptable'
      }
    ]
  }

  let clientAppEntry = [
    ...appEntry.app
  ]
  clientAppEntry.unshift('./src/index.js')

  let clientConfig = {
    ...commonConfig,
    entry: {
      vendor: appEntry.vendor,
      app: clientAppEntry
    },
    plugins: [
      ...commonConfig.plugins,
      new HtmlWebpackPlugin({
        template: path.resolve('./src', 'index.production.html'),
        favicon: path.join('./src/assets/images', 'favicon.ico')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor'],
        minChunks: Infinity,
        filename: (isProd ? '[name].[hash]-bundle.js' : '[name].bundle.js')
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Tether: 'tether'
      }),
      new ManifestPlugin()
    ],
    devServer: devServerConfig
  }

  if (!isProd) {
    clientConfig = {
      ...clientConfig,
      entry: {
        ...clientConfig.entry,
        vendor: [
          ...clientConfig.entry.vendor
        ]
      }
    }
  }

  return clientConfig
}
