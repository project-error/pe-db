const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ProgressPlugin } = require('webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'server.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [new CleanWebpackPlugin({}), new ProgressPlugin()],
  target: 'node',
};
