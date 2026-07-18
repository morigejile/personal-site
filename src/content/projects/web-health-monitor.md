---
title: "Web Health Monitor"
date: "2026-07-01"
category: "作品集"
tags: ["Python", "Flask", "Prometheus", "可观测性"]
summary: "Python + Flask 构建的健康监控面板，支持多站点并行 HTTP/ICMP 检测，Prometheus 指标导出，Grafana 面板可视化。"
featured: true
---

## 项目介绍

Web Health Monitor 是一个轻量级的健康监控系统，专为中小团队设计。它可以同时监控多个站点的可用性和响应时间，并通过 Prometheus 导出指标，配合 Grafana 展示可视化面板。

## 核心功能

- **多协议检测**：HTTP/HTTPS 状态码检查 + ICMP Ping 延迟检测
- **并行检测**：使用 asyncio 实现多个站点同时检测，提高检查效率
- **历史记录**：SQLite 存储检测结果，支持趋势分析
- **Prometheus 导出**：将检测指标暴露为 Prometheus metrics 格式
- **Grafana 面板**：预设面板模板，开箱即用
- **告警通知**：站点异常时发送通知

## 技术架构

```
[检测目标] ← HTTP/ICMP → [Monitor Agent]
                              │
                              ▼
                         [SQLite] ← 存储历史
                              │
                              ▼
                    [Prometheus Exporter]
                              │
                              ▼
                    [Grafana Dashboard]
```

## 使用方式

```bash
# 安装
pip install -r requirements.txt

# 配置监控目标
# 编辑 config.yaml，添加要监控的站点

# 启动
python app.py
```

## 项目地址

[GitHub - morigejile/web-health-monitor](https://github.com/morigejile/web-health-monitor)
