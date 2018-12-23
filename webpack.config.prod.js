const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");
// const glob = require("glob");
// const PurgecssPlugin = require("purgecss-webpack-plugin");

// Required by babel-preset-react-app
process.env.NODE_ENV = "production";

// const PATHS = {
//   src: path.join(__dirname, "src")
// };

module.exports = {
  mode: "production",
  target: "web",
  devtool: "source-map", // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  // entry: "./src/index", // Can omit, since default.
  output: {
    path: path.resolve(path.join(__dirname, "dist")), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    // Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself.
    // Typically, this is done either with alternate quotes, such as '"production"', or by using JSON.stringify('production').
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV), // This global makes sure React is built in prod mode.
      "process.env.API_URL": JSON.stringify("http://localhost:3000") // Would set to prod API URL in real app
    }),
    new webpackBundleAnalyzer.BundleAnalyzerPlugin({ analyzerMode: "static" }), // Display bundle stats
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css"
    }),
    // new PurgecssPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    // }),
    // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
    new HtmlWebpackPlugin({
      favicon: "src/favicon.ico",
      template: "src/index.html",
      minify: {
        // see https://github.com/kangax/html-minifier#options-quick-reference
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "src"),
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("cssnano"), require("autoprefixer")],
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
};
