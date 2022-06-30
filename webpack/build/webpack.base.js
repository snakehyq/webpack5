// devtool: 开发环境 最佳： eval-cheap-module-source-map 生产环境 最佳： hidden-source-map
const { resolve } = require("path");
const chalk = require('chalk')
const rootDir = process.cwd();
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
module.exports = {
  module: {
    rules: [
        // 自定义个将markdown文件转换为html的loader
        {
            test: '/\.md$/',
            use: [
                {
                    loader: resolve('loaders') + '/my-loader',
                    options: {
                        headerIds: false
                    }
                }
            ]
        },
      {
        test: /\.(le|c)ss$/,
        // 优化，告诉webpack哪些是需要优化的include
        // 哪些是不需要优化的exclude
        exclude: /node_modules/,
        use: [
          // 开发环境是style-loader, 生产环境要抽取css成单独文件，防止样式闪烁问题
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          // MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
        ],
      },
      {
        test: "/.(js?x)$/",
        use: "babel-loader",
        // 优化，告诉webpack哪些是需要优化的include
        // 哪些是不需要优化的exclude
        include: resolve(rootDir, "src"),
        exclude: "/node_modules/",
      },
      // 处理css中的背景图片的
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            // 小于10kb的图片转换成base64格式
            // 优点：减少请求数量 缺点：体积会更大
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "img/[hash:8][ext][query]",
        },
      },
      // 处理html中的多种资源（img.....），详情可以看 https://webpack.docschina.org/loaders/html-loader/
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          esModule: false,
        },
      },
      // 处理字体图标
      {
        test: "/.(ttf|woff2?)$/",
        type: "asset/resource",
        generator: {
          // 输出名称
          filename: "media/[hash:8][ext][query]",
        },
      },
    ],
  },
  // 插件
  plugins: [
    // 进度条
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }),
    // 把process.env.NODE_ENV配置成全局变量，可以在项目(组件)中使用，有时候要区分生产环境或开发环境来设置不同的请求地址，因此需要设置为全局变量
    // process.env.NODE_ENV的值是package.json的命令 cross-env NODE_ENV=development中的NODE_ENV=development，process.env.NODE_ENV = (NODE_ENV=development)中development，
    //  cross-env 需要安装npm install cross-env -D  cross-env 解决不同系统之前的命令兼容问题
    //
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "../index.html"),
    }),
  ],
  // 如果使用了 new webpack.DefinePlugin自定义process.env.NODE_ENV变量，则需要关闭mode中自动设置process.env.NODE_ENV，否则会冲突
  optimization: {
    nodeEnv: false,
  },
};
