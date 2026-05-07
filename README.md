# Gomoku APP

一款离线五子棋（Gomoku）应用，使用 [Apache Cordova](https://cordova.apache.org/) 打包，支持 Android 与 Browser 平台。

本项目基于 [yyjhao/HTML5-Gomoku](https://github.com/yyjhao/HTML5-Gomoku) 改造，将原本的 HTML5 网页版游戏封装为可在移动端原生运行的 App，并加入了横屏锁定等移动端优化。

## 开发初衷

纯粹是为了在飞机上这种完全离线的环境里，闲着无聊打发时间用的——所以一切以「能装到手机里、点开就能玩、不依赖任何网络」为目标。

## 特性

- 完全离线运行，无需网络
- 内置 AI 对战，基于 nega-scout 算法，并通过 JavaScript Object 作为哈希表进行缓存
- AI 计算运行在 HTML5 Web Worker 中，与界面线程并行，不阻塞 UI
- 同时支持鼠标点击与触摸操作
- 横屏锁定，移动端布局优化
- 界面基于 jQuery Mobile 实现
- 多语言界面：简体中文、繁體中文（香港）、繁體中文（台灣）、English，并支持「跟随系统」

## 技术栈

- [Apache Cordova](https://cordova.apache.org/)（`cordova-android`、`cordova-browser`）
- `cordova-plugin-screen-orientation`（横屏锁定）
- HTML5 / CSS3 / JavaScript（jQuery、jQuery Mobile）
- HTML5 Web Worker（用于 AI 后台计算）

## 目录结构

```
.
├── config.xml          # Cordova 应用配置
├── package.json        # 项目与 Cordova 插件依赖
├── www/                # Web 资源（Cordova 入口）
│   ├── index.html
│   ├── js/             # 棋盘、玩家、AI Worker、i18n、界面逻辑等
│   ├── style/
│   └── images/
└── README.md
```

## 环境要求

- [Node.js](https://nodejs.org/) 与 npm
- [Apache Cordova CLI](https://cordova.apache.org/docs/en/latest/guide/cli/)：`npm install -g cordova`
- 构建 Android 包还需要：JDK、Android SDK、Gradle（建议通过 Android Studio 安装）
- Android 最低支持版本：API 29

## 快速开始

安装依赖：

```bash
npm install
```

### 在浏览器中运行

```bash
cordova run browser
```

### 构建并运行 Android 版本

连接 Android 设备或启动模拟器后执行：

```bash
cordova run android
```

仅构建 Debug APK：

```bash
cordova build android
```

构建产物位于 `platforms/android/app/build/outputs/apk/debug/` 目录下。

### 构建签名 Release APK

首次需要用 `keytool` 生成 keystore（项目根目录的 `build.json` 已配置好 keystore 路径、alias 和产物类型），之后构建命令：

```bash
cordova build android --release -- --storePassword=XXX --password=XXX
```

构建产物位于`platforms/android/app/build/outputs/apk/release/` 目录下。

## 致谢

- 原始游戏与 AI 逻辑：[yyjhao/HTML5-Gomoku](https://github.com/yyjhao/HTML5-Gomoku)（MIT License）
- 原作者博客：[Gomoku in HTML5](http://yjyao.com/2012/06/gomoku-in-html5.html)

## License

[MIT](./license.txt)
