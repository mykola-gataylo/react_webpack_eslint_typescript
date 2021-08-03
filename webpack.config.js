const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const devServer = (isDev) => !isDev ? {} : {
  devServer: {
    open: true,
    hot: true,
    port: 8080,
    watchContentBase: true,
    historyApiFallback: true,
  }
};

const esLintPlugin = (isDev) => isDev ? [] : [new ESLintPlugin({ extensions: [".ts", ".tsx", ".js", ".jsx"] })];

module.exports = ({ develop }) => ({
  mode: develop ? 'development' : 'production',
  devtool: develop ? 'inline-source-map' : 'source-map',
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[fullhash].js",
    assetModuleFilename: 'assets/[hash][ext]',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ]
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },

  plugins: [

    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: develop ? "index.html" : "[name].[contenthash].html"
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public'),
          to: path.resolve(__dirname, 'dist/public')
        }
      ]
    }),

    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ...esLintPlugin(develop),
  ],
  ...devServer(develop),
  optimization: develop ? {} : {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin({
        parallel: true,
      }),

      new CssMinimizerPlugin({
        parallel: true,
      }),

      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
});