const babelOptions = {
  "presets": ["es2015","react", "stage-0"]
};
const autoprefixer = require("autoprefixer");
const config = require("./config").APP;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  entry: "./src/index",
  output: {
    filename: "./dist/bundle.js",
    path: __dirname
  },
  plugins: [new HtmlWebpackPlugin({hash: true,template: 'index.html',filename: './index.html'}),
    new CopyWebpackPlugin([{ from: './assets/css', to: './assets/css'}]),
    new CopyWebpackPlugin([{ from: './assets/fonts', to: './assets/fonts'}]),
    new CopyWebpackPlugin([{ from: './assets/images', to: './assets/images'}]),
    new CopyWebpackPlugin([{ from: './assets/js', to: './assets/js'}])
    ],
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: babelOptions
          }
        ]
      },
      {
        test: /\.json$/,
        exclude: /(node_modules)/,
        loader: "json-loader"
      },
      {
        test: /\.css$/,
        use:[
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [autoprefixer("last 5 versions")];
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [autoprefixer("last 5 versions")];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".jsx", ".js", "json"]
  },
  devServer: {
    host: config.HOST,
    port: config.PORT,
    disableHostCheck: true,
    historyApiFallback: {
      disableDotRule: true
    }
  }
};