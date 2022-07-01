# 优化
## loader 配置优化
> exclude和include =>优化，告诉webpack哪些是需要优化的include,哪些是不需要优化的exclude
```javascript
  {
                test: /\.(le|c)ss$/,
                // 优化，告诉webpack哪些是需要优化的include
                // 哪些是不需要优化的exclude
                exclude: /node_modules/,
                use: [
                    // 开发环境是style-loader, 生产环境要抽取css成单独文件，防止样式闪烁问题
                    process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    // MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                          postcssOptions: {
                            plugins: [
                              ["autoprefixer"],
                            ],
                          },
                        },
                    }
                ]
            },
```
```javascript

 {
                test: '/\.(js?x)$/',
                use: 'babel-loader',
                // 优化，告诉webpack哪些是需要优化的include
                // 哪些是不需要优化的exclude
                include: resolve(rootDir, 'src'),
                exclude: '/node_modules/',
            },
```
> 一般倾向于使用 include，但是如果怕漏处理一些文件的话，粗暴点，使用 exclude: /node_modules/ 也可以。
> 这部分测试了下，提升速度不是很明显，应该算锦上添花吧
## 缓存
webpack5 较于 webpack4，新增了持久化缓存、改进缓存算法等优化,
先说下 `webpack5` 之前是怎么做的。
利用 `cache-loader` 将结果缓存中磁盘中；利用 `hard-source-webpack-plugin` 将结果缓存在 `node_modules/.cache` 下提升二次打包速度；利用 `DllReferencePlugin` 将变化不频繁的第三方库提前单独打包成动态链接库，提升真正业务代码的打包速度
webpack5 自带了持久化缓存，配置如下
开发环境 `webpack.dev.js`

```js
cache: {
    type: 'memory'
},
```
生产环境 `webpack.pro.js`
```js
cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
},
```

如果在构建时，你主动确定要放弃旧的缓存的话，可以传一个新的 `version` 参数来放弃使用缓存
```js
cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    },
    version: 'new_version'
},
```
## 代码拆分

```js
optimization: {
    splitChunks: {
      chunks: 'all',
    }
```
这个在 `mode: production` 时是默认开启的，但是默认情况下只会对按需加载的代码进行分割。如果我们要对一开始就加载的代码也做分割处理，就要进行如上配置。
从官网上找了一张图

![在这里插入图片描述](https://img-blog.csdnimg.cn/d515ff18fd5e47c1b7e65cd6dd02e300.png)

大家的项目可能都有所不同，相对应的最佳的配置可能也有所不同，所以这里就补贴具体的配置了，大家有需要的可以看官网的文档对自己的项目进行配置 官网 [Webpack从 0 到 1 学会 code splitting](https://juejin.cn/post/6979769284612325406)

## mode
`mode: production` 在上面出现了这么多次，也没有具体说有哪些功能。其实当设置 `mode: production` 时，`webpack` 已经默认开启了一些优化措施。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20c006bf9d824b7bb64e8bb3bf2a7439.png)
这里面的一些东西由于篇幅较大也不做一一说明了，反正只要记得 mode: production 已经给我们做了一系列优化，真的想知道有哪些优化的，我找了篇文章，有兴趣的可以看看[mode详解](https://juejin.cn/post/6844903695033843726)

## happypack

利用 `happypack` 插件进行多线程打包，按照官网文档进行配置

```js
// 省略...
const Happypack = require('happypack');
const os = require('os')
const happyThreadPool = Happypack.ThreadPool({ size: os.cpus().length })

// 省略...
rules: [
  {
    test: /\.(jsx|js)$/,
    // use: 'babel-loader',
    use: 'Happypack/loader?id=js',
    exclude: /node_modules/,
  },
]

plugins: [
    new Happypack({
      id: 'js', // 这个 id 值为上面 Happypack/loader?id=js 问号后跟的参数
      use: ['babel-loader'],
      threadPool: happyThreadPool
    }),
]
```
由于本篇文章写的是个 demo，没有业务代码，所以这个打包出来的时间基本没变化甚至还多了 1 秒，这里就不贴效果图了。 这是因为happypack执行也需要时间，如果项目比较小的话，就不需要配置了。 js 处理完之后那就是要处理css了， 按照处理js的方式，ctrl+c/ctrl+v 处理css。

执行 npm run build:pro
报错说忘记添加了mini-css-extract-plugin插件，但是明明已经添加了，经过试验，发现是 mini-css-extract-plugin 这个插件引起 happypack 报错的。终于，在经过 百度、谷歌 等一系列骚操作后，我放弃了，没找到解决方法

## thread-loader
如果采用上面第一种，放弃使用 `happypack`，可以用 `thread-loader` 代替下。而且这个配置非常简单。多进程打包
多进程打包：开启电脑的多个进程同时干一件事情，速度更快
需要注意：请仅在特别耗时的操作中使用，因为每个进程启动就有大约为600ms左右开销。

先安装: `npm install thread-loader -D`，再修改配置

```js
// 省略...
rules: [
  {
    test: /\.(jsx|js)$/,
    use: ['thread-loader', 'babel-loader'],
    exclude: /node_modules/,
  },
  {
    test: /\.(le|c)ss$/,
    exclude: /node_modules/,
    use: [
      MiniCssExtractPlugin.loader,
      'thread-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            compileType: 'module',
            localIdentName: "[local]__[hash:base64:5]",
          },
        },
      },
      'less-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              ["autoprefixer"],
            ],
          },
        },
      }
    ],
  },
]
```

## 热更新 hot: true
热更新指的是，在开发过程中，修改代码后，仅更新修改部分的内容，无需刷新整个页面；​
webpack.dev.js
```js
module.export = {
    devServer: {
        contentBase: './dist',
        hot: true, // 热更新
      },
}
```
## contenthash
我们要保证，改过的文件需要更新hash值，而没改过的文件依然保持原本的hash值，这样才能保证在上线后，浏览器访问时没有改变的文件会命中缓存，从而达到性能优化的目的

webpack.base.js
```js
// webpack.base.js

  output: {
    path: path.resolve(__dirname, '../dist'),
    // 给js文件加上 contenthash
    filename: 'js/chunk-[contenthash].js',
    clean: true,
  },
```

## Tree Shaking

> 开发时我们定义一些工具函数库，或者引用第三方工具函数库或组件库，
>如果没有特殊处理的话我们打包时会引入整个库，但是实际上可能我们只会用上极小的部分
>这样将整个库都打包进来，体积就太大了
Tree Shaking 是一个术语，通常用于描述移除javaScript中没有使用过的代码
注意：它以来 `ES Module`。

Webpack 已经默认开启了这个功能，无需其他配置
到这里应该可以应付一般的项目了