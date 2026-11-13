---
title: "中文语音识别选型：从实时字幕到表达训练报告"
date: "2026-11-13"
category: "AI 学习记"
tags: ["ASR", "模型评测"]
summary: "以本地中文表达训练为例，对照 Zipformer、SenseVoice、FireRedASR2 和 Fun-ASR-Nano，讨论如何评估实时字幕、原话忠实度和报告证据。"
---

在 Expression Trainer Pro 里，自动语音识别（ASR）既要在录音时显示字幕，也要为录音结束后的表达报告提供转写。假设用户说的是「嗯，我、我不建议现在上线……应该说，先灰度」。如果转写漏掉「不」，报告可能误解他的立场。如果转写删掉「嗯」、重复和改口，报告也失去了判断这些表达现象的依据。

首轮值得新增实测的是 **Zipformer Large Transducer INT8** 和 **FireRedASR2-AED INT8**。前者验证本地实时字幕和热词，后者验证录音结束后能否得到更忠实的转写。已有的 Zipformer Large CTC INT8 和 SenseVoiceSmall 2024 INT8 分别作为两条路线的基线。这里的顺序按要验证的问题来定，两款新候选的自由表达实测仍待完成。

## 同机测试说明了什么

2026 年 8 月 30 日，项目用 100 条固定的 FLEURS 普通话短音频，在 Windows x64、Intel Core Ultra 9 185H、CPU 双线程、Sherpa-ONNX 1.13.3 的配置下比较了七款模型。下面是与本轮选型最相关的四项。CER（字符错误率）是全语料中替换、插入、删除的字符总数除以参考字符总数。RTF（实时因子）是处理耗时与音频时长之比。 [项目同机评测记录][benchmark]

<div style="overflow-x: auto" tabindex="0" role="region" aria-label="普通话同机评测数据">

| 模型 | 当时的模式 | CER ↓ | 平均 RTF ↓ | p95 内存 |
| --- | --- | ---: | ---: | ---: |
| Zipformer Large CTC INT8 | 流式 | 4.57% | 0.082 | 550 MiB |
| SenseVoiceSmall 2024 INT8 | 整段 | 3.50% | 0.020 | 502 MiB |
| Qwen3-ASR 0.6B INT8 | 整段 | 3.69% | 0.169 | 2,898 MiB |
| FireRedASR2-CTC INT8 | 整段 | 6.01% | 0.168 | 1,222 MiB |

</div>

内存一列是每条样本的进程峰值内存取第 95 百分位。Zipformer Large CTC 是当时三个流式候选中 CER 最低的一款。SenseVoiceSmall 2024 的 CER 和 RTF 都更低，适合用来检验新的整段方案是否值得增加等待时间和资源开销。这轮样本只覆盖普通话短音频，自由表达、中英混说、噪声和长录音仍需单独验证。 [项目同机评测记录][benchmark]

## 候选模型与部署方式

<div style="overflow-x: auto" tabindex="0" role="region" aria-label="候选模型及其部署方式">

| 候选 | 本文比较的部署方式 | 值得验证的问题 |
| --- | --- | --- |
| Zipformer Large Transducer INT8 | Sherpa-ONNX 原生流式 | 实时字幕能否保持稳定，加入热词后术语能否更准？ |
| FireRedASR2-AED INT8 | Sherpa-ONNX 离线解码 | 相比 SenseVoice，能否更完整地保留关键语义、口头语和改口？ |
| Fun-ASR-Nano-2512 INT8 | Sherpa-ONNX 离线解码 | 上下文提示能否改善人名、术语和缩写？长输入会漏掉什么？ |
| Zipformer XLarge Transducer INT8 | Sherpa-ONNX 原生流式 | 在 Large 的基础上，识别收益是否值得增加延迟和内存？ |

</div>

**Zipformer 的 Large 和 XLarge 都有不同的解码版本。** Sherpa 的中文 Large Transducer 包名含 `zipformer-zh-int8`，XLarge Transducer 含 `zipformer-zh-xlarge-int8`，另一个 XLarge 包则含 `zipformer-ctc-zh-xlarge-int8`。Transducer 用音频编码器、根据已输出文本工作的预测网络，以及合并两者信息的 `joiner` 来决定下一个输出。换用它需要对应的模型文件和识别器配置。 [Zipformer Transducer 模型][zipformer-transducer]、[Zipformer CTC 模型][zipformer-ctc]

**FireRedASR2 的 AED 与 CTC 有不同的解码路径。** AED 是带注意力机制的编码器—解码器，论文沿用 L 规模的架构配置。INT8 表示用于部署的八位量化版本。Sherpa 另外发布的 FireRedASR2-CTC 只导出了 CTC 分支，去掉了注意力解码器。论文中的 AED 还用 CTC 分支做时间对齐，接入时应以所用导出版和接口实际返回的结果为准。 [FireRedASR2S 论文][firered-architecture]、[Sherpa 部署文档][firered-onnx]

在 FireRed 团队的论文附录中，FireRedASR2-AED 在四个普通话测试集上的平均 CER 为 **3.05%**，在十九个方言或口音测试集上为 **11.67%**。同表的 Fun-ASR-Nano 分别为 **4.55%** 和 **15.07%**。这组数据支持优先验证 AED 的中文识别能力。它来自论文的模型配置与数据集，本文选用的 INT8 ONNX 包和自由表达样本还需要同机比较。 [FireRedASR2S 论文附录 A][firered-results]、[Nano ONNX 部署文档][nano-onnx]

