---
title: "从零搭建 Kubernetes 可观测性体系"
date: "2026-07-10"
category: "运维记"
tags: ["可观测性", "Kubernetes", "Prometheus", "Grafana"]
summary: "从 Prometheus 到 Grafana，一步步记录如何在生产环境中构建可观测性管道——指标采集、告警规则、面板设计，以及踩过的坑和最终方案。"
featured: true
---

## 为什么需要可观测性

当你的 Kubernetes 集群运行着几十个微服务时，没有可观测性就像在黑暗中开车。你需要知道：

- 服务的健康状态（监控）
- 出问题时为什么（日志）
- 整体的趋势如何（指标）

本文重点讲**指标**这一环：用 Prometheus 采集，Grafana 展示。

## 架构设计

```
服务 Pod (metrics /metrics)
    ↓ 自动发现
Prometheus Server (抓取 + 存储)
    ↓ PromQL
Grafana (面板 + 告警)
    ↓
Alertmanager (通知 → 钉钉/邮件)
```

关键设计决策：Prometheus 走 **Pull 模式**，通过 K8s Service 自动发现目标。

## Prometheus 部署

使用 Prometheus Operator 是最省心的方式：

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: k8s
spec:
  replicas: 2
  retention: 30d
  resources:
    requests:
      memory: 8Gi
  serviceMonitorSelector:
    matchLabels:
      team: ops
```

这里提一下 `retention: 30d`——保留 30 天的数据。如果需要更长时间，建议用 Thanos 做长期存储，而不是直接增加 retention。

### 资源估算

我们集群 50 个 Pod，每个 Pod 暴露约 200 个时间序列，总共约 10000 个 series。8GB 内存绰绰有余。如果 series 数量超过 50000，考虑增加内存或做降采样。

## Grafana 面板设计

面板设计有几个原则：

1. **红色 = 故障**：正常状态下面板应该是全绿的，看到红色说明有问题
2. **从宏观到微观**：先展示整体状态，再提供 drill-down 到具体服务
3. **黄金信号**：每个服务展示延迟、流量、错误、饱和度

我自己设计了三个主要 Dashboard：

- **集群总览**：节点状态、资源使用、Pod 分布
- **服务拓扑**：服务间调用关系、响应时间
- **告警面板**：当前告警及历史

## 告警规则实战

一条好的告警规则不是 "CPU > 80%"，而是 "CPU > 80% 持续 5 分钟且没有自动扩容"。

```yaml
- alert: HighCPUUsage
  expr: |
    avg(rate(node_cpu_seconds_total{mode!="idle"}[5m])) by (instance) > 0.8
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "节点 {{ $labels.instance }} CPU 使用率超过 80%"
```

关键参数是 `for: 5m`——持续 5 分钟才触发，避免瞬时的毛刺导致告警疲劳。

## 踩过的坑

1. **指标爆炸**：有个服务的 `/metrics` 返回了 50000 个 time series，因为把每个 HTTP 请求的参数都暴露出来了。加了个 `filter` 层解决。

2. **Grafana 面板加载慢**：面板上放了几十个图表，每个图表单独查 Prometheus。换成 recording rules 预聚合后，从 10 秒降到 1 秒。

3. **Alertmanager 重复告警**：两个 Prometheus 实例都抓到了同一个告警，都发给了 Alertmanager。配置了 `group_by: ['alertname']` 去重解决。

## 总结

可观测性建设是持续迭代的过程，不需要一开始就追求完美。先能看见，再能预警，最后才是智能分析。
