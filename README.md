<div align="center"><h1>
<br/>
🤖
<br />
command-plugin
<br /><br />
</h1>
<sup>
<br />
<br />
<a href="https://gitee.com/electrolux/front-engineer-plugin"><img src="https://img.shields.io/static/v1?label=version&message=v0.1.27&color=blue" alt="npm package" /></a><a href=https://gitee.com/Electrolux><img src="https://img.shields.io/static/v1?label=Gitee&message=Electrolux&color=red" alt="temp" /></a><a href=https://space.bilibili.com/286773126><img src="https://img.shields.io/static/v1?label=Bili&message=Electrolux&color=pink" alt="temp" /></a>
<a href="https://gitee.com/electrolux/front-engineer-plugin">   <img src="https://img.shields.io/static/v1?label=Author&message=Electrolux&color=yellow" alt="demos" /></a>
<a href="https://gitee.com/electrolux/front-engineer-plugin">   <img src="https://img.shields.io/static/v1?label=Contribute&message=welcome&color=green" alt="demos" /></a>
<br />
</a>
<br />
Translations: <a href="">🇨🇳 汉语</a>
</sup>
</div>




## Introduce

之前给element-plus 提pr的时候，发现element-plus有一个npm  run gz 用来规范代码提交和自动更新Changelog 。受到启发于是写了这个插件。这个插件在目前的前端项目中是通用的，在后续的开发中可以扩展脚手架和其他工具功能



##  Quickstart

begin

```shell
npm install command-plugin -g
```

启动

```shell
command-plugin gui
```



## Developer

```js
安装的时候会通过package.json的bin字段会被打包成二进制文件。这里是脚手架入口

如果你想添加你自己工程化的东西。ts ./ --watch


```



- 首先将你的文件放进file 文件夹
- 修改project.ts的 guiFn 方法和 增加 util/handleEvent.js导出的方法
- 接下来的测试阶段可以npm link 进行软连接或者去到全局npm包的地方修改project





## Feature

这是一个js为基础用于代码提交的commander，可以进行比较轻松的进行脚手架和工具类的扩展。在进行提交的时候的可以选择是否更新CHANGELOG文件和是否更新package.json的版本号并且在给出 commit 的 type 和 scope 的指引



- COMMIT 的指引: type(scope): message

- CHANGELOG: 记录 `提交者` | `message`  | `version` |  `提交时间`

- package.json: 更新version 

  

## Example

默认 自增和写入 changelog 和 version

 <img src="https://cdn.jsdelivr.net/npm/command-plugin/img/example1.png"/>



<img src="https://cdn.jsdelivr.net/npm/command-plugin@0.0.17/img/example2.png"/>









## Badge

[![Size](https://img.shields.io/static/v1?label=plugin&message=command-plugin&color=green)](https://gitee.com/Electrolux)

```
[![Size](https://img.shields.io/static/v1?label=plugin&message=command-plugin&color=green)](https://gitee.com/Electrolux)
```



## Support

command-plugin is developed by me. Please use command-plugin, star it on gitee or even become a [sponsor](https://gitee.com/Electrolux) to support us!












