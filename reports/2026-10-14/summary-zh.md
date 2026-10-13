# CC Switch PR 重复目的排查总结

检查仓库：[`farion1231/cc-switch`](https://github.com/farion1231/cc-switch)。报告日期：2026-10-14。

**确实存在你说的情况：有的新 PR 已经实现了旧开放 PR 的核心需求，还有的新 PR 只解决了旧 PR 的一部分。** 最直接的例子是：#6321 还在等待合并，但 #8165 已经把工具卸载功能合入主分支。另一方面，不能只按提交时间选最新的；有些新 PR 的范围反而更小。

本次纳入 **2,389 个 PR**：当前开放 **561 个**、已合并 **630 个**、已关闭但未合并 **1,198 个**。开放 PR 的状态及代码版本核验截至 **2026-10-14 00:23:54（北京时间）**。审查中新增的 #8264，以及更新过代码的 #8194，均已补入。

全量提取并比较实际代码差异，再对疑似重复关系逐组阅读相关实现和测试。报告记录 **64 组关系**，涉及 **138 个不同的开放 PR**。其中 **46 组属于核心目的重复或部分重叠，涉及 105 个不同的开放 PR**；其余是依赖关系和需要排除的误判。一个 PR 可能出现在不同关系中，不能把每行数量相加。

| 分类 | 数量 | 通俗解释 |
| --- | ---: | --- |
| 核心目的重复 | 13 组 | 在做同一件事，应选定一个实现，再收拢另一边的增量和测试。 |
| 部分重叠 | 33 组 | 有一部分做了两遍，但各自还有独立内容，不能整份直接关掉。 |
| 依赖叠加或拆分 | 11 组 | 后一个带着前一个的代码继续开发，应该整理合并顺序或比较基线。 |
| 需要排除的误判 | 7 组 | 相似主题下修的行为不同，或旧修复已不在当前主分支中。 |

## 最值得先整理的 13 组

下表中的“覆盖”指所述核心需求；不是对 PR 全部附带改动、所有平台和所有异常情况的保证。对于尚未合并的新 PR，也不代表修复已经进入正式版本。

| 要解决的问题 | PR 关系与代码依据 | 建议 |
| --- | --- | --- |
| 工具卸载 | [#8165](https://github.com/farion1231/cc-switch/pull/8165)、[#6321](https://github.com/farion1231/cc-switch/pull/6321)：**#8165 已合并，#6321 仍开放**。二者均有卸载入口、确认界面和后端执行逻辑；主分支已具备该功能。 | 优先整理 #6321，把安装来源识别、WSL 和剩余安装等有价值的差异拆成小补丁。 [详见 A01](detailed-findings-zh.md#a01) |
| OpenCode Go 在 Claude Desktop 中的认证 | [#8247](https://github.com/farion1231/cc-switch/pull/8247)、[#8056](https://github.com/farion1231/cc-switch/pull/8056)：两者都在同一个预设补上 ANTHROPIC_API_KEY 认证字段。 | 择一保留，整合测试。 [详见 A02](detailed-findings-zh.md#a02) |
| Gemini / Vertex 的用量统计 | [#7766](https://github.com/farion1231/cc-switch/pull/7766)、[#7740](https://github.com/farion1231/cc-switch/pull/7740)：两者都保留 modelVersion，并让 token 数量支持数字字符串。 | 保留一套实现，吸收 #7740 的集成测试。 [详见 A03](detailed-findings-zh.md#a03) |
| Desktop 网关口令比较 | [#7488](https://github.com/farion1231/cc-switch/pull/7488)、[#7485](https://github.com/farion1231/cc-switch/pull/7485)：都用 ct_eq 替换普通字符串比较；#7488 另统一错误提示。 | 以 #7488 作为整合候选。 [详见 A04](detailed-findings-zh.md#a04) |
| OpenClaw 保存后 JSON 失效 | [#6517](https://github.com/farion1231/cc-switch/pull/6517)、[#6476](https://github.com/farion1231/cc-switch/pull/6476)、[#6468](https://github.com/farion1231/cc-switch/pull/6468)：都修根字段名缺双引号；#6517 还修全部已有根字段，范围更广。 | 以 #6517 整合另两条，保留各自回归用例。 [详见 A05](detailed-findings-zh.md#a05) |
| Hermes 缺少默认协议 | [#7139](https://github.com/farion1231/cc-switch/pull/7139)、[#6029](https://github.com/farion1231/cc-switch/pull/6029)：前后端都为缺失的 api_mode 补 chat_completions。 | 择一保留默认值补全逻辑。 [详见 A06](detailed-findings-zh.md#a06) |
| 只管理供应商，不接管其他资源 | [#7082](https://github.com/farion1231/cc-switch/pull/7082)、[#6673](https://github.com/farion1231/cc-switch/pull/6673)：MCP、Skills、Sessions 的管理范围逻辑大部分相同；#7082 补更多边界。 | 优先整合到 #7082。 [详见 A07](detailed-findings-zh.md#a07) |
| Kimi CLI 接入 | [#6733](https://github.com/farion1231/cc-switch/pull/6733)、[#6379](https://github.com/farion1231/cc-switch/pull/6379)：配置、表单、MCP、Skills 等大量新增代码相同，48 个非文档文件的规范化新增行集合一致。 | 选定一条接入主线；另与更早的 #4592 一起核对差异。 [详见 A08](detailed-findings-zh.md#a08) |
| 输出 token 上限太小 | [#7126](https://github.com/farion1231/cc-switch/pull/7126)、[#7111](https://github.com/farion1231/cc-switch/pull/7111)：两者都把 Responses 的最小值提高到 16；#7126 还覆盖其他协议。 | #7126 可吸收 #7111 的核心修复。 [详见 A09](detailed-findings-zh.md#a09) |
| 火山引擎查错套餐额度 | [#7096](https://github.com/farion1231/cc-switch/pull/7096)、[#6518](https://github.com/farion1231/cc-switch/pull/6518)：都按 /api/coding 与 /api/plan 选对应额度接口；#7096 另做账号复用。 | 保留一套接口选择逻辑。 [详见 A10](detailed-findings-zh.md#a10) |
| 正文开始后又插入思考块 | [#6911](https://github.com/farion1231/cc-switch/pull/6911)、[#5706](https://github.com/farion1231/cc-switch/pull/5706)：在同一个流转换函数标记正文已开始，随后丢弃晚到的 reasoning。 | 合为一份修复及测试。 [详见 A11](detailed-findings-zh.md#a11) |
| 搜索会话中间的正文 | [#7896](https://github.com/farion1231/cc-switch/pull/7896)、[#6636](https://github.com/farion1231/cc-switch/pull/6636)：一个建全文索引，一个逐次扫描消息；都是给会话做正文搜索。 | 先选择搜索架构和搜索范围，不要同时维护两套。 [详见 A12](detailed-findings-zh.md#a12) |
| 中途用户指令被当作系统消息 | [#7253](https://github.com/farion1231/cc-switch/pull/7253)、[#7167](https://github.com/farion1231/cc-switch/pull/7167)：使用相同 steer 识别规则，把这类 system 消息改成 user；#7253 还扩展其他提醒。 | #7253 可吸收 #7167 的核心逻辑。 [详见 A13](detailed-findings-zh.md#a13) |

## 这些“新 PR 覆盖旧 PR”的判断要特别小心

| PR | 已经重叠的部分 | 仍不能丢掉的内容 |
| --- | --- | --- |
| [#7782](https://github.com/farion1231/cc-switch/pull/7782)、[#7754](https://github.com/farion1231/cc-switch/pull/7754) | Windows 用量脚本的时区读取修复。 | 较新的 #7782 主要处理读取；旧 #7754 还处理日期写入、构造、解析和按时间戳计算偏移。 [详见 B08](detailed-findings-zh.md#b08) |
| [#7068](https://github.com/farion1231/cc-switch/pull/7068)、[#7040](https://github.com/farion1231/cc-switch/pull/7040) | 后端读取模型输入、输出上限。 | 旧 #7040 还把上限填入 Pi 表单，并保护用户手动填写的数值。 [详见 B10](detailed-findings-zh.md#b10) |
| [#8216](https://github.com/farion1231/cc-switch/pull/8216)、[#5740](https://github.com/farion1231/cc-switch/pull/5740) | 部分流式消息 ID 修复。 | 旧 #5740 还涉及另一条协议转换链和历史回放。 [详见 B14](detailed-findings-zh.md#b14) |
| [#7971](https://github.com/farion1231/cc-switch/pull/7971)、[#7857](https://github.com/farion1231/cc-switch/pull/7857)、[#8067](https://github.com/farion1231/cc-switch/pull/8067) | Codex 的自定义 model_provider。 | #7971 与 #7857 都改真实配置写入，但设置优先级不同；更晚的 #8067 在此仅改模型目录输入，不能替代它们。 [详见 B05](detailed-findings-zh.md#b05) |
| [#8218](https://github.com/farion1231/cc-switch/pull/8218)、[#5979](https://github.com/farion1231/cc-switch/pull/5979)、[#8230](https://github.com/farion1231/cc-switch/pull/8230) | #8218 已合并，可避免未变化的延迟会话反复重读。 | 旧 #5979 还做持久化待处理状态和父会话边界；#8230 针对正常追加解析的断点。 [详见 B33](detailed-findings-zh.md#b33) |
| [#8201](https://github.com/farion1231/cc-switch/pull/8201)、[#7477](https://github.com/farion1231/cc-switch/pull/7477) | #8201 已合并，关闭默认面板淡入动画，处理重影。 | 旧 #7477 还调整弹窗定位、面板关闭事件和会话选中逻辑。 [详见 B01](detailed-findings-zh.md#b01) |
| [#8016](https://github.com/farion1231/cc-switch/pull/8016)、[#7292](https://github.com/farion1231/cc-switch/pull/7292)、[#4270](https://github.com/farion1231/cc-switch/pull/4270) | 关闭跟随系统代理时明确直连。 | #7292 还显示当前生效代理及来源；不能被较新的窄修复整体替代。 [详见 B04](detailed-findings-zh.md#b04) |
| [#7356](https://github.com/farion1231/cc-switch/pull/7356)、[#7244](https://github.com/farion1231/cc-switch/pull/7244)、[#6444](https://github.com/farion1231/cc-switch/pull/6444) | 三者都接入 DeepSeek Harness 供应商管理。 | 应用标识、界面和配置管理架构不同，必须先定统一方案。 [详见 B02](detailed-findings-zh.md#b02) |
| [#6724](https://github.com/farion1231/cc-switch/pull/6724)、[#6447](https://github.com/farion1231/cc-switch/pull/6447) | 两者都导入 DSH 会话用量。 | 数据来源标识和去重方式不同，直接同时接入可能重复统计。 [详见 B03](detailed-findings-zh.md#b03) |
| [#8001](https://github.com/farion1231/cc-switch/pull/8001)、[#7743](https://github.com/farion1231/cc-switch/pull/7743) | Codex 旧官方代理会话兼容表。 | 旧 #7743 还处理编辑快照和冲突意图，不应整份认定完成。 [详见 B06](detailed-findings-zh.md#b06) |

完整附录还记录了 Desktop 深链接和自定义请求头、Hermes 切换、Codex 导入、Gemini 签名、数据库权限、Pi 输入法、S3、轻量模式、CLI 等其余重叠组。

## 不应因为代码重复就直接关闭的 PR

- [#7785](https://github.com/farion1231/cc-switch/pull/7785)、[#7786](https://github.com/farion1231/cc-switch/pull/7786)、[#7789](https://github.com/farion1231/cc-switch/pull/7789)：是“聚合路由 → 保存校验 → 编辑界面”的开发层次。后面的代码包含前面，是因为继续开发。
- [#8249](https://github.com/farion1231/cc-switch/pull/8249)、[#8250](https://github.com/farion1231/cc-switch/pull/8250)：后者带着 WSL 文件修复继续增加 VS Code MCP 导入，导入功能有独立价值。
- [#7896](https://github.com/farion1231/cc-switch/pull/7896)、[#8150](https://github.com/farion1231/cc-switch/pull/8150)：#8150 的目标分支直接就是 #7896 的搜索分支，用来补重试、索引清理等问题。
- [#8262](https://github.com/farion1231/cc-switch/pull/8262)、[#8165](https://github.com/farion1231/cc-switch/pull/8165)：#8262 在已合并卸载功能上补 Windows 反馈与路径处理，属于后续修复。
- [#8264](https://github.com/farion1231/cc-switch/pull/8264)、[#7188](https://github.com/farion1231/cc-switch/pull/7188)：新 #8264 是可由脚本刷新的共享密钥变量；旧 #7188 是供应商的多密钥列表，不能互相替代。
- [#5572](https://github.com/farion1231/cc-switch/pull/5572)、[#1506](https://github.com/farion1231/cc-switch/pull/1506)：虽然历史修复代码高度相同，但当前主分支已经不保留 #1506 的 raw input 做法；#5572 仍需要按当前问题评审。


另外，#7483 → #7487、#8244 → #8250、#4903 → #5026 的运行代码新增行高度一致，但前一个已经关闭。这类历史重提不应再算作“目前还挂着两份重复开放 PR”。

## 建议的整理顺序

1. **先处理已经落入主分支的需求。** 优先核对 #6321 的剩余差异；再拆清 #5979、#7477 中已被已合并修复覆盖的部分。
2. **再整合小而明确的重复修复。** 例如认证字段、token 计数、JSON 根字段双引号、最小输出上限。这些最容易确认核心行为一致。
3. **为大型功能选定一条实现主线。** Kimi、DSH、正文搜索、管理范围开关都需要先确定统一架构，再搬入其他 PR 的独立内容。
4. **最后整理叠加 PR 的比较基线。** 前置功能合并后，让后续 PR 只保留新增内容，避免审查者再次看到整套旧差异。

关闭旧 PR 前，仍应逐项核对它的独立改动和回归用例。这里推荐的是整理优先级，不是自动关闭清单。本次没有评论、关闭或修改 GitHub 上的任何 PR。

## 怎么检查、结论适用到哪里

本次没有只按标题分组：实际提取了文件改动、增加与删除的代码、差异块上下文，并进行开放 PR 之间及开放 PR 与历史 PR 的交叉比较。对报告中的关系，继续阅读具体实现、调用路径、相关测试和目标分支；已合并覆盖的例子另外核对了当前 main。

相同文件或相似代码只是筛选线索，不直接等于同一功能。自动比较时降低了翻译、依赖锁文件、文档和通用测试语句的权重；文档、测试等条目仍保留在完整清单。代码相似比例不代表功能完成比例。

这是静态重复目的审查，没有逐个构建、运行所有 PR，也没有独立复跑各作者声明的测试。未列入关系组的 PR，清单中标记为“完成差异筛选，未形成明确重复结论”，不代表已经证明它绝无重复。不同基线、文件改名或采用不同算法，仍可能降低自动筛选的召回率。

GitHub 对少数超大 diff 不返回完整 patch，本次通过文件 API 和原始文件补取，重建了 48 份缺失的文本差异。历史 #1054 的文件列表还触及 3,000 项上限，另从完整 Git 文件树中补回了 99 个文本文件差异。二进制资源、生成日志和构建产物不作功能等价判断。所有报告中的判断均有已取得的相关代码作为依据。

主分支参照：`2635dfffcee949b6056b936c992dfcdbdd940298`（v4.0.11 发布说明所在提交）。

## 交付文件

- [逐组详细报告](detailed-findings-zh.md)：每组的 PR 状态、代码位置、行为差别和处理建议。
- [当前开放 PR 完整清单](open-pr-inventory.csv)：可按关系编号、状态和审查层级筛选。
- [全部 PR 清单](pr-inventory.csv)：包含已合并、已关闭条目及对应代码版本。
- [审计清单](audit-manifest.json)：采集范围、截止时间、代码版本、diff 校验值及补取情况。
- [证据包](evidence.zip)：实际 diff、PR 元数据、分组结论和分析脚本，便于复查。
