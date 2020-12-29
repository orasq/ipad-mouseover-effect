/* determine which npm script is running (dev or build?) */
const currentTask = process.env.npm_lifecycle_event;
/* used to find folders' absolute path */
const path = require("path");
/* empty 'build' folder each time to avoid unnecessary files */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
/* extract css from js file and create separate file when 'build' task is running */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
/* create css and js tags in html files, and load last version of the files */
const HtmlWebpackPlugin = require("html-webpack-plugin");
/* used to create array of the project's different html files  */
const fse = require("fs-extra");

/* postCSS plugins for 
css webpack module config */

const postCSSPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("postcss-hexrgba"),
  require("autoprefixer"),
];

/* what should webpack do
when it encounters a css file ? */

let cssConfig = {
  test: /\.css$/i,
  use: [
    "css-loader?url=false",
    {
      loader: "postcss-loader",
      options: { postcssOptions: { plugins: postCSSPlugins } },
    },
  ],
};

/* create css and js tags in html files,
and load last version of the files */

let pages = fse
  .readdirSync("./app")
  .filter((file) => {
    return file.endsWith(".html");
  })
  .map((page) => {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./app/${page}`,
    });
  });

/* base config shared by
'dev' & 'build' tasks */

let config = {
  /* js file to bundle */
  entry: "./app/assets/scripts/App.js",
  plugins: pages,
  /* modules to use */
  module: {
    rules: [cssConfig],
  },
};

/* 'dev' tasks
related config */

if (currentTask == "dev") {
  /* inject css into the DOM */
  cssConfig.use.unshift("style-loader");
  /* where should the bundled js file be placed */
  config.output = {
    filename: "bundled.js",
    /* webpack requires an absolute path -> using nodeJS package */
    path: path.resolve(__dirname, "app"),
  };
  /* webpack-dev-server gives automatic browser refresh */
  config.devServer = {
    /* full page reload for every html files */
    before: function (app, server) {
      server._watch("./app/**/*.html");
    },
    /* webpack requires an absolute path*/
    contentBase: path.join(__dirname, "app"),
    hot: true /* allows webpack to inject css and js in browser memory without reload/refresh */,
    port: 3000,
    host:
      "0.0.0.0" /* allows devices on same network to be able to access webpack dev server */,
  };
  config.mode = "development";
}

/* copy images in
'build' mode  */

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", () => {
      fse.copySync("./app/assets/images", "./docs/assets/images");
    });
  }
}

/* 'build' tasks
related config */

if (currentTask == "build") {
  /* babel config */
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  });
  /* MiniCssExtractPlugin loader */
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  /* minify css file */
  //postCSSPlugins.push(require("cssnano")); // causes CSS rules to disappear, so suspended till fixed
  /* where should the bundled js file be placed */
  config.output = {
    /* generate 'random' file names (cache busting) */
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    /* webpack requires an absolute path */
    path: path.resolve(__dirname, "docs"),
  };
  config.mode = "production";
  /* create separate files for project (code we write) and vendors (lodash, lazysizes, ...) js code */
  config.optimization = {
    splitChunks: { chunks: "all" },
  };
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
    new RunAfterCompile()
  );
}

module.exports = config;
