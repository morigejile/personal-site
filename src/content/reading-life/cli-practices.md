---
title: "终端里的哲学：一些让 CLI 更顺手的小习惯"
date: "2026-05-18"
category: "读书 & 生活感悟"
tags: ["生活", "效率", "CLI"]
summary: "在日常命令行操作中积累的一些小技巧和小习惯——它们不一定能让你的工作效率翻倍，但能让每一天的终端体验更愉悦一点。"
featured: false
---

## 起因

上周帮同事排查一个问题，看他用命令行：`cd` 一次、`ls` 一次、`cat` 文件复制内容、`cd` 到另一个目录、再 `ls`……我站在后面默默看着他重复了十几遍。

其实很多小习惯只要花 5 分钟养成，就能省下大量时间。

## 别名 alias

我 ~/.bashrc 里最长用的几个别名：

```bash
alias g='git'
alias gs='git status'
alias gc='git commit'
alias gp='git push'
alias k='kubectl'
alias kg='kubectl get'
alias kgp='kubectl get pods'
alias ll='eza -la --icons'
```

用 `eza` 替代 `ls` 是最值得的升级——彩色输出、图标、树形展示，体验好太多了。

## 终端多路复用

tmux 学会两个操作就够了：

1. `Ctrl+b %` 分左右窗格
2. `Ctrl+b "` 分上下窗格

有了这两个，就不用开五六个终端窗口了。写代码、看日志、开监控，一个窗口搞定。

## 快速跳转

`zoxide` 是我用过最值的效率工具。它学习你去过的目录，然后只需：

```bash
z proj  # 自动跳到 ~/projects/personal-site/
z k8s   # 自动跳到 ~/k8s-configs/
```

再也不用 `cd ../../..` 了。

## 文件搜索

`fzf` + `fd` 的组合无敌：

```bash
# 交互式搜索文件，选中后直接用 vim 打开
vim $(fd . -t f | fzf)
```

或者更简单：`Ctrl+T` 在任意位置插入选中的文件路径。

## 命令行历史

我设置了 `HISTSIZE=100000` 和 `HISTTIMEFORMAT="%F %T "`。

然后 `Ctrl+R` 反向搜索历史——我知道很基础，但真的很多人不知道或者用不好。

## 最后

这些技巧都很简单，每一个学起来不超过 5 分钟。但它们叠加在一起的效应是显著的。

> 终端是运维工程师的主战场，花点时间把它打扫得舒服一点，值。
