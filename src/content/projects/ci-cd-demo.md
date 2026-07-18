---
title: "CI/CD Demo 环境"
date: "2026-06-25"
category: "作品集"
tags: ["GitHub Actions", "Docker", "CI/CD"]
summary: "一套完整的 CI/CD 流水线演示环境，涵盖 GitHub Actions 自动构建、Docker 容器化、多环境部署策略。"
featured: true
---

## 项目介绍

这是一个 CI/CD 流水线的演示项目，展示了从代码提交到生产部署的完整流程。适合作为团队落地 CI/CD 的参考模板。

## 流水线结构

### CI（PR 触发）

```
PR opened → 运行单元测试 → 代码风格检查 → 安全扫描 → 报告
```

### CD（合并到 main 触发）

```
Merge to main → 构建 Docker 镜像 → 推送到 Registry →
部署到 Staging → 冒烟测试 → 手动确认 → 部署到 Production
```

## 技术栈

- **CI/CD 平台**：GitHub Actions
- **容器化**：Docker + Docker Compose
- **应用**：Python Flask（示例应用）
- **部署目标**：Kubernetes（minikube / 云端集群）

## 使用方式

```bash
# 克隆仓库
git clone https://github.com/morigejile/ci-cd-demo-env

# 本地运行
docker compose up -d

# 访问 http://localhost:5000
```

## 项目地址

[GitHub - morigejile/ci-cd-demo-env](https://github.com/morigejile/ci-cd-demo-env)
