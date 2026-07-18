---
title: "CI/CD 流水线从设计到落地"
date: "2026-06-20"
category: "运维记"
tags: ["CI/CD", "GitHub Actions", "Docker"]
summary: "从零设计一套 CI/CD 流水线，涵盖自动构建、测试、部署到多环境，以及过程中的关键决策和教训。"
featured: false
---

## 设计目标

在搭建 CI/CD 流水线之前，先明确目标：

1. 每次 PR 自动运行测试和代码检查
2. 合并到 main 后自动构建镜像并部署到 staging
3. 手动触发生产部署
4. 回滚能力

## 流水线设计

### CI 阶段（PR 触发）

```yaml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 运行测试
        run: |
          pip install -r requirements.txt
          pytest --cov=./ --cov-report=xml
      - name: 代码检查
        run: ruff check .
```

### CD 阶段（合并到 main 触发）

```yaml
name: CD
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 构建 Docker 镜像
        run: |
          docker build -t myapp:${{ github.sha }} .
          docker push registry.example.com/myapp:${{ github.sha }}
      - name: 部署到 staging
        run: |
          kubectl set image deployment/myapp \
            myapp=registry.example.com/myapp:${{ github.sha }}
```

## 关键决策

### 1. 单仓库 vs 多仓库

对于中小团队，**单仓库 + 路径过滤** 比多仓库更省心。不需要管理多个仓库的权限、Webhook、Secret。

### 2. 镜像标签策略

不要用 `latest` 标签。用 `git commit SHA` 作为镜像标签，保证可追溯。每次部署记录 commit SHA 和部署时间。

### 3. 环境分离

staging 和 production 应该使用不同的 Kubernetes 命名空间和不同的 Service Account。staging 可以用假的 Secret，production 用真的。

## 经验教训

1. **测试要快**：CI 流水线超过 10 分钟，开发者就开始跳过推代码直接合并了。把单元测试和集成测试分开，CI 只跑单元测试。

2. **环境一致性**：最痛苦的事情是 "在我电脑上是好的"。用 Docker 确保开发、测试、生产环境一致。

3. **回滚要简单**：`kubectl rollout undo` 是最简单的回滚方式。确保每次部署前都记录上一个版本的镜像 SHA。

## 下一步

接下来计划引入金丝雀发布和自动回滚——当新版本的错误率超过阈值时自动回滚。
