const path = require('path');

const SRC_DIR = path.join(__dirname, "client/src");
const DIST_DIR = path.join(__dirname, "client/dist");

module.exports = {
  entry: `${SRC_DIR}/index.js`,
  output: {
    filename: "bundle.js",
    path: DIST_DIR
  },
  watch: true,
  resolve: {
    extensions: [" ", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        include: SRC_DIR,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        query: {
          presets: [
            ["es2015", { loose: true, modules: false }],
            "react",
            "stage-2"
          ],
          plugins: ["babel-plugin-transform-runtime"].map(require.resolve)
        }
      }
    ]
  }
};
