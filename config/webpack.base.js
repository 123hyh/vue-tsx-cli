const path = require('path');
const yargs = require('yargs');
const { generatorPages } = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
/* 打包体积可视化插件 */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const chalk = require('chalk');
/* 压缩 */
const CompressionPlugin = require('compression-webpack-plugin');

const { moduleRules } = require('./module/module');

const conf = {
  externals: {},
  module: {
    rules: moduleRules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      vue$: 'vue/dist/vue.js',
      utils: path.resolve(process.cwd(), 'src/utils/index.ts'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['index'],
      template: path.resolve(process.cwd(), 'public/index.html'),
    }),

    ...generatorPages().pagesPlugins,

    new CompressionPlugin({
      test: /\.(js|css|html|svg|webp|png)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};

// 可视化打包文件插件
if (yargs.argv.buildvisual) {
  conf.plugins.push(new BundleAnalyzerPlugin());
}
module.exports = conf;
/* 控制台样式 */
{
  const { test, production, development, buildvisual } = yargs.argv;
  const green = chalk.keyword('green');
  const temp = (mode) => `
|-------------------------------------------------------------------------------|
|                                                                               |
|                                                                               |
|                           正在构建${mode}环境${
    buildvisual ? '(体积可视化)' : ''
  }                                    |
|                                                                               |
|                                                                               |
|-------------------------------------------------------------------------------|_ _ _
`;
  if (test) {
    console.log(green(temp('测试')));
  } else if (production) {
    console.log(green(temp('生产')));
  } else if (development) {
    console.log(green(temp('开发')));
  }
}
