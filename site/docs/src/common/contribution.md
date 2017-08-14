---
title: 参与贡献
description: 基础教程
author: imink
date: 2017-08-01
---

## 参与方式
我们鼓励以下方式来参与 Cicada 社区，包括但不限于：
* 提交 bug 和 建议的 issue
* 贡献代码
* 加入钉钉群
* 在其他论坛和社区，推广给其他开发者

## 提交 bug 和 建议的 issue
点击[这里]() 打开 issue，发表建议和提交 bug

## 贡献代码

首先 fork and git clone

```bash
git clone git@github.com/xxx.git 
git checkout dev
// after modify the code
git add path-to-your-code
// commit 信息请参考
git commit -m "fix:bug fix #xxx"  
git push origin dev
```

然后进入本项目主页的Pull Request页面，点击New Pull Request, 选择你自己的分支 点击 create pull request，这样就 OK 了

怎样把fork后的仓库和主仓库保持同步？

新添加一个名为 upstream的 remote 指向公共仓库

这行命令只需要运行一次
```bash
git remote add upstream https://github.com/xxx.git
```
从公共仓库获取 master 分支

```bash
git fetch upstream
git checkout master
git merge upstream/master
```
## 代码风格
源码包含了 eslint 的规范文件，来自于 [Airbnb JavaScript Style](https://github.com/airbnb/javascript)。
所以我们希望在每次提交代码之前请 `npm run eslint`，来检查代码的书写风格。

## 注释风格
我们使用 [JS Doc](http://usejsdoc.org/) 作为统一的代码注释，所以请在重要的方法上加上**英文**注释。

## 测试
在代码提交之前，请先运行本地的测试。

## 文档贡献
文档采用 [中文文案排版](https://github.com/sparanoid/chinese-copywriting-guidelines)，除此之外，我们加入以下规范：
* 英文的左右保持一个空白，避免中英文字黏在一起
* 使用全角标点符号