## 热词、数字和停顿如何评估

**热词要同时测命中和误插入。** 在本文的 Sherpa Transducer 路线中，`modified_beam_search` 会保留多个识别候选，给匹配词表的候选加分。当前 CTC 的 `greedy_search` 没有这条热词接口。专用 CTC 解码器也能实现热词加权，需要单独适配。Nano 的热词则可以进入模型提示词。测试时用同一批音频分别开启和关闭热词，既看说了的词能否命中，也看相近读音或根本没说该词时会不会被误插入。识别后的纯文本替换应保留修改记录，供回听核对。 [Sherpa 热词文档][hotwords]、[pyctcdecode][ctc-hotwords]、[Nano 官方用法][nano-hotwords]、[Sherpa 1.13.3 的 Nano 实现][nano-sherpa]

**数字格式会改变统计口径。** 逆文本归一化（ITN）把「百分之二十五」写成 `25%`，把「编号零零二五」写成 `编号0025`。同一个数值可以有不同的读法和文本长度，例如「两千零二十五」有六个字符，`2025` 有四个。适合保留可回听的原始转写和供阅读的规整文本，表达次数和字符速率采用固定口径。评测数字时，先检查数值、单位和编号前导零，再检查书写格式。 [WeTextProcessing][itn]

**标点、语音活动检测和时间对齐各自提供不同证据。** 标点有助于读懂长句，应检查断句有没有改变否定、条件或转折的范围。语音活动检测（VAD）依据音频估计有声区间，应单独检查轻声和短促口头语的漏检、短静音被合并的情况，以及起止边界偏差。逗号只反映文本断句，停顿长度应从音频测量。报告引用至少应能回到对应的录音片段，只有验证过对齐精度后，才适合提供逐字跳转。 [FireRedASR2S 模块说明][firered-modules]

## 首轮实测怎么做

1. **准备一套固定语料。** 录制真人中文自由表达，覆盖重复、犹豫、自我修正、否定、数字单位、术语和中英混说。加入长录音、暂停继续、安静与轻噪声样本，并标注关键词和对应音频片段。热词调参和最终评测使用不同样本。
2. **固定对照条件。** 使用同一台目标电脑、同一批录音和标注，记录模型包、运行时版本、线程、解码参数和文本规整规则。比较识别能力时使用相同的输入边界，比较整场录音时再按实际采集节奏运行各自的完整流程，并记录使用的 VAD 和切分方式。
3. **同时看原话和使用体验。** 除了 CER，统计关键项正确率、口头语和自我修正的漏检与误检，以及截断、漏段和重复输出。流式模型记录首次可读字幕的等待时间、字幕反复改写的次数和整场跟随情况。整段模型记录停止录音到最终文本的等待时间。两者都测冷启动、失败率、CPU 和内存，并观察较慢样本。平均 RTF 小于 1 只说明平均计算耗时短于音频时长。
4. **回听报告引用。** 固定报告模型和提示词，抽取同一批录音生成报告。人工对照音频，检查引文是否忠实、能否定位，以及哪些误判来自转写。例如，漏掉「不」属于内容识别错误，正确的转写被报告读反则属于报告生成错误。

第一轮就用两个基线加 Large Transducer 和 AED。若人名、术语和英文缩写是主要错误来源，把 Nano 提到同批。等 Large Transducer 证明流式解码和热词的收益，再用相同设置评估 XLarge。是否更换默认模型，要看它能否在目标电脑上稳定提供实时字幕，同时在真实录音里减少会改变报告结论的错误。

[benchmark]: https://github.com/morigejile/expression-trainer-pro/blob/dc9bc528af5d40f0eeb8235922fcadb4b488b5e4/docs/benchmark/bm04-seven-model-comparison-2026-08-30.md
[zipformer-transducer]: https://k2-fsa.github.io/sherpa/onnx/pretrained_models/online-transducer/zipformer-transducer-models.html
[zipformer-ctc]: https://k2-fsa.github.io/sherpa/onnx/pretrained_models/online-ctc/zipformer-ctc-models.html
[firered-architecture]: https://arxiv.org/html/2603.10420v1#S3.SS1
[firered-modules]: https://arxiv.org/html/2603.10420v1#S2
[firered-results]: https://arxiv.org/html/2603.10420v1#A1
[firered-onnx]: https://k2-fsa.github.io/sherpa/onnx/FireRedAsr/pretrained.html
[nano-onnx]: https://k2-fsa.github.io/sherpa/onnx/funasr-nano/pretrained.html
[nano-hotwords]: https://github.com/QwenAudio/Fun-ASR#using-funasr-for-inference
[nano-sherpa]: https://github.com/k2-fsa/sherpa-onnx/blob/v1.13.3/sherpa-onnx/csrc/offline-recognizer-funasr-nano-impl.cc#L137
[hotwords]: https://k2-fsa.github.io/sherpa/onnx/hotwords/index.html
[ctc-hotwords]: https://github.com/kensho-technologies/pyctcdecode
[itn]: https://github.com/wenet-e2e/WeTextProcessing
