# CC Switch PR 重复目的排查：逐组证据

状态核验截至 2026-10-14 00:23:54（北京时间）。主分支参照 `2635dfffcee949b6056b936c992dfcdbdd940298`。

本附录包含 64 组关系。A/B 是需要整合的重叠；C 是依赖或拆分；D 是排除误判。每个代码链接指向相关 PR 的文件差异，证据包还保存了本次取得的版本，避免后续更新使判断失去参照。

[返回通俗总结](summary-zh.md) · [开放 PR 清单](open-pr-inventory.csv)

## A 类：核心目的重复：择一保留或整合

- [A01 旧工具卸载需求已在主分支实现](#a01)（[#8165](https://github.com/farion1231/cc-switch/pull/8165)、[#6321](https://github.com/farion1231/cc-switch/pull/6321)）
- [A02 OpenCode Go 的 Claude Desktop 认证修复](#a02)（[#8247](https://github.com/farion1231/cc-switch/pull/8247)、[#8056](https://github.com/farion1231/cc-switch/pull/8056)）
- [A03 Gemini / Vertex 用量与模型归属](#a03)（[#7766](https://github.com/farion1231/cc-switch/pull/7766)、[#7740](https://github.com/farion1231/cc-switch/pull/7740)）
- [A04 Claude Desktop 网关口令比较](#a04)（[#7488](https://github.com/farion1231/cc-switch/pull/7488)、[#7485](https://github.com/farion1231/cc-switch/pull/7485)）
- [A05 OpenClaw 保存后 JSON 失效](#a05)（[#6517](https://github.com/farion1231/cc-switch/pull/6517)、[#6476](https://github.com/farion1231/cc-switch/pull/6476)、[#6468](https://github.com/farion1231/cc-switch/pull/6468)）
- [A06 Hermes 新建供应商缺少默认协议](#a06)（[#7139](https://github.com/farion1231/cc-switch/pull/7139)、[#6029](https://github.com/farion1231/cc-switch/pull/6029)）
- [A07 只管理供应商，不接管其他资源](#a07)（[#7082](https://github.com/farion1231/cc-switch/pull/7082)、[#6673](https://github.com/farion1231/cc-switch/pull/6673)）
- [A08 Kimi CLI 接入的两份高度重合实现](#a08)（[#6733](https://github.com/farion1231/cc-switch/pull/6733)、[#6379](https://github.com/farion1231/cc-switch/pull/6379)）
- [A09 输出 token 上限过小导致请求被拒绝](#a09)（[#7126](https://github.com/farion1231/cc-switch/pull/7126)、[#7111](https://github.com/farion1231/cc-switch/pull/7111)）
- [A10 火山引擎查错套餐额度](#a10)（[#7096](https://github.com/farion1231/cc-switch/pull/7096)、[#6518](https://github.com/farion1231/cc-switch/pull/6518)）
- [A11 正文开始后又插入思考块](#a11)（[#6911](https://github.com/farion1231/cc-switch/pull/6911)、[#5706](https://github.com/farion1231/cc-switch/pull/5706)）
- [A12 搜索会话中间的正文](#a12)（[#7896](https://github.com/farion1231/cc-switch/pull/7896)、[#6636](https://github.com/farion1231/cc-switch/pull/6636)）
- [A13 会话中途追加的用户指令被当成系统消息](#a13)（[#7253](https://github.com/farion1231/cc-switch/pull/7253)、[#7167](https://github.com/farion1231/cc-switch/pull/7167)）

<a id="a01"></a>

### A01　旧工具卸载需求已在主分支实现 [x]

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8165](https://github.com/farion1231/cc-switch/pull/8165) feat: add uninstall support for tools, including UI and backend integration | 已合并 | 2026-10-12 | `0de14fde5bb3` |
| [#6321](https://github.com/farion1231/cc-switch/pull/6321) feat(settings): add uninstall to local environment check (#6307) | 开放 | 2026-08-10 | `85da95ae3852` |

**代码层面的结论：** #6321 仍开放；#8165 已于 2026-10-13 合并。代码确认两者都有卸载入口、确认界面、安装来源识别和卸载后的状态处理；当前 main 已存在 prepare_tool_uninstall、卸载计划校验和应用页入口。因此“增加工具卸载功能”的核心需求已经完成。但新实现允许删除经过识别的原生可执行文件，旧实现对部分原生或无法证明归属的安装只给手动指引，两者边界策略不完全相同。

**对应实现位置：**

- `src-tauri/src/commands/misc.rs` — prepare_tool_uninstall / ToolLifecycleAction；[#8165 文件差异](https://github.com/farion1231/cc-switch/pull/8165/files#diff-c5aed63713e8f68f8ba06c4529263ef62c5ec7e45b614d8c18db5e4916cd571d)、[#6321 文件差异](https://github.com/farion1231/cc-switch/pull/6321/files#diff-c5aed63713e8f68f8ba06c4529263ef62c5ec7e45b614d8c18db5e4916cd571d)。
- `src-tauri/src/commands/tool_uninstall.rs` — plan_for_install、validate_confirmed_plan；[#8165 文件差异](https://github.com/farion1231/cc-switch/pull/8165/files#diff-8026586f18a47a6727c1df992bc66fb95fdf465e3163fe787f9b0f584b24ae38)。
- `src/components/apps/useToolManagement.ts`；[#8165 文件差异](https://github.com/farion1231/cc-switch/pull/8165/files#diff-88b98eb0b21670b146c28ab787a6fb949dae31b1629c966e1c4793c491b23cd2)。
- `src/components/settings/ToolUninstallConfirmDialog.tsx`；[#6321 文件差异](https://github.com/farion1231/cc-switch/pull/6321/files#diff-7fd4fb9264b8c01bb1e57b3b2de9cfa42772b584519f7da8cbbcc571ded19487)。

**建议处理：** 优先整理 #6321：在已合并实现上核对旧 PR 的安装归属、WSL 和剩余安装回归用例，将仍有价值的差异拆成补丁，再关闭旧的大功能 PR。无需再整体引入一套卸载流程。

<a id="a02"></a>

### A02　OpenCode Go 的 Claude Desktop 认证修复

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8247](https://github.com/farion1231/cc-switch/pull/8247) fix(claude-desktop): send x-api-key for the OpenCode Go preset | 开放 | 2026-10-13 | `e3fa0bd892c1` |
| [#8056](https://github.com/farion1231/cc-switch/pull/8056) fix(claude-desktop): use API key auth for OpenCode Go | 开放 | 2026-10-10 | `05d4a9441d5e` |

**代码层面的结论：** 两者都修复同一预设使用了错误认证方式的问题；实际功能改动都是补上 apiKeyField: ANTHROPIC_API_KEY。区别主要是注释和测试。

**对应实现位置：**

- `src/config/claudeDesktopProviderPresets.ts` — OpenCode Go 预设；[#8247 文件差异](https://github.com/farion1231/cc-switch/pull/8247/files#diff-899940694509c1621ad88229ef0f2d3e052e6aff19e8990b2022f3182487fbd7)、[#8056 文件差异](https://github.com/farion1231/cc-switch/pull/8056/files#diff-899940694509c1621ad88229ef0f2d3e052e6aff19e8990b2022f3182487fbd7)。

**建议处理：** 只需保留一个实现；选择时比较测试和当前分支适配情况。

<a id="a03"></a>

### A03　Gemini / Vertex 用量与模型归属 [x]

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7766](https://github.com/farion1231/cc-switch/pull/7766) fix: Gemini 流式 token 统计兼容 Vertex 字符串计数 + modelVersion 归因 | 开放 | 2026-09-30 | `0620b87335b2` |
| [#7740](https://github.com/farion1231/cc-switch/pull/7740) fix(usage): keep Gemini streaming model attribution and accept Vertex token counts | 开放 | 2026-09-28 | `c19fb218b56c` |

**代码层面的结论：** 两者都让流事件过滤器保留 modelVersion，并让 token 计数同时接受数字和数字字符串。解决的是同一组统计丢失问题。

**对应实现位置：**

- `src-tauri/src/proxy/handler_config.rs` — gemini_stream_usage_event_filter；[#7766 文件差异](https://github.com/farion1231/cc-switch/pull/7766/files#diff-e33eb2340882a010b8cf24b2836b016ad09c98d313bf2676a01c34fdbe980989)、[#7740 文件差异](https://github.com/farion1231/cc-switch/pull/7740/files#diff-e33eb2340882a010b8cf24b2836b016ad09c98d313bf2676a01c34fdbe980989)。
- `src-tauri/src/proxy/usage/parser.rs` — gemini_token_count；[#7766 文件差异](https://github.com/farion1231/cc-switch/pull/7766/files#diff-3a21bf10d2972d5ea2cffff5f2d57900e2ed3d6fc4032e8bfbc705be088929d8)、[#7740 文件差异](https://github.com/farion1231/cc-switch/pull/7740/files#diff-3a21bf10d2972d5ea2cffff5f2d57900e2ed3d6fc4032e8bfbc705be088929d8)。

**建议处理：** 合并为一条修复线；保留 #7740 的流式收集到统计解析的集成测试。

<a id="a04"></a>

### A04　Claude Desktop 网关口令比较 [x]

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7488](https://github.com/farion1231/cc-switch/pull/7488) fix(proxy): use constant-time Claude Desktop token check | 开放 | 2026-09-18 | `945a4cf293f0` |
| [#7485](https://github.com/farion1231/cc-switch/pull/7485) fix(proxy): compare gateway tokens in constant time | 开放 | 2026-09-18 | `25758b05093d` |

**代码层面的结论：** 两者都增加 subtle 依赖，并把普通字符串比较改成 ct_eq。#7488 还统一认证失败提示、拆出可测试函数。

**对应实现位置：**

- `src-tauri/src/proxy/handlers.rs` — validate_claude_desktop_gateway_auth；[#7488 文件差异](https://github.com/farion1231/cc-switch/pull/7488/files#diff-01182c40f41f588e10f6b55f97fd16554824971864ef90ee40c60aafc1c54ff0)、[#7485 文件差异](https://github.com/farion1231/cc-switch/pull/7485/files#diff-01182c40f41f588e10f6b55f97fd16554824971864ef90ee40c60aafc1c54ff0)。
- `src-tauri/Cargo.toml` — subtle；[#7488 文件差异](https://github.com/farion1231/cc-switch/pull/7488/files#diff-fe4c6a80a21e81339e2e0faeb9134d0f9636c168987df13c8abf1927a1caee39)、[#7485 文件差异](https://github.com/farion1231/cc-switch/pull/7485/files#diff-fe4c6a80a21e81339e2e0faeb9134d0f9636c168987df13c8abf1927a1caee39)。

**建议处理：** #7488 可作为整合主线；#7485 的核心目的已经被它覆盖。

<a id="a05"></a>

### A05　OpenClaw 保存后 JSON 失效 [x]

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6517](https://github.com/farion1231/cc-switch/pull/6517) fix(openclaw): keep openclaw.json strict-JSON compatible with quoted root keys | 开放 | 2026-08-16 | `96efb7830ee6` |
| [#6476](https://github.com/farion1231/cc-switch/pull/6476) fix(openclaw): quote root keys so openclaw.json stays valid JSON | 开放 | 2026-08-15 | `6ea08b0be3c3` |
| [#6468](https://github.com/farion1231/cc-switch/pull/6468) fix(openclaw): quote newly inserted keys to keep openclaw.json strict-JSON parsable | 开放 | 2026-08-15 | `ef02d85d799e` |

**代码层面的结论：** 三个 PR 都把根字段名改成带双引号，且把新建文件模板改成标准 JSON。#6468 只修新插入的字段；#6476 也修当前更新字段；#6517 会修全部已有根字段。

**对应实现位置：**

- `src-tauri/src/openclaw_config.rs` — OPENCLAW_DEFAULT_SOURCE、make_json5_key、根字段更新；[#6517 文件差异](https://github.com/farion1231/cc-switch/pull/6517/files#diff-652802463afe3047e104339ba20be3f9be73a8d8d59e8772ffe96d98fc0acb12)、[#6476 文件差异](https://github.com/farion1231/cc-switch/pull/6476/files#diff-652802463afe3047e104339ba20be3f9be73a8d8d59e8772ffe96d98fc0acb12)、[#6468 文件差异](https://github.com/farion1231/cc-switch/pull/6468/files#diff-652802463afe3047e104339ba20be3f9be73a8d8d59e8772ffe96d98fc0acb12)。

**建议处理：** 优先以 #6517 整合另外两个，核对旧 PR 的回归用例后再关闭。这里的修复针对根字段，不代表把任意 JSON5 文件完整转成 JSON。

<a id="a06"></a>

### A06　Hermes 新建供应商缺少默认协议

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7139](https://github.com/farion1231/cc-switch/pull/7139) fix(hermes): default api_mode to chat_completions for UI-created providers | 开放 | 2026-09-05 | `cd6f713e539f` |
| [#6029](https://github.com/farion1231/cc-switch/pull/6029) fix(hermes): persist default api_mode for UI-created custom providers | 开放 | 2026-08-02 | `940965f15ed1` |

**代码层面的结论：** 两者都在前端默认配置和后端写入路径补上 api_mode = chat_completions；已有显式值继续保留。只是补值发生在 JSON 阶段还是 YAML 阶段不同。

**对应实现位置：**

- `src/components/providers/forms/hooks/useHermesFormState.ts`；[#7139 文件差异](https://github.com/farion1231/cc-switch/pull/7139/files#diff-ad78c9a2aa321fc0eb1b53bc67525bd32ec9103fa54965bef97fac5124cd21e9)、[#6029 文件差异](https://github.com/farion1231/cc-switch/pull/6029/files#diff-ad78c9a2aa321fc0eb1b53bc67525bd32ec9103fa54965bef97fac5124cd21e9)。
- `src-tauri/src/hermes_config.rs` — set_provider；[#7139 文件差异](https://github.com/farion1231/cc-switch/pull/7139/files#diff-c62a717c9cdd86f83040f4714401e0c10c1418e746de8c51c8699012bca3ec29)、[#6029 文件差异](https://github.com/farion1231/cc-switch/pull/6029/files#diff-c62a717c9cdd86f83040f4714401e0c10c1418e746de8c51c8699012bca3ec29)。

**建议处理：** 同一问题只保留一套默认值补全逻辑。

<a id="a07"></a>

### A07　只管理供应商，不接管其他资源 [x]

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7082](https://github.com/farion1231/cc-switch/pull/7082) feat(settings): add provider-only management scope | 开放 | 2026-09-03 | `0d1b449b2d72` |
| [#6673](https://github.com/farion1231/cc-switch/pull/6673) feat(settings): add provider-only management scope | 开放 | 2026-08-21 | `9f6140f5f037` |

**代码层面的结论：** managementScope 的 MCP、Skills、Sessions 开关、命令拦截和界面隐藏大部分相同；#7082 进一步补齐导入恢复、Pi 和 profile 等边界。

**对应实现位置：**

- `src-tauri/src/settings.rs` — ManagementScope；[#7082 文件差异](https://github.com/farion1231/cc-switch/pull/7082/files#diff-6ae7e3e18e60316fa21398f8dbf2f0b72c230af438a03ecf5301174c9099756f)、[#6673 文件差异](https://github.com/farion1231/cc-switch/pull/6673/files#diff-6ae7e3e18e60316fa21398f8dbf2f0b72c230af438a03ecf5301174c9099756f)。
- `src-tauri/src/services/sync_protocol.rs`；[#7082 文件差异](https://github.com/farion1231/cc-switch/pull/7082/files#diff-b186bd5d0c307a9a1ff8b9630a3d33f2b5457739538cf74e6f3ce53a8a4d5cd4)、[#6673 文件差异](https://github.com/farion1231/cc-switch/pull/6673/files#diff-b186bd5d0c307a9a1ff8b9630a3d33f2b5457739538cf74e6f3ce53a8a4d5cd4)。
- `src-tauri/src/services/profile.rs`；[#7082 文件差异](https://github.com/farion1231/cc-switch/pull/7082/files#diff-5abc39d7fe58a10f3cd6171410dfedf9cbcb63eb0f751f1f54a063d27eba3ce5)、[#6673 文件差异](https://github.com/farion1231/cc-switch/pull/6673/files#diff-5abc39d7fe58a10f3cd6171410dfedf9cbcb63eb0f751f1f54a063d27eba3ce5)。

**建议处理：** #7082 是更完整的整合候选；#6673 不宜再作为另一套独立功能同时合并。

<a id="a08"></a>

### A08　Kimi CLI 接入的两份高度重合实现

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6733](https://github.com/farion1231/cc-switch/pull/6733) Feat/kimi cli | 开放 | 2026-08-23 | `e2594910a714` |
| [#6379](https://github.com/farion1231/cc-switch/pull/6379) feat: add Kimi Code CLI support | 开放 | 2026-08-12 | `9066b9780f15` |

**代码层面的结论：** 两者不只是目标相同：Kimi 配置读写、供应商表单、MCP、Skills 和会话接入有大批相同新增代码。48 个非文档文件的规范化新增行集合完全相同；主要差别是分支版本适配、目录设置和构建配置。

**对应实现位置：**

- `src-tauri/src/kimi_config.rs`；[#6733 文件差异](https://github.com/farion1231/cc-switch/pull/6733/files#diff-267203018d6775cef2c5489489528492b5657c674c1d25efabd1c9aa7be1007d)、[#6379 文件差异](https://github.com/farion1231/cc-switch/pull/6379/files#diff-267203018d6775cef2c5489489528492b5657c674c1d25efabd1c9aa7be1007d)。
- `src-tauri/src/mcp/kimi.rs`；[#6733 文件差异](https://github.com/farion1231/cc-switch/pull/6733/files#diff-3f4a14aa6a03346e03fae0627f2b50edb90bef4479e5ecdf08059d13549bcc4e)、[#6379 文件差异](https://github.com/farion1231/cc-switch/pull/6379/files#diff-3f4a14aa6a03346e03fae0627f2b50edb90bef4479e5ecdf08059d13549bcc4e)。
- `src/components/providers/forms/KimiFormFields.tsx`；[#6733 文件差异](https://github.com/farion1231/cc-switch/pull/6733/files#diff-98868a86ea671c5135d249735020e817ab3378886e0d628109e6c65a20dea8cf)、[#6379 文件差异](https://github.com/farion1231/cc-switch/pull/6379/files#diff-98868a86ea671c5135d249735020e817ab3378886e0d628109e6c65a20dea8cf)。

**建议处理：** 先确认维护哪一条 Kimi 接入分支，再移入另一条的增量；不能把两套接入各合并一次。

<a id="a09"></a>

### A09　输出 token 上限过小导致请求被拒绝 [x]

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7126](https://github.com/farion1231/cc-switch/pull/7126) fix(proxy): clamp Claude Desktop probe token limits for Copilot/Responses | 开放 | 2026-09-04 | `cdfe63a51256` |
| [#7111](https://github.com/farion1231/cc-switch/pull/7111) fix(responses): clamp max_output_tokens to minimum 16 for Responses upstreams (#7103) | 开放 | 2026-09-04 | `5db92b9c0e12` |

**代码层面的结论：** #7111 把 Responses 的 max_output_tokens 最小值提高到 16；#7126 在同一转换路径做同样处理，还覆盖 Desktop 探测、Chat 和 Gemini。

**对应实现位置：**

- `src-tauri/src/proxy/providers/transform_responses.rs` — max_output_tokens；[#7126 文件差异](https://github.com/farion1231/cc-switch/pull/7126/files#diff-ea7c8c3fbe81c7be0b423c3cd9ec9a7bfcccc5da8a14d364c42c87b175f68049)、[#7111 文件差异](https://github.com/farion1231/cc-switch/pull/7111/files#diff-ea7c8c3fbe81c7be0b423c3cd9ec9a7bfcccc5da8a14d364c42c87b175f68049)。
- `src-tauri/src/proxy/providers/transform.rs` — clamp_min_output_tokens；[#7126 文件差异](https://github.com/farion1231/cc-switch/pull/7126/files#diff-f7892cc6ee6051fb3ba882385b961d1412ba6eb8e3dc633ae4998c57da9bf15a)。

**建议处理：** #7126 已覆盖 #7111 的核心修复；保留最低值、正常值等回归测试。

<a id="a10"></a>

### A10　火山引擎查错套餐额度 [x]

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7096](https://github.com/farion1231/cc-switch/pull/7096) fix(usage): route Volcengine quota by entry base_url and auto-reuse AK/SK | 开放 | 2026-09-03 | `1eb3390fd1b9` |
| [#6518](https://github.com/farion1231/cc-switch/pull/6518) fix(usage): route Volcengine quota by plan URL | 开放 | 2026-08-17 | `ea83292a0419` |

**代码层面的结论：** 两者都按 /api/coding 与 /api/plan 区分 GetCodingPlanUsage 和 GetAFPUsage，避免固定先查错误套餐。#7096 还增加 AK/SK 账号复用。

**对应实现位置：**

- `src-tauri/src/services/coding_plan.rs` — query_volcengine；[#7096 文件差异](https://github.com/farion1231/cc-switch/pull/7096/files#diff-ddf206d34c555a672b8f9f266e11370018b956b774803e1cb064b791963d7d05)、[#6518 文件差异](https://github.com/farion1231/cc-switch/pull/6518/files#diff-ddf206d34c555a672b8f9f266e11370018b956b774803e1cb064b791963d7d05)。

**建议处理：** 若采用 #7096，就整合 #6518 的测试；若只想先合入小修复，也可先合 #6518，再缩小 #7096 的差异。

<a id="a11"></a>

### A11　正文开始后又插入思考块

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6911](https://github.com/farion1231/cc-switch/pull/6911) fix(proxy): drop trailing reasoning after text block in Anthropic SSE | 开放 | 2026-08-27 | `6ce70d6f3aa9` |
| [#5706](https://github.com/farion1231/cc-switch/pull/5706) fix(proxy): avoid interleaved thinking blocks | 开放 | 2026-07-24 | `dbb27cc7863e` |

**代码层面的结论：** 两者都在同一 Chat→Anthropic 流转换函数记录“正文是否已经开始”，随后丢弃晚到的 reasoning，避免思考块和正文交错。变量名不同，核心行为相同。

**对应实现位置：**

- `src-tauri/src/proxy/providers/streaming.rs` — create_anthropic_sse_stream；[#6911 文件差异](https://github.com/farion1231/cc-switch/pull/6911/files#diff-ed18d5c43079a6f2baee8b8b697ab7dd625bd2a2b0450d1915ff41bd3148c796)、[#5706 文件差异](https://github.com/farion1231/cc-switch/pull/5706/files#diff-ed18d5c43079a6f2baee8b8b697ab7dd625bd2a2b0450d1915ff41bd3148c796)。

**建议处理：** 只维护一个状态标记和处理分支，合并两边测试。

<a id="a12"></a>

### A12　搜索会话中间的正文 [x]

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7896](https://github.com/farion1231/cc-switch/pull/7896) feat(sessions): search message text across sessions with a local FTS5 index | 开放 | 2026-10-06 | `078031d37d16` |
| [#6636](https://github.com/farion1231/cc-switch/pull/6636) feat(sessions): full-content search across session transcripts | 开放 | 2026-08-20 | `0f40390de9cd` |

**代码层面的结论：** 两者都新增后端正文搜索、命中摘要和前端结果合并。#6636 每次并行扫描消息；#7896 改用独立 SQLite FTS5 索引，支持增量更新、开关和点击定位。属于同一功能的两套方案。

**对应实现位置：**

- `src-tauri/src/session_manager/search.rs` — search_sessions / SessionIndex；[#7896 文件差异](https://github.com/farion1231/cc-switch/pull/7896/files#diff-9c9dd5f66ae6fb4f470dddba51f7732069a78883a5ee724ca0d0e29858d6eff0)、[#6636 文件差异](https://github.com/farion1231/cc-switch/pull/6636/files#diff-9c9dd5f66ae6fb4f470dddba51f7732069a78883a5ee724ca0d0e29858d6eff0)。
- `src/components/sessions/SessionManagerPage.tsx`；[#7896 文件差异](https://github.com/farion1231/cc-switch/pull/7896/files#diff-3b04cdc38cdfb7c28308dcac452bb8f2ea03a0d0b1476a800a0f6916fdb4439e)、[#6636 文件差异](https://github.com/farion1231/cc-switch/pull/6636/files#diff-3b04cdc38cdfb7c28308dcac452bb8f2ea03a0d0b1476a800a0f6916fdb4439e)。

**建议处理：** 先决定采用哪一种搜索实现；#7896 更贴近新的消息结构，但应确认其排除工具、思考和注入文本的搜索范围符合需求。

<a id="a13"></a>

### A13　会话中途追加的用户指令被当成系统消息 [x]

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7253](https://github.com/farion1231/cc-switch/pull/7253) feat(proxy): add opt-in conversation system conversion | 开放 | 2026-09-09 | `8ab078f18813` |
| [#7167](https://github.com/farion1231/cc-switch/pull/7167) fix(proxy): add opt-in Claude Code steer rectifier | 开放 | 2026-09-06 | `4511f95670da` |

**代码层面的结论：** 两者用相同的 Claude Code steer 前后缀识别规则，在 Chat 转换路径把会话中途的这类 system 消息改成 user。#7253 还加入 token 提醒、待办和后台任务通知的独立转换开关。

**对应实现位置：**

- `src-tauri/src/proxy/steer_rectifier.rs` — rectify_steer_messages；[#7167 文件差异](https://github.com/farion1231/cc-switch/pull/7167/files#diff-1a7c8899d1e24234f8e5f68e8517ecae86198a6fc83168a8deda68f4c46e72d1)。
- `src-tauri/src/proxy/response_system_rectifier.rs` — rectify_response_system_messages；[#7253 文件差异](https://github.com/farion1231/cc-switch/pull/7253/files#diff-3322cc760e883c569a4bc7f539af9aaaab832415840bd5c40a87cd1f98dbedc0)。

**建议处理：** #7253 已包含 #7167 的主要功能，不宜同时保留两套相同整流器。

## B 类：部分重叠：保留各自尚未覆盖的部分

- [B01 已合并面板动画修复只覆盖旧综合闪烁方案的一部分](#b01)（[#8201](https://github.com/farion1231/cc-switch/pull/8201)、[#7477](https://github.com/farion1231/cc-switch/pull/7477)）
- [B02 DeepSeek Harness 的三套供应商接入](#b02)（[#7356](https://github.com/farion1231/cc-switch/pull/7356)、[#7244](https://github.com/farion1231/cc-switch/pull/7244)、[#6444](https://github.com/farion1231/cc-switch/pull/6444)）
- [B03 DeepSeek Harness 用量导入的两套实现](#b03)（[#6724](https://github.com/farion1231/cc-switch/pull/6724)、[#6447](https://github.com/farion1231/cc-switch/pull/6447)）
- [B04 跟随系统代理开关和明确直连策略](#b04)（[#8016](https://github.com/farion1231/cc-switch/pull/8016)、[#7292](https://github.com/farion1231/cc-switch/pull/7292)、[#4270](https://github.com/farion1231/cc-switch/pull/4270)）
- [B05 Codex 自定义 model_provider 被改回 custom](#b05)（[#7971](https://github.com/farion1231/cc-switch/pull/7971)、[#7857](https://github.com/farion1231/cc-switch/pull/7857)、[#8067](https://github.com/farion1231/cc-switch/pull/8067)）
- [B06 Codex 旧官方代理会话兼容](#b06)（[#8001](https://github.com/farion1231/cc-switch/pull/8001)、[#7743](https://github.com/farion1231/cc-switch/pull/7743)）
- [B07 更早的 Kimi 接入方案也与新分支同目的](#b07)（[#6733](https://github.com/farion1231/cc-switch/pull/6733)、[#6379](https://github.com/farion1231/cc-switch/pull/6379)、[#4592](https://github.com/farion1231/cc-switch/pull/4592)）
- [B08 Windows 用量脚本的时间偏移](#b08)（[#7782](https://github.com/farion1231/cc-switch/pull/7782)、[#7754](https://github.com/farion1231/cc-switch/pull/7754)）
- [B09 Claude Desktop 自定义请求头](#b09)（[#7514](https://github.com/farion1231/cc-switch/pull/7514)、[#7502](https://github.com/farion1231/cc-switch/pull/7502)）
- [B10 LiteLLM 模型的输入输出上限](#b10)（[#7068](https://github.com/farion1231/cc-switch/pull/7068)、[#7040](https://github.com/farion1231/cc-switch/pull/7040)）
- [B11 供应商图标的姓名缩写](#b11)（[#8139](https://github.com/farion1231/cc-switch/pull/8139)、[#7035](https://github.com/farion1231/cc-switch/pull/7035)）
- [B12 Claude Desktop 深链接导入](#b12)（[#7667](https://github.com/farion1231/cc-switch/pull/7667)、[#7587](https://github.com/farion1231/cc-switch/pull/7587)、[#6489](https://github.com/farion1231/cc-switch/pull/6489)、[#3249](https://github.com/farion1231/cc-switch/pull/3249)）
- [B13 Hermes 切换后仍使用旧地址](#b13)（[#7144](https://github.com/farion1231/cc-switch/pull/7144)、[#6722](https://github.com/farion1231/cc-switch/pull/6722)、[#5950](https://github.com/farion1231/cc-switch/pull/5950)）
- [B14 Responses 消息 ID 不合法](#b14)（[#8216](https://github.com/farion1231/cc-switch/pull/8216)、[#5740](https://github.com/farion1231/cc-switch/pull/5740)）
- [B15 Codex 深链接导入丢失配置](#b15)（[#7944](https://github.com/farion1231/cc-switch/pull/7944)、[#7455](https://github.com/farion1231/cc-switch/pull/7455)、[#7054](https://github.com/farion1231/cc-switch/pull/7054)、[#6753](https://github.com/farion1231/cc-switch/pull/6753)、[#5514](https://github.com/farion1231/cc-switch/pull/5514)）
- [B16 Gemini 工具签名位置与丢失](#b16)（[#7143](https://github.com/farion1231/cc-switch/pull/7143)、[#6848](https://github.com/farion1231/cc-switch/pull/6848)、[#6728](https://github.com/farion1231/cc-switch/pull/6728)、[#6690](https://github.com/farion1231/cc-switch/pull/6690)）
- [B17 数据库与备份文件权限](#b17)（[#6417](https://github.com/farion1231/cc-switch/pull/6417)、[#6412](https://github.com/farion1231/cc-switch/pull/6412)、[#4475](https://github.com/farion1231/cc-switch/pull/4475)）
- [B18 中文输入法输入供应商字段](#b18)（[#6648](https://github.com/farion1231/cc-switch/pull/6648)、[#6500](https://github.com/farion1231/cc-switch/pull/6500)）
- [B19 把回复中的模型名改回请求模型名](#b19)（[#7444](https://github.com/farion1231/cc-switch/pull/7444)、[#5580](https://github.com/farion1231/cc-switch/pull/5580)）
- [B20 Claude count_tokens 路由](#b20)（[#5581](https://github.com/farion1231/cc-switch/pull/5581)、[#4999](https://github.com/farion1231/cc-switch/pull/4999)）
- [B21 S3 / 阿里云 OSS 地址格式](#b21)（[#7136](https://github.com/farion1231/cc-switch/pull/7136)、[#4439](https://github.com/farion1231/cc-switch/pull/4439)、[#4262](https://github.com/farion1231/cc-switch/pull/4262)）
- [B22 WebDAV 的 User-Agent](#b22)（[#5456](https://github.com/farion1231/cc-switch/pull/5456)、[#1142](https://github.com/farion1231/cc-switch/pull/1142)）
- [B23 用量统计选择日期漏算当天](#b23)（[#4720](https://github.com/farion1231/cc-switch/pull/4720)、[#4501](https://github.com/farion1231/cc-switch/pull/4501)）
- [B24 自动进入轻量模式](#b24)（[#7158](https://github.com/farion1231/cc-switch/pull/7158)、[#7114](https://github.com/farion1231/cc-switch/pull/7114)、[#4693](https://github.com/farion1231/cc-switch/pull/4693)）
- [B25 MCP 自动同步开关与管理范围](#b25)（[#7082](https://github.com/farion1231/cc-switch/pull/7082)、[#6673](https://github.com/farion1231/cc-switch/pull/6673)、[#4787](https://github.com/farion1231/cc-switch/pull/4787)、[#4694](https://github.com/farion1231/cc-switch/pull/4694)）
- [B26 Skills 分类和项目来源分组](#b26)（[#8251](https://github.com/farion1231/cc-switch/pull/8251)、[#8095](https://github.com/farion1231/cc-switch/pull/8095)）
- [B27 无界面命令行管理](#b27)（[#7969](https://github.com/farion1231/cc-switch/pull/7969)、[#7919](https://github.com/farion1231/cc-switch/pull/7919)）
- [B28 跨应用复制供应商](#b28)（[#7225](https://github.com/farion1231/cc-switch/pull/7225)、[#5026](https://github.com/farion1231/cc-switch/pull/5026)）
- [B29 流式回复末尾重复显示正文](#b29)（[#6793](https://github.com/farion1231/cc-switch/pull/6793)、[#6766](https://github.com/farion1231/cc-switch/pull/6766)）
- [B30 长会话自定义标题找不到](#b30)（[#6809](https://github.com/farion1231/cc-switch/pull/6809)、[#5701](https://github.com/farion1231/cc-switch/pull/5701)）
- [B31 自适应思考与强制工具调用不兼容](#b31)（[#8048](https://github.com/farion1231/cc-switch/pull/8048)、[#7768](https://github.com/farion1231/cc-switch/pull/7768)、[#7692](https://github.com/farion1231/cc-switch/pull/7692)）
- [B32 模型列表请求缺少标准请求头](#b32)（[#7429](https://github.com/farion1231/cc-switch/pull/7429)、[#3915](https://github.com/farion1231/cc-switch/pull/3915)）
- [B33 已合并的延迟会话读取优化与旧方案](#b33)（[#8218](https://github.com/farion1231/cc-switch/pull/8218)、[#5979](https://github.com/farion1231/cc-switch/pull/5979)、[#8230](https://github.com/farion1231/cc-switch/pull/8230)）

<a id="b01"></a>

### B01　已合并面板动画修复只覆盖旧综合闪烁方案的一部分

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8201](https://github.com/farion1231/cc-switch/pull/8201) fix(ui): panel flicker | 已合并 | 2026-10-12 | `34cbc44ae5eb` |
| [#7477](https://github.com/farion1231/cc-switch/pull/7477) fix(ui): prevent flicker during view transitions | 开放 | 2026-09-18 | `09b1151ac663` |

**代码层面的结论：** 已合并 #8201 将 FullScreenPanel 默认动画从 fade 改为 none，覆盖了旧 #7477 所处理的整屏透明过渡重影这一场景。但 #7477 还把供应商搜索框、会话目录按钮和 Skills 导入弹窗移到 Portal，调整会话默认选中，以及订阅面板关闭事件；这些不能由“关闭默认淡入动画”替代。

**对应实现位置：**

- `src/components/common/FullScreenPanel.tsx` — motionPreset、subscribeToFullScreenPanelDismiss；[#8201 文件差异](https://github.com/farion1231/cc-switch/pull/8201/files#diff-522ac4e1a97785b50bb652d31f8952cd53271749ef00074f4894a435619bf5b9)、[#7477 文件差异](https://github.com/farion1231/cc-switch/pull/7477/files#diff-522ac4e1a97785b50bb652d31f8952cd53271749ef00074f4894a435619bf5b9)。
- `src/components/providers/ProviderList.tsx` — createPortal；[#7477 文件差异](https://github.com/farion1231/cc-switch/pull/7477/files#diff-6dbbdac59b15a2802ef35996f024581059f41ef083f54a744483b78d27807ff1)。
- `src/components/sessions/SessionToc.tsx`；[#7477 文件差异](https://github.com/farion1231/cc-switch/pull/7477/files#diff-fd721367ed6458fd4a4cfafb445d08122f4aa98aae9827c33e0d251a032946ed)。
- `src/components/skills/UnifiedSkillsPanel.tsx`；[#7477 文件差异](https://github.com/farion1231/cc-switch/pull/7477/files#diff-44846724be98e928679407d8094d0226b5396f36fdf7b78985ac60539e8c84ba)。

**建议处理：** 先从 #7477 剥离或重做已被新面板实现覆盖的部分，再逐项评审定位、关闭事件和会话选择的剩余改动，不应整份判为无用。

<a id="b02"></a>

### B02　DeepSeek Harness 的三套供应商接入

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7356](https://github.com/farion1231/cc-switch/pull/7356) feat: support DeepSeek Harness | 开放 | 2026-09-13 | `2a54ae6a9deb` |
| [#7244](https://github.com/farion1231/cc-switch/pull/7244) feat(dsh): add DeepSeek Harness as an AppType target | 开放 | 2026-09-09 | `157409f9c6c4` |
| [#6444](https://github.com/farion1231/cc-switch/pull/6444) feat: add DeepSeek Harness live configuration support | 开放 | 2026-08-14 | `3ad4b572dd41` |

**代码层面的结论：** 三者都要管理 DSH 供应商和配置，但接入架构不同。#7356 用 AppType::DeepSeekHarness 和 deepseek-harness 标识，并通过 dsh_state 读取原生当前状态；#7244 用 AppType::Dsh 和 dsh 标识，接入 additive 应用流程；#6444 则增加独立 DSH 页面及专用命令。属于同一需求的不同实现，不能直接把三个 PR 全部叠加。

**对应实现位置：**

- `src-tauri/src/app_config.rs` — AppType；[#7356 文件差异](https://github.com/farion1231/cc-switch/pull/7356/files#diff-1d6f7b1955584f85c4459aaf6179c370406135b4ef22b01a5360eaa4c5a0dc01)、[#7244 文件差异](https://github.com/farion1231/cc-switch/pull/7244/files#diff-1d6f7b1955584f85c4459aaf6179c370406135b4ef22b01a5360eaa4c5a0dc01)。
- `src-tauri/src/deepseek_harness_config.rs`；[#7356 文件差异](https://github.com/farion1231/cc-switch/pull/7356/files#diff-8b9fa9128128e74373840319432cec891f7d2663d985c9619faadf0403a21aae)。
- `src-tauri/src/services/dsh_state.rs`；[#7356 文件差异](https://github.com/farion1231/cc-switch/pull/7356/files#diff-b5151f9f9094a0b16fe6a113d8ba499b5cca2662529700e6711deed08f5aa939)。
- `src-tauri/src/dsh_config.rs`；[#7244 文件差异](https://github.com/farion1231/cc-switch/pull/7244/files#diff-9e46147be0cf4418b42c88d952d3c239ce11ab5949bdd0911358cc2c841cd957)、[#6444 文件差异](https://github.com/farion1231/cc-switch/pull/6444/files#diff-9e46147be0cf4418b42c88d952d3c239ce11ab5949bdd0911358cc2c841cd957)。
- `src-tauri/src/commands/dsh.rs`；[#6444 文件差异](https://github.com/farion1231/cc-switch/pull/6444/files#diff-2ebd32add6284fa50a641e653ed4b03adf752f329e308605d5c6a95cac3b221c)。

**建议处理：** 先选定一种应用接入架构和统一标识，再移入其他实现的独立能力；不能仅因 #7356 较新就判定另外两个已被完整覆盖。

<a id="b03"></a>

### B03　DeepSeek Harness 用量导入的两套实现

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6724](https://github.com/farion1231/cc-switch/pull/6724) feat(usage): add DSH session usage importer | 开放 | 2026-08-23 | `ea2574a2c7ed` |
| [#6447](https://github.com/farion1231/cc-switch/pull/6447) feat(usage): import DeepSeek Harness session usage | 开放 | 2026-08-14 | `c058a021ebf3` |

**代码层面的结论：** 两者都读取 DSH 的 zstd 会话日志并记入用量，但 #6724 使用 app_type=dsh、source=dsh_session 和 dsh: 去重前缀；#6447 使用 deepseek-harness 和 deepseek_harness_session，并自带目录配置与扫描进度。若同一日志经过两套身份不同的导入器，存在重复统计风险。

**对应实现位置：**

- `src-tauri/src/services/session_usage_dsh.rs`；[#6724 文件差异](https://github.com/farion1231/cc-switch/pull/6724/files#diff-cefddc522a3076ec3eb7f20742e0fc456e166fb9f75cccfae7b34b89d72a2ce5)。
- `src-tauri/src/services/session_usage_deepseek_harness.rs`；[#6447 文件差异](https://github.com/farion1231/cc-switch/pull/6447/files#diff-1c18383c16f894a2ebdd81e2c0cdafb24321cb889f463082f2b37b49ce6501aa)。
- `src-tauri/src/services/session_usage.rs` — sync_all_unlocked；[#6724 文件差异](https://github.com/farion1231/cc-switch/pull/6724/files#diff-ae11a292ae76a6990957db66d6766d9d2a3b559da3e319ca84b46600e241e892)、[#6447 文件差异](https://github.com/farion1231/cc-switch/pull/6447/files#diff-ae11a292ae76a6990957db66d6766d9d2a3b559da3e319ca84b46600e241e892)。

**建议处理：** 统一应用标识、数据来源、目录规则和去重记录，只保留一个导入入口；目录配置和已有数据迁移需要一并考虑。

<a id="b04"></a>

### B04　跟随系统代理开关和明确直连策略

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8016](https://github.com/farion1231/cc-switch/pull/8016) fix(proxy): 修复 #8004 直连策略不明确及旧代理客户端残留 | 开放 | 2026-10-09 | `c2ef7f46c0a8` |
| [#7292](https://github.com/farion1231/cc-switch/pull/7292) feat(proxy): 全局出站代理支持关闭跟随系统代理并显示当前生效代理 | 开放 | 2026-09-11 | `a08f629b0696` |
| [#4270](https://github.com/farion1231/cc-switch/pull/4270) fix(proxy):allow toggling system proxy on startup without restart/支持启动时切换是否跟随系统代理，无需重启 | 开放 | 2026-06-15 | `bd178cb19084` |

**代码层面的结论：** 三个 PR 都增加是否跟随系统代理的设置，并在关闭跟随且无显式代理时调用 no_proxy。#8016 把客户端与代理策略放到同一状态锁里；#7292 另有当前生效代理、来源和变化提示；#4270 是较早的开关与即时重建客户端实现。共同功能很明确，但较新修复没有包含旧方案全部状态展示。

**对应实现位置：**

- `src-tauri/src/proxy/http_client.rs` — build_client、set_follow_system_proxy；[#8016 文件差异](https://github.com/farion1231/cc-switch/pull/8016/files#diff-8f58cc28ac6618d022c1a9049d0487cb5fd1f1c8fcd6a46facdb657adc006d17)、[#7292 文件差异](https://github.com/farion1231/cc-switch/pull/7292/files#diff-8f58cc28ac6618d022c1a9049d0487cb5fd1f1c8fcd6a46facdb657adc006d17)、[#4270 文件差异](https://github.com/farion1231/cc-switch/pull/4270/files#diff-8f58cc28ac6618d022c1a9049d0487cb5fd1f1c8fcd6a46facdb657adc006d17)。
- `src-tauri/src/commands/global_proxy.rs`；[#8016 文件差异](https://github.com/farion1231/cc-switch/pull/8016/files#diff-3ca498fd68ade594ce376c29af031b71e03e7ab158ef61e2561f7ee8ac25798d)、[#7292 文件差异](https://github.com/farion1231/cc-switch/pull/7292/files#diff-3ca498fd68ade594ce376c29af031b71e03e7ab158ef61e2561f7ee8ac25798d)、[#4270 文件差异](https://github.com/farion1231/cc-switch/pull/4270/files#diff-3ca498fd68ade594ce376c29af031b71e03e7ab158ef61e2561f7ee8ac25798d)。
- `src/components/settings/GlobalProxySettings.tsx`；[#8016 文件差异](https://github.com/farion1231/cc-switch/pull/8016/files#diff-25554c4ee402eab2db73edaaaa96c4cc227dd46f7e0f6064c7a38cef2ee2de0d)、[#7292 文件差异](https://github.com/farion1231/cc-switch/pull/7292/files#diff-25554c4ee402eab2db73edaaaa96c4cc227dd46f7e0f6064c7a38cef2ee2de0d)、[#4270 文件差异](https://github.com/farion1231/cc-switch/pull/4270/files#diff-25554c4ee402eab2db73edaaaa96c4cc227dd46f7e0f6064c7a38cef2ee2de0d)。

**建议处理：** 整合为一套代理策略及设置入口，保留需要的状态展示；不要同时维护三种客户端状态。

<a id="b05"></a>

### B05　Codex 自定义 model_provider 被改回 custom

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7971](https://github.com/farion1231/cc-switch/pull/7971) fix(codex): keep a provider's own model_provider when unified session history is off | 开放 | 2026-10-08 | `fc5df1530ef3` |
| [#7857](https://github.com/farion1231/cc-switch/pull/7857) feat(codex): keep an explicit model provider id through every write path | 开放 | 2026-10-04 | `ca68b02bc11a` |
| [#8067](https://github.com/farion1231/cc-switch/pull/8067) fix: config improvements — usage display, autosave debounce, OAuth version, model provider, first token column | 开放 | 2026-10-10 | `11c32ceaa496` |

**代码层面的结论：** #7857 与 #7971 都修改配置写入和供应商编辑路径，保留自定义 provider ID。区别是 #7971 明确跟随“统一会话历史”开关，关闭时保留原 ID；#7857 还新增表单和深链接显式 ID 入口。较新的综合 PR #8067 在这里仅调整模型目录使用的 catalog_input_text，并从 ProviderMeta 取 ID，没有同样修改真实配置的 RouteWrite 路径，因此不能代替前两者。

**对应实现位置：**

- `src-tauri/src/live/project/codex.rs` — RouteWrite::Custom、catalog_input_text；[#7971 文件差异](https://github.com/farion1231/cc-switch/pull/7971/files#diff-15bb7628e1b42c0ac6961fcdf59ba03d5bff0c5a23ae96f5f54489341d54f663)、[#7857 文件差异](https://github.com/farion1231/cc-switch/pull/7857/files#diff-15bb7628e1b42c0ac6961fcdf59ba03d5bff0c5a23ae96f5f54489341d54f663)、[#8067 文件差异](https://github.com/farion1231/cc-switch/pull/8067/files#diff-15bb7628e1b42c0ac6961fcdf59ba03d5bff0c5a23ae96f5f54489341d54f663)。
- `src-tauri/src/services/provider/codex_direct.rs` — plan；[#7971 文件差异](https://github.com/farion1231/cc-switch/pull/7971/files#diff-d189418df9a8b6dba5416da415b22aa2cccf8f054d367a32254839322a57cfdf)、[#7857 文件差异](https://github.com/farion1231/cc-switch/pull/7857/files#diff-d189418df9a8b6dba5416da415b22aa2cccf8f054d367a32254839322a57cfdf)、[#8067 文件差异](https://github.com/farion1231/cc-switch/pull/8067/files#diff-d189418df9a8b6dba5416da415b22aa2cccf8f054d367a32254839322a57cfdf)。
- `src/components/providers/forms/CodexFormFields.tsx`；[#7857 文件差异](https://github.com/farion1231/cc-switch/pull/7857/files#diff-256e6901d1015fb043a7d18ff7b7e03b4cf0ccf1386eb615b8baacd2d9aa7b90)。

**建议处理：** 先统一“显式 ID”和“统一会话历史”开关的优先级，再整合前两条；#8067 应拆出相关片段对接统一实现，其他用量、自动保存等内容另行评审。

<a id="b06"></a>

### B06　Codex 旧官方代理会话兼容

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8001](https://github.com/farion1231/cc-switch/pull/8001) fix(codex): 补全 #7948 旧会话兼容与保存反馈 | 开放 | 2026-10-09 | `bc96b5059e17` |
| [#7743](https://github.com/farion1231/cc-switch/pull/7743) fix(codex): preserve legacy official proxy session definitions | 开放 | 2026-09-29 | `d4b1210aa1d2` |

**代码层面的结论：** 两者都在 CodexConfigPatch 清理旧路由表时保留 OFFICIAL_PROXY_ROUTE_ID，并补兼容镜像。#8001 使用 LegacyOfficialMirrorPatch，识别旧镜像且在官方路径按需补表；#7743 还引入 CodexEditorSnapshot / CodexEditorEdits，处理编辑期间的快照与冲突意图。不能把较新 PR 的兼容修复当成旧 PR 全部完成。

**对应实现位置：**

- `src-tauri/src/live/project/codex.rs` — LegacyOfficialMirrorPatch、OFFICIAL_PROXY_ROUTE_ID；[#8001 文件差异](https://github.com/farion1231/cc-switch/pull/8001/files#diff-15bb7628e1b42c0ac6961fcdf59ba03d5bff0c5a23ae96f5f54489341d54f663)、[#7743 文件差异](https://github.com/farion1231/cc-switch/pull/7743/files#diff-15bb7628e1b42c0ac6961fcdf59ba03d5bff0c5a23ae96f5f54489341d54f663)。
- `src-tauri/src/services/provider/codex_editor.rs` — plan_save；[#8001 文件差异](https://github.com/farion1231/cc-switch/pull/8001/files#diff-f006dc5f90b99bcbbaca7f61875be84494b0cdb6f3e3fe35524121f9c391d7d7)、[#7743 文件差异](https://github.com/farion1231/cc-switch/pull/7743/files#diff-f006dc5f90b99bcbbaca7f61875be84494b0cdb6f3e3fe35524121f9c391d7d7)。

**建议处理：** 共用旧会话兼容逻辑，单独评估 #7743 的编辑快照与冲突处理；与 #7980/#8001 的依赖关系一起整理。

<a id="b07"></a>

### B07　更早的 Kimi 接入方案也与新分支同目的

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6733](https://github.com/farion1231/cc-switch/pull/6733) Feat/kimi cli | 开放 | 2026-08-23 | `e2594910a714` |
| [#6379](https://github.com/farion1231/cc-switch/pull/6379) feat: add Kimi Code CLI support | 开放 | 2026-08-12 | `9066b9780f15` |
| [#4592](https://github.com/farion1231/cc-switch/pull/4592) feat: add Kimi Code integration | 开放 | 2026-06-24 | `4242dba99537` |

**代码层面的结论：** 除 #6733/#6379 的高度重合之外，#4592 也新增 kimi_config.rs，读取同样的 KIMI_CODE_HOME 或 .kimi-code/config.toml，以及 mcp.json。它还处理 extra_skill_dirs；新两条的配置层使用 DocumentMut、写入锁和 atomic_write。目标相同，但配置读写和扩展目录处理不是简单相同行替换。

**对应实现位置：**

- `src-tauri/src/kimi_config.rs` — get_kimi_dir、get_kimi_extra_skill_dirs、kimi_write_lock、write_kimi_config；[#6733 文件差异](https://github.com/farion1231/cc-switch/pull/6733/files#diff-267203018d6775cef2c5489489528492b5657c674c1d25efabd1c9aa7be1007d)、[#6379 文件差异](https://github.com/farion1231/cc-switch/pull/6379/files#diff-267203018d6775cef2c5489489528492b5657c674c1d25efabd1c9aa7be1007d)、[#4592 文件差异](https://github.com/farion1231/cc-switch/pull/4592/files#diff-267203018d6775cef2c5489489528492b5657c674c1d25efabd1c9aa7be1007d)。

**建议处理：** 把 #4592 纳入同一 Kimi 接入讨论；核对额外 Skills 目录等差异后整合，不宜把三套接入分别合入。

<a id="b08"></a>

### B08　Windows 用量脚本的时间偏移

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7782](https://github.com/farion1231/cc-switch/pull/7782) fix(usage-script): correct Date timezone unit on Windows (#7751) | 开放 | 2026-09-30 | `a898e66bf184` |
| [#7754](https://github.com/farion1231/cc-switch/pull/7754) fix(usage): correct Date timezone units in the usage-script sandbox on Windows | 开放 | 2026-09-29 | `800d15c91c9b` |

**代码层面的结论：** 都修 QuickJS 把分钟误当小时的时区问题。但较新的 #7782 只覆盖时间读取，并使用当前时刻的固定偏移；#7754 还处理 setter、多参数 Date 构造、本地时间解析和按时间戳求偏移。

**对应实现位置：**

- `src-tauri/src/usage_script.rs` — timezone_shim / TIMEZONE_SHIM_PRELUDE；[#7782 文件差异](https://github.com/farion1231/cc-switch/pull/7782/files#diff-8f038eb24ae8dd345114b376f9f73ac00ea5da6dc812095aa03964506bb4b9fb)、[#7754 文件差异](https://github.com/farion1231/cc-switch/pull/7754/files#diff-8f038eb24ae8dd345114b376f9f73ac00ea5da6dc812095aa03964506bb4b9fb)。

**建议处理：** 不能按“新 PR 替代旧 PR”直接关闭 #7754；先统一读写、夏令时和非法日期的行为。

<a id="b09"></a>

### B09　Claude Desktop 自定义请求头

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7514](https://github.com/farion1231/cc-switch/pull/7514)   feat(claude-desktop): support custom headers via proxy request overrides in model mapping form | 开放 | 2026-09-20 | `0414415cb59a` |
| [#7502](https://github.com/farion1231/cc-switch/pull/7502) feat(claude-desktop): 支持为模型映射配置自定义请求头 | 开放 | 2026-09-19 | `ae83263502f3` |

**代码层面的结论：** 都把模型映射表单里的 headers 保存到 localProxyRequestOverrides。#7514 还开放 body 和 User-Agent；#7502 只开放请求头，并有自己的适用条件和代理回归测试。

**对应实现位置：**

- `src/components/providers/forms/ClaudeDesktopProviderForm.tsx`；[#7514 文件差异](https://github.com/farion1231/cc-switch/pull/7514/files#diff-a0971e18c820789c678fc0e273d24bfecf601184f1cbaa20f19f2816326a34ea)、[#7502 文件差异](https://github.com/farion1231/cc-switch/pull/7502/files#diff-a0971e18c820789c678fc0e273d24bfecf601184f1cbaa20f19f2816326a34ea)。
- `src/components/providers/forms/LocalProxyRequestOverridesField.tsx`；[#7502 文件差异](https://github.com/farion1231/cc-switch/pull/7502/files#diff-23b5a4951b3eb6444842d183100866d6941aec4c207aab557a6aea46f2c6eb14)。

**建议处理：** 整合一个表单入口，同时决定是否开放请求体覆盖及 Copilot 等特殊供应商的适用范围。

<a id="b10"></a>

### B10　LiteLLM 模型的输入输出上限

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7068](https://github.com/farion1231/cc-switch/pull/7068) feat(models): support LiteLLM max_input_tokens and max_output_tokens in /v1/models (#7039) | 开放 | 2026-09-02 | `cf4219fb9767` |
| [#7040](https://github.com/farion1231/cc-switch/pull/7040) Support LiteLLM model token limits from /v1/models | 开放 | 2026-09-01 | `62471e4d9208` |

**代码层面的结论：** 后端 FetchedModel 都增加 max_input_tokens / max_output_tokens。较新的 #7068 主要完成后端；较旧的 #7040 还把数值传入 Pi 模型表单，并区分自动填写与手动填写。

**对应实现位置：**

- `src-tauri/src/services/model_fetch.rs` — FetchedModel；[#7068 文件差异](https://github.com/farion1231/cc-switch/pull/7068/files#diff-f4acaedb8302aba7bee08f38f4f7b6788fbf5cbf0047625d8fe47492f0ba4b8f)、[#7040 文件差异](https://github.com/farion1231/cc-switch/pull/7040/files#diff-f4acaedb8302aba7bee08f38f4f7b6788fbf5cbf0047625d8fe47492f0ba4b8f)。
- `src/components/providers/forms/PiProviderForm.tsx` — changeModelId；[#7040 文件差异](https://github.com/farion1231/cc-switch/pull/7040/files#diff-b89cf721560a06d263a27f2d9115259b04e159e0f68e734ee2a432679b0ea19f)。
- `src/components/providers/forms/shared/ModelDropdown.tsx`；[#7040 文件差异](https://github.com/farion1231/cc-switch/pull/7040/files#diff-b97653d91785b2d037c780812b751d7a79dfca3c086ac972b5fea8a553080044)。

**建议处理：** 不能用 #7068 整体替代 #7040；需要保留后者的前端联动。

<a id="b11"></a>

### B11　供应商图标的姓名缩写

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8139](https://github.com/farion1231/cc-switch/pull/8139) fix(ui): handle surrogate pairs and whitespace in provider icon initials fallback | 开放 | 2026-10-11 | `fed3b3ad7c44` |
| [#7035](https://github.com/farion1231/cc-switch/pull/7035) fix(ui): handle leading and consecutive whitespace in ProviderIcon fallback initials | 开放 | 2026-09-01 | `c8c505709a7b` |

**代码层面的结论：** 都修前导空格和连续空白导致缩写异常；#8139 还按 Unicode 字符处理 emoji 等。#7035 明确给空名称返回问号，两者空名称路径并不相同。

**对应实现位置：**

- `src/components/ProviderIcon.tsx` — getProviderInitials / initials；[#8139 文件差异](https://github.com/farion1231/cc-switch/pull/8139/files#diff-11f4a5cb4d83670687f075d2dfa348bb3df7f66c1dd269f134c95fb13e2b6317)、[#7035 文件差异](https://github.com/farion1231/cc-switch/pull/7035/files#diff-11f4a5cb4d83670687f075d2dfa348bb3df7f66c1dd269f134c95fb13e2b6317)。

**建议处理：** 把空白、空名称、emoji 的预期统一后合成一份修复。

<a id="b12"></a>

### B12　Claude Desktop 深链接导入

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7667](https://github.com/farion1231/cc-switch/pull/7667) feat(deeplink): support Claude Desktop providers with direct/proxy write modes | 开放 | 2026-09-24 | `cc5695d2fb7b` |
| [#7587](https://github.com/farion1231/cc-switch/pull/7587) fix(deeplink): support Claude Desktop provider imports | 开放 | 2026-09-22 | `4fa06fe74816` |
| [#6489](https://github.com/farion1231/cc-switch/pull/6489) fix(deeplink): support Claude Desktop provider imports | 开放 | 2026-08-15 | `792af43c0dcd` |
| [#3249](https://github.com/farion1231/cc-switch/pull/3249) fix(deeplink): accept claude-desktop aliases in provider import URLs | 开放 | 2026-05-28 | `af06a181ff61` |

**代码层面的结论：** 四个 PR 都碰到同一导入链。#7587 覆盖旧的应用类型识别、别名及配置合并，并自动判断直连/代理；#7667 使用显式 claudeDesktopMode 参数，还修改链接生成器。两种模式选择策略不同。

**对应实现位置：**

- `src-tauri/src/deeplink/parser.rs` — parse_provider_deeplink；[#7667 文件差异](https://github.com/farion1231/cc-switch/pull/7667/files#diff-c614a1cdcd5f451dd9d2e0125df9905838f52898709d5c119b85d5168b7fbb7a)、[#7587 文件差异](https://github.com/farion1231/cc-switch/pull/7587/files#diff-c614a1cdcd5f451dd9d2e0125df9905838f52898709d5c119b85d5168b7fbb7a)、[#6489 文件差异](https://github.com/farion1231/cc-switch/pull/6489/files#diff-c614a1cdcd5f451dd9d2e0125df9905838f52898709d5c119b85d5168b7fbb7a)、[#3249 文件差异](https://github.com/farion1231/cc-switch/pull/3249/files#diff-c614a1cdcd5f451dd9d2e0125df9905838f52898709d5c119b85d5168b7fbb7a)。
- `src-tauri/src/deeplink/provider.rs` — build_provider_from_request；[#7667 文件差异](https://github.com/farion1231/cc-switch/pull/7667/files#diff-f961825b4737474f72e127ad4ea7603fb84084cd5b7662aa5eb133a21b3d18e5)、[#7587 文件差异](https://github.com/farion1231/cc-switch/pull/7587/files#diff-f961825b4737474f72e127ad4ea7603fb84084cd5b7662aa5eb133a21b3d18e5)、[#6489 文件差异](https://github.com/farion1231/cc-switch/pull/6489/files#diff-f961825b4737474f72e127ad4ea7603fb84084cd5b7662aa5eb133a21b3d18e5)、[#3249 文件差异](https://github.com/farion1231/cc-switch/pull/3249/files#diff-f961825b4737474f72e127ad4ea7603fb84084cd5b7662aa5eb133a21b3d18e5)。
- `deplink.html`；[#7667 文件差异](https://github.com/farion1231/cc-switch/pull/7667/files#diff-f18425fd74d4312f73717417d2dbc27280706a3b882c5e8b1448aaf53825a068)。

**建议处理：** #7587 可吸收 #6489、#3249 的核心修复；与 #7667 应统一模式参数、别名和导入后是否立即启用，不能直接全选合并。

<a id="b13"></a>

### B13　Hermes 切换后仍使用旧地址

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7144](https://github.com/farion1231/cc-switch/pull/7144) fix(hermes): sync provider endpoint fields into model section on switch | 开放 | 2026-09-05 | `d32c389c7e64` |
| [#6722](https://github.com/farion1231/cc-switch/pull/6722) fix(hermes): apply new provider base_url in apply_switch_defaults (#6717) | 开放 | 2026-08-23 | `cea7e34249d4` |
| [#5950](https://github.com/farion1231/cc-switch/pull/5950) fix(hermes): refresh model defaults on provider switch | 开放 | 2026-07-31 | `aeb991a9e41b` |

**代码层面的结论：** 都修改 apply_switch_defaults。#6722 更新 base_url；#7144 还同步/清理认证和协议字段；#5950 只替换仍沿用旧供应商默认值的字段，并保留用户覆盖，同时刷新模型上限。

**对应实现位置：**

- `src-tauri/src/hermes_config.rs` — apply_switch_defaults、refresh_provider_derived_value；[#7144 文件差异](https://github.com/farion1231/cc-switch/pull/7144/files#diff-c62a717c9cdd86f83040f4714401e0c10c1418e746de8c51c8699012bca3ec29)、[#6722 文件差异](https://github.com/farion1231/cc-switch/pull/6722/files#diff-c62a717c9cdd86f83040f4714401e0c10c1418e746de8c51c8699012bca3ec29)、[#5950 文件差异](https://github.com/farion1231/cc-switch/pull/5950/files#diff-c62a717c9cdd86f83040f4714401e0c10c1418e746de8c51c8699012bca3ec29)。

**建议处理：** #7144 覆盖地址切换问题，但不能声称完整替代 #5950；先决定是否保留用户手动覆盖。

<a id="b14"></a>

### B14　Responses 消息 ID 不合法

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8216](https://github.com/farion1231/cc-switch/pull/8216) fix(codex): emit valid Responses item ids from Chat bridge (msg_ prefix + charset sanitize) | 开放 | 2026-10-13 | `4de40ebe2caf` |
| [#5740](https://github.com/farion1231/cc-switch/pull/5740) fix(proxy): repair Responses message item IDs | 开放 | 2026-07-24 | `b9b4a9c4ed60` |

**代码层面的结论：** 都把 Chat 桥接生成的消息 ID 改成 msg_ 前缀。#8216 还清理特殊字符；旧 #5740 同时修 Anthropic 桥接和重放历史中的旧 ID。

**对应实现位置：**

- `src-tauri/src/proxy/providers/transform_codex_chat.rs`；[#8216 文件差异](https://github.com/farion1231/cc-switch/pull/8216/files#diff-06d8e880369debba9c0f1498aa005efdbab9f39e99497da3a4cc37c626e756ac)、[#5740 文件差异](https://github.com/farion1231/cc-switch/pull/5740/files#diff-06d8e880369debba9c0f1498aa005efdbab9f39e99497da3a4cc37c626e756ac)。
- `src-tauri/src/proxy/providers/streaming_codex_chat.rs`；[#8216 文件差异](https://github.com/farion1231/cc-switch/pull/8216/files#diff-5e25a4b8908557fb0aeb5d8360324f241256147633f7949a27372d91325328f6)、[#5740 文件差异](https://github.com/farion1231/cc-switch/pull/5740/files#diff-5e25a4b8908557fb0aeb5d8360324f241256147633f7949a27372d91325328f6)。
- `src-tauri/src/proxy/providers/codex_message_items.rs`；[#5740 文件差异](https://github.com/farion1231/cc-switch/pull/5740/files#diff-bba2efea4490bc373ff245f9e512cc789cadf954cf423fb77a0f69fdd526636e)。

**建议处理：** 采用一套共享 ID 规则，保留两种桥接及旧历史修复；#8216 不是对 #5740 的完整替代。

<a id="b15"></a>

### B15　Codex 深链接导入丢失配置

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7944](https://github.com/farion1231/cc-switch/pull/7944) fix(deeplink): preserve Codex model_catalog_url on import | 开放 | 2026-10-08 | `460466c347f5` |
| [#7455](https://github.com/farion1231/cc-switch/pull/7455) fix(deeplink): preserve the supplied inline Codex config on import | 开放 | 2026-09-16 | `71b9e05027ca` |
| [#7054](https://github.com/farion1231/cc-switch/pull/7054) fix(codex): preserve websocket capability in deeplink imports | 开放 | 2026-09-02 | `d8ed365d46c7` |
| [#6753](https://github.com/farion1231/cc-switch/pull/6753) fix(deeplink): preserve safe Codex profile settings | 开放 | 2026-08-24 | `758bfbe5fed3` |
| [#5514](https://github.com/farion1231/cc-switch/pull/5514) fix(deeplink): preserve custom Codex config fields | 开放 | 2026-07-18 | `7cfaf9b7b17b` |

**代码层面的结论：** 都涉及 build_codex_settings，但策略不同：#5514 提取公共配置；#6753 只保留经过限制的字段；#7455 直接保留内嵌 TOML；#7054 支持 URL 上的 websocket 参数；#7944 专门保留并校验模型目录 URL。

**对应实现位置：**

- `src-tauri/src/deeplink/provider.rs` — build_codex_settings、supplied_codex_settings、extract_codex_model_catalog；[#7944 文件差异](https://github.com/farion1231/cc-switch/pull/7944/files#diff-f961825b4737474f72e127ad4ea7603fb84084cd5b7662aa5eb133a21b3d18e5)、[#7455 文件差异](https://github.com/farion1231/cc-switch/pull/7455/files#diff-f961825b4737474f72e127ad4ea7603fb84084cd5b7662aa5eb133a21b3d18e5)、[#7054 文件差异](https://github.com/farion1231/cc-switch/pull/7054/files#diff-f961825b4737474f72e127ad4ea7603fb84084cd5b7662aa5eb133a21b3d18e5)、[#6753 文件差异](https://github.com/farion1231/cc-switch/pull/6753/files#diff-f961825b4737474f72e127ad4ea7603fb84084cd5b7662aa5eb133a21b3d18e5)、[#5514 文件差异](https://github.com/farion1231/cc-switch/pull/5514/files#diff-f961825b4737474f72e127ad4ea7603fb84084cd5b7662aa5eb133a21b3d18e5)。
- `src-tauri/src/deeplink/parser.rs`；[#7054 文件差异](https://github.com/farion1231/cc-switch/pull/7054/files#diff-c614a1cdcd5f451dd9d2e0125df9905838f52898709d5c119b85d5168b7fbb7a)。

**建议处理：** 需要统一“哪些字段可导入、URL 参数和内嵌配置谁优先”的规则。保留全部 TOML 不等于覆盖其他 PR 的校验和新参数。

<a id="b16"></a>

### B16　Gemini 工具签名位置与丢失

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7143](https://github.com/farion1231/cc-switch/pull/7143) fix(proxy/gemini): fix Gemini Native Part-level thoughtSignature, Codex thought_signature backfill, and provider form unlock | 开放 | 2026-09-05 | `5fdba870ff20` |
| [#6848](https://github.com/farion1231/cc-switch/pull/6848) fix(gemini): resolve thought_signature 400 error in multi-turn tool replay | 开放 | 2026-08-26 | `90035c1c0612` |
| [#6728](https://github.com/farion1231/cc-switch/pull/6728) fix(proxy): preserve Gemini thought_signature across Codex chat bridge | 开放 | 2026-08-23 | `c3dc1e0e0779` |
| [#6690](https://github.com/farion1231/cc-switch/pull/6690) fix(proxy): mount thoughtSignature at Part level instead of inside fu… | 开放 | 2026-08-21 | `af83752206a2` |

**代码层面的结论：** #6690 把签名从 functionCall 内移动到 Part 层；#6848 同样调整位置，还增加按供应商找回历史签名和缺签名处理。#7143 与 #6728 又涉及 Codex 的 Chat 转换链，不能只改原生 Gemini 那一处。

**对应实现位置：**

- `src-tauri/src/proxy/providers/transform_gemini.rs` — convert_message_content_to_parts；[#7143 文件差异](https://github.com/farion1231/cc-switch/pull/7143/files#diff-5bab9edf18f96aa7cd8451179578f0822994d8c68fdc2089b104b50f31c5c9e9)、[#6848 文件差异](https://github.com/farion1231/cc-switch/pull/6848/files#diff-5bab9edf18f96aa7cd8451179578f0822994d8c68fdc2089b104b50f31c5c9e9)、[#6690 文件差异](https://github.com/farion1231/cc-switch/pull/6690/files#diff-5bab9edf18f96aa7cd8451179578f0822994d8c68fdc2089b104b50f31c5c9e9)。
- `src-tauri/src/proxy/providers/gemini_shadow.rs`；[#6848 文件差异](https://github.com/farion1231/cc-switch/pull/6848/files#diff-833ab1d947307047a9550a72204b3a842e96b008980840306cc66b25c68b6cc3)。
- `src-tauri/src/proxy/providers/transform_codex_chat.rs`；[#7143 文件差异](https://github.com/farion1231/cc-switch/pull/7143/files#diff-06d8e880369debba9c0f1498aa005efdbab9f39e99497da3a4cc37c626e756ac)、[#6728 文件差异](https://github.com/farion1231/cc-switch/pull/6728/files#diff-06d8e880369debba9c0f1498aa005efdbab9f39e99497da3a4cc37c626e756ac)。

**建议处理：** 合并 Part 层的重复修复，分别保留原生 Gemini 和 Codex Chat 的链路测试，并统一字段拼写与缺签名策略。

<a id="b17"></a>

### B17　数据库与备份文件权限

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6417](https://github.com/farion1231/cc-switch/pull/6417) fix(db): secure SQLite file permissions on Unix | 开放 | 2026-08-13 | `c52be64de714` |
| [#6412](https://github.com/farion1231/cc-switch/pull/6412) fix(security): restrict ~/.cc-switch dir and backup db file permissions | 开放 | 2026-08-13 | `80fd0937c32a` |
| [#4475](https://github.com/farion1231/cc-switch/pull/4475) fix(database): enforce secure file permissions and redact API keys in live backup | 开放 | 2026-06-21 | `7b1ffbe620e6` |

**代码层面的结论：** 都把 Unix 下的数据目录限制为 0700、数据库或备份限制为 0600。覆盖的临时文件、旧文件和写入时机不同；#4475 还修改 live 备份内容，做密钥脱敏。

**对应实现位置：**

- `src-tauri/src/database/mod.rs`；[#6417 文件差异](https://github.com/farion1231/cc-switch/pull/6417/files#diff-47db7b1162bdfd78d4f2f747023e24b7cac9f734bbfa673c983751357a513969)、[#6412 文件差异](https://github.com/farion1231/cc-switch/pull/6412/files#diff-47db7b1162bdfd78d4f2f747023e24b7cac9f734bbfa673c983751357a513969)、[#4475 文件差异](https://github.com/farion1231/cc-switch/pull/4475/files#diff-47db7b1162bdfd78d4f2f747023e24b7cac9f734bbfa673c983751357a513969)。
- `src-tauri/src/database/backup.rs`；[#6417 文件差异](https://github.com/farion1231/cc-switch/pull/6417/files#diff-8ebf10870a7663325fa9852b2c218892aa649a01f16743dba13129b04b559de4)、[#6412 文件差异](https://github.com/farion1231/cc-switch/pull/6412/files#diff-8ebf10870a7663325fa9852b2c218892aa649a01f16743dba13129b04b559de4)、[#4475 文件差异](https://github.com/farion1231/cc-switch/pull/4475/files#diff-8ebf10870a7663325fa9852b2c218892aa649a01f16743dba13129b04b559de4)。
- `src-tauri/src/config.rs`；[#6417 文件差异](https://github.com/farion1231/cc-switch/pull/6417/files#diff-9d9aa34713985f52282c5980cc7fc5c11ea11dc5a22fcd8f8f073bca3b24e1ee)、[#6412 文件差异](https://github.com/farion1231/cc-switch/pull/6412/files#diff-9d9aa34713985f52282c5980cc7fc5c11ea11dc5a22fcd8f8f073bca3b24e1ee)。
- `src-tauri/src/database/dao/proxy.rs`；[#4475 文件差异](https://github.com/farion1231/cc-switch/pull/4475/files#diff-8841521a54d891f9983dd0a81469d1aa224983d7060ee73d0b859d5fd6d8b936)。

**建议处理：** 文件权限部分应统一实现；备份脱敏是另一项行为，不能仅因权限重复就一起认定已覆盖。

<a id="b18"></a>

### B18　中文输入法输入供应商字段

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6648](https://github.com/farion1231/cc-switch/pull/6648) fix(provider): extend IME-safe inputs to Claude, Pi, and Claude Desktop | 开放 | 2026-08-20 | `300240aead51` |
| [#6500](https://github.com/farion1231/cc-switch/pull/6500) fix(pi): make provider form inputs IME-safe | 开放 | 2026-08-16 | `ec1c8d3f4d9c` |

**代码层面的结论：** 都把 Pi 表单换成 ImeSafeInput，并延后 provider key 规范化。#6648 还覆盖 Claude 和 Desktop；#6500 则额外替换 Pi 的 contextWindow、maxTokens 两个数字输入。

**对应实现位置：**

- `src/components/providers/forms/PiProviderForm.tsx`；[#6648 文件差异](https://github.com/farion1231/cc-switch/pull/6648/files#diff-b89cf721560a06d263a27f2d9115259b04e159e0f68e734ee2a432679b0ea19f)、[#6500 文件差异](https://github.com/farion1231/cc-switch/pull/6500/files#diff-b89cf721560a06d263a27f2d9115259b04e159e0f68e734ee2a432679b0ea19f)。
- `src/components/providers/forms/ClaudeFormFields.tsx`；[#6648 文件差异](https://github.com/farion1231/cc-switch/pull/6648/files#diff-ee00ca655acacc266d9de2367558a5b67bf4a581d34b2d1369572d714d1afe5a)。
- `src/components/providers/forms/ClaudeDesktopProviderForm.tsx`；[#6648 文件差异](https://github.com/farion1231/cc-switch/pull/6648/files#diff-a0971e18c820789c678fc0e273d24bfecf601184f1cbaa20f19f2816326a34ea)。

**建议处理：** 以较广的 #6648 整合，并单独决定数字输入是否也使用相同组件。

<a id="b19"></a>

### B19　把回复中的模型名改回请求模型名

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7444](https://github.com/farion1231/cc-switch/pull/7444) feat(proxy): add opt-in response model rewrite rectifier | 开放 | 2026-09-16 | `8e7ce1ba3394` |
| [#5580](https://github.com/farion1231/cc-switch/pull/5580) fix(proxy): rewrite Claude response model to client request model | 开放 | 2026-07-20 | `67628ed24e3a` |

**代码层面的结论：** 都在响应处理处改写模型名。#7444 新增默认关闭的设置和独立整流模块；#5580 直接在 Claude 路径接入改写。启用条件和处理范围有区别。

**对应实现位置：**

- `src-tauri/src/proxy/response_processor.rs`；[#7444 文件差异](https://github.com/farion1231/cc-switch/pull/7444/files#diff-fd2a75a720196485e4f74835a1e91953d129f27526f78c86f58342b45e5edbe4)、[#5580 文件差异](https://github.com/farion1231/cc-switch/pull/5580/files#diff-fd2a75a720196485e4f74835a1e91953d129f27526f78c86f58342b45e5edbe4)。
- `src-tauri/src/proxy/response_model_rewriter.rs`；[#7444 文件差异](https://github.com/farion1231/cc-switch/pull/7444/files#diff-5ac4851cefdbadfe317c219c6638a300cf5e4a36a77f61471d8dd051c4111d32)。
- `src-tauri/src/proxy/types.rs` — response_model_rewrite；[#7444 文件差异](https://github.com/farion1231/cc-switch/pull/7444/files#diff-d38fa221e1c47aaca76285c30503716bb7b03e5eb12264527d00916961b2d37a)。

**建议处理：** 先统一开关、适用协议和统计仍用哪个模型，再合成一套响应改写逻辑。

<a id="b20"></a>

### B20　Claude count_tokens 路由

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#5581](https://github.com/farion1231/cc-switch/pull/5581) fix(proxy): passthrough Anthropic count_tokens without transform | 开放 | 2026-07-20 | `21cb7a13f18f` |
| [#4999](https://github.com/farion1231/cc-switch/pull/4999) fix(proxy): support Claude count_tokens route | 开放 | 2026-07-05 | `09e4fe1fcb6f` |

**代码层面的结论：** 两者都注册相同的 count_tokens 路由。#5581 主张原样透传并避免普通消息转换；旧 #4999 还提供 Gemini 原生计数和不支持端点时的本地估算。

**对应实现位置：**

- `src-tauri/src/proxy/server.rs` — count_tokens 路由；[#5581 文件差异](https://github.com/farion1231/cc-switch/pull/5581/files#diff-cf7a952ad138a3660ed2d3d7b4d1e400a02604d846f533aa7cf8dad5ddbb29a5)、[#4999 文件差异](https://github.com/farion1231/cc-switch/pull/4999/files#diff-cf7a952ad138a3660ed2d3d7b4d1e400a02604d846f533aa7cf8dad5ddbb29a5)。
- `src-tauri/src/proxy/handlers.rs` — CountTokensStrategy；[#5581 文件差异](https://github.com/farion1231/cc-switch/pull/5581/files#diff-01182c40f41f588e10f6b55f97fd16554824971864ef90ee40c60aafc1c54ff0)、[#4999 文件差异](https://github.com/farion1231/cc-switch/pull/4999/files#diff-01182c40f41f588e10f6b55f97fd16554824971864ef90ee40c60aafc1c54ff0)。
- `src-tauri/src/proxy/forwarder.rs`；[#5581 文件差异](https://github.com/farion1231/cc-switch/pull/5581/files#diff-f044859ac54504af1d076ea87d5b28b782066cb8ee4712bb124d177e06bca080)、[#4999 文件差异](https://github.com/farion1231/cc-switch/pull/4999/files#diff-f044859ac54504af1d076ea87d5b28b782066cb8ee4712bb124d177e06bca080)。

**建议处理：** 必须整合路由和能力选择；新 PR 的透传不等于旧 PR 的全部功能。

<a id="b21"></a>

### B21　S3 / 阿里云 OSS 地址格式

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7136](https://github.com/farion1231/cc-switch/pull/7136) Fix/aliyun oss virtual hosted style | 开放 | 2026-09-05 | `9a3263503a6b` |
| [#4439](https://github.com/farion1231/cc-switch/pull/4439) Fix virtual-hosted URL handling for S3-compatible endpoints | 开放 | 2026-06-19 | `293ab32467f6` |
| [#4262](https://github.com/farion1231/cc-switch/pull/4262) fix(s3): Enhance S3 URL style support and persist preset selection | 开放 | 2026-06-15 | `48078512b3ee` |

**代码层面的结论：** 都处理 bucket 应放在域名前还是路径里的问题。#7136 只自动识别阿里云 OSS；#4439 还识别其他云并切换地址形式；#4262 让用户显式选择并保存预设。

**对应实现位置：**

- `src-tauri/src/services/s3.rs` — build_object_url、build_bucket_url；[#7136 文件差异](https://github.com/farion1231/cc-switch/pull/7136/files#diff-1696bbb4fc4b1bf70ac20ec372d6fc550f7f23f6a95b7cb112bdde04aa794793)、[#4439 文件差异](https://github.com/farion1231/cc-switch/pull/4439/files#diff-1696bbb4fc4b1bf70ac20ec372d6fc550f7f23f6a95b7cb112bdde04aa794793)、[#4262 文件差异](https://github.com/farion1231/cc-switch/pull/4262/files#diff-1696bbb4fc4b1bf70ac20ec372d6fc550f7f23f6a95b7cb112bdde04aa794793)。
- `src/components/settings/WebdavSyncSection.tsx`；[#4262 文件差异](https://github.com/farion1231/cc-switch/pull/4262/files#diff-25dd8f6f489312630fb5eb6e515ef4db2467d863ac42c662c33c36952643a81e)。

**建议处理：** 把 URL 构造统一成一套，保留需要的自动识别和手动覆盖；#7136 不能替代另外两项的全部范围。

<a id="b22"></a>

### B22　WebDAV 的 User-Agent

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#5456](https://github.com/farion1231/cc-switch/pull/5456) fix(webdav): send default User-Agent for reverse-proxy compatibility | 开放 | 2026-07-16 | `0605cacbe461` |
| [#1142](https://github.com/farion1231/cc-switch/pull/1142) feat: add custom User-Agent support for WebDAV sync | 开放 | 2026-02-27 | `71b5e7e136e1` |

**代码层面的结论：** #5456 在请求上统一加默认 User-Agent；#1142 给用户增加可配置字段，并贯穿上传、下载、探测等请求。两者都能处理拒绝空 User-Agent 的服务，但自定义能力不同。

**对应实现位置：**

- `src-tauri/src/services/webdav.rs`；[#5456 文件差异](https://github.com/farion1231/cc-switch/pull/5456/files#diff-0d1efb3507579b63a44e408056e828ff9615d5414a9bc958c2ac8f65b4197606)、[#1142 文件差异](https://github.com/farion1231/cc-switch/pull/1142/files#diff-0d1efb3507579b63a44e408056e828ff9615d5414a9bc958c2ac8f65b4197606)。
- `src-tauri/src/services/webdav_sync.rs`；[#1142 文件差异](https://github.com/farion1231/cc-switch/pull/1142/files#diff-4af8bed48099f4b98e68b59760808b3dfabb8d55358cf133a11a490b25bcc125)。
- `src/components/settings/WebdavSyncSection.tsx`；[#1142 文件差异](https://github.com/farion1231/cc-switch/pull/1142/files#diff-25dd8f6f489312630fb5eb6e515ef4db2467d863ac42c662c33c36952643a81e)。

**建议处理：** 可整合为“自定义值优先，否则使用默认值”，不要把新默认值修复当成已完成全部自定义功能。

<a id="b23"></a>

### B23　用量统计选择日期漏算当天

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#4720](https://github.com/farion1231/cc-switch/pull/4720) feat(usage): normalize default end date to end of day in UsageDateRangePicker | 开放 | 2026-06-27 | `123dec50733b` |
| [#4501](https://github.com/farion1231/cc-switch/pull/4501) Fix custom usage date picker full-day selection | 开放 | 2026-06-22 | `569cdbf2436d` |

**代码层面的结论：** 两者都把日期选择和日边界对应起来。#4720 还区分今天取当前时间、过去取日末，并保留显式自定义时间；#4501 的单日选择联动和结束边界规则不同。

**对应实现位置：**

- `src/components/usage/UsageDateRangePicker.tsx`；[#4720 文件差异](https://github.com/farion1231/cc-switch/pull/4720/files#diff-e8d7bfb358b07f36cd56c1bc65873618e4c43f91b21db6d16488a977ceb515dd)、[#4501 文件差异](https://github.com/farion1231/cc-switch/pull/4501/files#diff-e8d7bfb358b07f36cd56c1bc65873618e4c43f91b21db6d16488a977ceb515dd)。
- `src/lib/usageRange.ts` — normalizePickerStart、normalizePickerEnd；[#4720 文件差异](https://github.com/farion1231/cc-switch/pull/4720/files#diff-1ece2c54ff72373ad189774f751d11a9753379d97b56c43f26b0d36947416ab7)。

**建议处理：** 统一今天、过去日期、手工输入时间和跨日选择的预期，保留一套边界计算。

<a id="b24"></a>

### B24　自动进入轻量模式

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7158](https://github.com/farion1231/cc-switch/pull/7158) feat(lightweight): remember lightweight-mode preference and auto-enter on startup/close | 开放 | 2026-09-06 | `926d1460b4be` |
| [#7114](https://github.com/farion1231/cc-switch/pull/7114) feat(lightweight): auto-enter after window is hidden | 开放 | 2026-09-04 | `5d1fe019f617` |
| [#4693](https://github.com/farion1231/cc-switch/pull/4693) fix(tray): release WebView memory while running in tray | 开放 | 2026-06-27 | `f1513759ebf6` |

**代码层面的结论：** #4693 在托盘隐藏时释放 WebView；#7114 在隐藏后按可配置延时进入轻量模式；#7158 记住偏好，在启动和关闭时自动进入。目标重叠，但触发时机及持久化策略不同。

**对应实现位置：**

- `src-tauri/src/lightweight.rs`；[#7158 文件差异](https://github.com/farion1231/cc-switch/pull/7158/files#diff-c7e32b2de33caec67b147dc46cc7695657b0a248c4c0f50048acf168a46a64c1)、[#7114 文件差异](https://github.com/farion1231/cc-switch/pull/7114/files#diff-c7e32b2de33caec67b147dc46cc7695657b0a248c4c0f50048acf168a46a64c1)。
- `src-tauri/src/auto_lightweight.rs`；[#7114 文件差异](https://github.com/farion1231/cc-switch/pull/7114/files#diff-139ec583d926567550da1c0e86fe3b399432ab03ebeb3a9c8bc7f8b2a4b94fd5)。
- `src-tauri/src/lib.rs` — 窗口隐藏/关闭/启动分支；[#7158 文件差异](https://github.com/farion1231/cc-switch/pull/7158/files#diff-eabcebd0ae5c9b77a5247e1bdbdb88b1869fc0c932d0ef0cf2ecf9ee5221be7c)、[#7114 文件差异](https://github.com/farion1231/cc-switch/pull/7114/files#diff-eabcebd0ae5c9b77a5247e1bdbdb88b1869fc0c932d0ef0cf2ecf9ee5221be7c)、[#4693 文件差异](https://github.com/farion1231/cc-switch/pull/4693/files#diff-eabcebd0ae5c9b77a5247e1bdbdb88b1869fc0c932d0ef0cf2ecf9ee5221be7c)。

**建议处理：** 先统一交互规则，再保留同一个轻量模式实现；不能让多个隐藏/关闭钩子各自销毁窗口。

<a id="b25"></a>

### B25　MCP 自动同步开关与管理范围

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7082](https://github.com/farion1231/cc-switch/pull/7082) feat(settings): add provider-only management scope | 开放 | 2026-09-03 | `0d1b449b2d72` |
| [#6673](https://github.com/farion1231/cc-switch/pull/6673) feat(settings): add provider-only management scope | 开放 | 2026-08-21 | `9f6140f5f037` |
| [#4787](https://github.com/farion1231/cc-switch/pull/4787) feat: make sync & automation behaviors independently configurable + Codex MCP isolation | 开放 | 2026-06-29 | `e7ca5a57efc4` |
| [#4694](https://github.com/farion1231/cc-switch/pull/4694) feat(settings): add MCP live sync toggle to disable automatic config writes | 开放 | 2026-06-27 | `87d388f3d7d0` |

**代码层面的结论：** #4694 只控制 MCP live 写入；#4787 扩展为多项同步自动化开关并清理 Codex MCP 混入供应商配置；#6673/#7082 则控制是否接管整个资源管理，连导入、命令和页面都受影响。

**对应实现位置：**

- `src-tauri/src/settings.rs`；[#7082 文件差异](https://github.com/farion1231/cc-switch/pull/7082/files#diff-6ae7e3e18e60316fa21398f8dbf2f0b72c230af438a03ecf5301174c9099756f)、[#6673 文件差异](https://github.com/farion1231/cc-switch/pull/6673/files#diff-6ae7e3e18e60316fa21398f8dbf2f0b72c230af438a03ecf5301174c9099756f)、[#4787 文件差异](https://github.com/farion1231/cc-switch/pull/4787/files#diff-6ae7e3e18e60316fa21398f8dbf2f0b72c230af438a03ecf5301174c9099756f)、[#4694 文件差异](https://github.com/farion1231/cc-switch/pull/4694/files#diff-6ae7e3e18e60316fa21398f8dbf2f0b72c230af438a03ecf5301174c9099756f)。
- `src-tauri/src/mcp/codex.rs`；[#4694 文件差异](https://github.com/farion1231/cc-switch/pull/4694/files#diff-303fe5d7a81fa830838f789e668e484569e42ac064352b5b7b0e3fc661b74cd1)。
- `src-tauri/src/services/provider/live.rs`；[#7082 文件差异](https://github.com/farion1231/cc-switch/pull/7082/files#diff-ebdecd98e7ec6a71e01048cc17e5fd9bfe622459dbee657cf3636143266a3fd7)、[#6673 文件差异](https://github.com/farion1231/cc-switch/pull/6673/files#diff-ebdecd98e7ec6a71e01048cc17e5fd9bfe622459dbee657cf3636143266a3fd7)、[#4787 文件差异](https://github.com/farion1231/cc-switch/pull/4787/files#diff-ebdecd98e7ec6a71e01048cc17e5fd9bfe622459dbee657cf3636143266a3fd7)。
- `src/components/settings/SyncAutomationSettings.tsx`；[#4787 文件差异](https://github.com/farion1231/cc-switch/pull/4787/files#diff-23cab42d91111245bab1868e02c3199741d1b7df89e8f49c7da0d2abbee205b8)。

**建议处理：** 同步开关存在重复，资源管理范围仍有独立作用。先划清“关闭自动同步”和“完全不管理”的产品含义。

<a id="b26"></a>

### B26　Skills 分类和项目来源分组

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8251](https://github.com/farion1231/cc-switch/pull/8251) feat(skills): group installed skills by project source | 开放 | 2026-10-13 | `361016094e24` |
| [#8095](https://github.com/farion1231/cc-switch/pull/8095) feat(skills): 添加skill分类管理 | 开放 | 2026-10-10 | `de811a3eead4` |

**代码层面的结论：** 两者都新增分组数据、分组界面和整组开关。#8251 以仓库/安装来源自动归组，允许手工项目组；#8095 用用户定义分类。前者整组操作包含被筛选隐藏的成员，后者只操作筛选命中的成员。

**对应实现位置：**

- `src/components/skills/UnifiedSkillsPanel.tsx`；[#8251 文件差异](https://github.com/farion1231/cc-switch/pull/8251/files#diff-44846724be98e928679407d8094d0226b5396f36fdf7b78985ac60539e8c84ba)、[#8095 文件差异](https://github.com/farion1231/cc-switch/pull/8095/files#diff-44846724be98e928679407d8094d0226b5396f36fdf7b78985ac60539e8c84ba)。
- `src/components/skills/skillGroups.ts`；[#8251 文件差异](https://github.com/farion1231/cc-switch/pull/8251/files#diff-3371e06c396f648081dc888e05678745e4e8e68e154de2e5a8ceebf433257c91)。
- `src-tauri/src/database/dao/skill_groups.rs`；[#8251 文件差异](https://github.com/farion1231/cc-switch/pull/8251/files#diff-6850df7ae99d858251952ef5d2c4ea11f2bda875ae5e791245b8a30ec6d7e22f)。
- `src-tauri/src/database/dao/skill_categories.rs`；[#8095 文件差异](https://github.com/farion1231/cc-switch/pull/8095/files#diff-82807f45626a27289ea1acb17c9ab426629ce7fc7df9727eb4decf46f9612963)。

**建议处理：** 是明显的产品设计重叠，应先统一分组模型和批量开关范围，不能简单合并两套表和两套界面。

<a id="b27"></a>

### B27　无界面命令行管理

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7969](https://github.com/farion1231/cc-switch/pull/7969) feat(cli): add native daily provider controls | 开放 | 2026-10-08 | `bb9d28dc9efe` |
| [#7919](https://github.com/farion1231/cc-switch/pull/7919) feat: headless CLI (ccswitch) — manage providers / MCP without the GUI | 开放 | 2026-10-07 | `5470b1b59077` |

**代码层面的结论：** 两者都新增 Rust CLI，并调用 ProviderService::switch。#7969 支持状态、列表、当前供应商、配置摘要及切换；#7919 还提供 doctor、MCP 开关和 Skills 列表，命令名称与初始化策略也不同。

**对应实现位置：**

- `src-tauri/src/cli.rs` — Command、execute；[#7969 文件差异](https://github.com/farion1231/cc-switch/pull/7969/files#diff-ec7d1a68168080c4e0d463be5d154a22137c28206e0432ac73e2f458cbe3648e)。
- `src-tauri/src/bin/ccswitch.rs` — cmd_switch、cmd_mcp_set；[#7919 文件差异](https://github.com/farion1231/cc-switch/pull/7919/files#diff-5e8f84c098bc151b4d01a9328498785a929f5d7590eb1414d8849ae089d3a1d2)。

**建议处理：** 应选一个 CLI 入口并迁移另一套需要的子命令；较新 #7969 不是旧方案所有能力的替代品。

<a id="b28"></a>

### B28　跨应用复制供应商

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7225](https://github.com/farion1231/cc-switch/pull/7225) feat(provider): 跨应用复制供应商 | 开放 | 2026-09-08 | `ded09c842c6d` |
| [#5026](https://github.com/farion1231/cc-switch/pull/5026) feat(provider): 跨应用复制 / 导入导出 / 统一供应商权限管控 (closes #4599) | 开放 | 2026-07-06 | `fce092cbff0a` |

**代码层面的结论：** 都新增 CopyToAppsDialog 和后端跨应用转换。#7225 聚焦复制并限制部分 Desktop 目标；#5026 还包含导入导出、统一供应商权限管理。

**对应实现位置：**

- `src/components/providers/CopyToAppsDialog.tsx`；[#7225 文件差异](https://github.com/farion1231/cc-switch/pull/7225/files#diff-69f8e5bcd930a689f2b2c00fe96d1f02db19c59852b0245f7e8be0820de1fb41)、[#5026 文件差异](https://github.com/farion1231/cc-switch/pull/5026/files#diff-69f8e5bcd930a689f2b2c00fe96d1f02db19c59852b0245f7e8be0820de1fb41)。
- `src-tauri/src/commands/provider.rs`；[#7225 文件差异](https://github.com/farion1231/cc-switch/pull/7225/files#diff-f83119b51fe67409b0690397faf3ddea54fe0ef3a8c5fb73800af7494940cb77)、[#5026 文件差异](https://github.com/farion1231/cc-switch/pull/5026/files#diff-f83119b51fe67409b0690397faf3ddea54fe0ef3a8c5fb73800af7494940cb77)。
- `src-tauri/src/commands/provider_copy.rs`；[#7225 文件差异](https://github.com/farion1231/cc-switch/pull/7225/files#diff-716b41b6fb2d2b1814c4ca33363d9b7f5b759a00304214a66fe9d7fef71d25aa)。

**建议处理：** 复制功能选择一套实现；把 #5026 中未覆盖的导入导出和权限管理拆开评估。

<a id="b29"></a>

### B29　流式回复末尾重复显示正文

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6793](https://github.com/farion1231/cc-switch/pull/6793) fix(proxy): prevent duplicate Responses text in Anthropic SSE | 开放 | 2026-08-25 | `0f23294fe020` |
| [#6766](https://github.com/farion1231/cc-switch/pull/6766) fix(proxy): avoid replaying terminal response text | 开放 | 2026-08-24 | `d52d05ffef1e` |

**代码层面的结论：** 都修改 streaming_responses.rs，解决 delta 已发送正文、结束事件又带完整文本时的重复。#6766 按已有片段和后缀匹配；#6793 跟踪已发出的整个正文及片段位置，算法不同。

**对应实现位置：**

- `src-tauri/src/proxy/providers/streaming_responses.rs` — compatible_terminal_suffix、EmittedMessageTextTranscript；[#6793 文件差异](https://github.com/farion1231/cc-switch/pull/6793/files#diff-27c657392315bc25d32727ca2a35d1d981f5235180683bc64805b6a07f497bb3)、[#6766 文件差异](https://github.com/farion1231/cc-switch/pull/6766/files#diff-27c657392315bc25d32727ca2a35d1d981f5235180683bc64805b6a07f497bb3)。

**建议处理：** 同一转换链只保留一套去重状态机；比较多段正文、ID 改变、缺 ID 和 annotation 用例后再决定。

<a id="b30"></a>

### B30　长会话自定义标题找不到

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6809](https://github.com/farion1231/cc-switch/pull/6809) fix(sessions): pick the latest custom-title from anywhere in Claude session files | 开放 | 2026-08-25 | `386076552919` |
| [#5701](https://github.com/farion1231/cc-switch/pull/5701) fix(claude): resolve custom-title resolution for long sessions | 开放 | 2026-07-23 | `ce927c385234` |

**代码层面的结论：** 都修 Claude 会话标题遗漏。#5701 扫更多首尾内容并把尾部窗口增至 128 KB；#6809 扫全文件找最后一个标题，并用修改时间和大小缓存结果。

**对应实现位置：**

- `src-tauri/src/session_manager/providers/claude.rs` — scan_last_custom_title；[#6809 文件差异](https://github.com/farion1231/cc-switch/pull/6809/files#diff-064164e3210ebb8c487a427ec9c57e694e0338931e69d96aa7b489922b21ba5b)、[#5701 文件差异](https://github.com/farion1231/cc-switch/pull/5701/files#diff-064164e3210ebb8c487a427ec9c57e694e0338931e69d96aa7b489922b21ba5b)。
- `src-tauri/src/session_manager/providers/utils.rs` — TAIL_WINDOW_BYTES；[#5701 文件差异](https://github.com/farion1231/cc-switch/pull/5701/files#diff-c70543c6616fda57e317bf6228f0361390ec156baf0365ae70c5844d5c10c51e)。

**建议处理：** #6809 覆盖查找中段标题的主要需求；#5701 的公共尾部读取窗口调整可单独判断，不必跟随整份旧 PR 保留。

<a id="b31"></a>

### B31　自适应思考与强制工具调用不兼容

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8048](https://github.com/farion1231/cc-switch/pull/8048) fix(proxy): preserve adaptive thinking and handle forced tools for Codex Opus 5.5 | 开放 | 2026-10-10 | `d882122a0b4a` |
| [#7768](https://github.com/farion1231/cc-switch/pull/7768) fix(proxy): rectify thinking:disabled and forced tool_choice for adaptive-only Claude models | 开放 | 2026-09-30 | `afb3f906edac` |
| [#7692](https://github.com/farion1231/cc-switch/pull/7692) fix(proxy): omit thinking key instead of sending disabled on Opus 5 | 开放 | 2026-09-26 | `905322d27b64` |

**代码层面的结论：** #7692 在 Codex→Anthropic 转换时避免发送 disabled；#8048 对 Opus 5.5 保留 adaptive 并处理强制工具；#7768 在收到对应上游错误后移除 disabled、放宽 tool_choice 再重试。

**对应实现位置：**

- `src-tauri/src/proxy/providers/transform_codex_anthropic.rs`；[#8048 文件差异](https://github.com/farion1231/cc-switch/pull/8048/files#diff-33bb49027be3c2c92ec46d95b622b854375e0c5c1891754e55b6a516e6ee537e)、[#7692 文件差异](https://github.com/farion1231/cc-switch/pull/7692/files#diff-33bb49027be3c2c92ec46d95b622b854375e0c5c1891754e55b6a516e6ee537e)。
- `src-tauri/src/proxy/adaptive_thinking_rectifier.rs`；[#7768 文件差异](https://github.com/farion1231/cc-switch/pull/7768/files#diff-c21fd02ce833ec8fb528ebe5674e3bdf941da316db191d693cb40fb0c4fa9fdc)。
- `src-tauri/src/proxy/thinking_optimizer.rs`；[#8048 文件差异](https://github.com/farion1231/cc-switch/pull/8048/files#diff-b435d8fa065b42a7f4c05661fa46bde24c9e27054b45de394dba33f293972e7c)、[#7692 文件差异](https://github.com/farion1231/cc-switch/pull/7692/files#diff-b435d8fa065b42a7f4c05661fa46bde24c9e27054b45de394dba33f293972e7c)。

**建议处理：** 请求生成阶段和出错后的重试有交集但并不等价，需统一模型判断和修复规则。

<a id="b32"></a>

### B32　模型列表请求缺少标准请求头

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7429](https://github.com/farion1231/cc-switch/pull/7429) fix(models): send a default User-Agent when fetching model lists | 开放 | 2026-09-15 | `99effc46cd9a` |
| [#3915](https://github.com/farion1231/cc-switch/pull/3915) fix(provider): send standard headers when fetching models | 开放 | 2026-06-08 | `b75dc12334d9` |

**代码层面的结论：** 都给模型列表请求加 User-Agent。#7429 只在没有值时补默认值，尊重已有覆盖；#3915 还显式加 Accept，并使用带应用版本的 User-Agent。

**对应实现位置：**

- `src-tauri/src/services/model_fetch.rs` — build_model_fetch_headers / build_model_fetch_request；[#7429 文件差异](https://github.com/farion1231/cc-switch/pull/7429/files#diff-f4acaedb8302aba7bee08f38f4f7b6788fbf5cbf0047625d8fe47492f0ba4b8f)、[#3915 文件差异](https://github.com/farion1231/cc-switch/pull/3915/files#diff-f4acaedb8302aba7bee08f38f4f7b6788fbf5cbf0047625d8fe47492f0ba4b8f)。

**建议处理：** User-Agent 部分不应重复实现；确认 Accept 是否仍有必要，并保留自定义值的优先级。

<a id="b33"></a>

### B33　已合并的延迟会话读取优化与旧方案

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8218](https://github.com/farion1231/cc-switch/pull/8218) fix(usage): skip unchanged deferred Codex rollouts | 已合并 | 2026-10-13 | `ba9e98187b2a` |
| [#5979](https://github.com/farion1231/cc-switch/pull/5979) fix(codex): avoid repeated deferred session reads | 开放 | 2026-07-31 | `6db9c4df95f8` |
| [#8230](https://github.com/farion1231/cc-switch/pull/8230) perf(usage): resume Codex appends from durable parser checkpoints | 开放 | 2026-10-13 | `fc0801055e22` |

**代码层面的结论：** 已合并的 #8218 会记住父子文件的指纹，跳过未变化的失败重读；旧 #5979 也解决重复读取，但把 pending 状态写入数据库，还改变父会话完成边界判断。#8230 的持久化断点又针对正常追加解析。

**对应实现位置：**

- `src-tauri/src/services/session_usage_codex.rs` — PendingReason、parent_dependency_stamp；[#8218 文件差异](https://github.com/farion1231/cc-switch/pull/8218/files#diff-5e7b2e8453e4cab0413baa982d0f0eb5e0d7d8ce7d2179b913fe60895da6e509)、[#5979 文件差异](https://github.com/farion1231/cc-switch/pull/5979/files#diff-5e7b2e8453e4cab0413baa982d0f0eb5e0d7d8ce7d2179b913fe60895da6e509)、[#8230 文件差异](https://github.com/farion1231/cc-switch/pull/8230/files#diff-5e7b2e8453e4cab0413baa982d0f0eb5e0d7d8ce7d2179b913fe60895da6e509)。
- `src-tauri/src/database/schema.rs` — codex_pending_sync / parser checkpoints；[#5979 文件差异](https://github.com/farion1231/cc-switch/pull/5979/files#diff-b6d6e6401aab761ffb2061e8bc7ee55a41bb0942dcfe690202a3896e31d16a2a)、[#8230 文件差异](https://github.com/farion1231/cc-switch/pull/8230/files#diff-b6d6e6401aab761ffb2061e8bc7ee55a41bb0942dcfe690202a3896e31d16a2a)。

**建议处理：** 旧 #5979 的“每轮重复重读”问题已有部分落地；先剥离已解决部分，再决定是否还需要它的持久化与边界策略，不能认定整份已完成。

## C 类：依赖叠加或拆分：按顺序整理

- [C01 账号界面重构包含已经合并的重复账号检查](#c01)（[#7086](https://github.com/farion1231/cc-switch/pull/7086)、[#7061](https://github.com/farion1231/cc-switch/pull/7061)）
- [C02 卸载已合并功能的 Windows 后续修复](#c02)（[#8262](https://github.com/farion1231/cc-switch/pull/8262)、[#8165](https://github.com/farion1231/cc-switch/pull/8165)）
- [C03 Claude Desktop 聚合路由的三层开发](#c03)（[#7785](https://github.com/farion1231/cc-switch/pull/7785)、[#7786](https://github.com/farion1231/cc-switch/pull/7786)、[#7789](https://github.com/farion1231/cc-switch/pull/7789)）
- [C04 Copilot 自动路由提示与 Auto 模式](#c04)（[#8196](https://github.com/farion1231/cc-switch/pull/8196)、[#8198](https://github.com/farion1231/cc-switch/pull/8198)）
- [C05 WSL 文件修复与 VS Code MCP 导入](#c05)（[#8249](https://github.com/farion1231/cc-switch/pull/8249)、[#8250](https://github.com/farion1231/cc-switch/pull/8250)）
- [C06 macOS 与 Windows 系统代理刷新](#c06)（[#7030](https://github.com/farion1231/cc-switch/pull/7030)、[#7101](https://github.com/farion1231/cc-switch/pull/7101)）
- [C07 Codex 保存反馈基础修复与兼容补丁](#c07)（[#7980](https://github.com/farion1231/cc-switch/pull/7980)、[#8001](https://github.com/farion1231/cc-switch/pull/8001)）
- [C08 DSH 用量导入与 ZCode 用量导入](#c08)（[#6724](https://github.com/farion1231/cc-switch/pull/6724)、[#6734](https://github.com/farion1231/cc-switch/pull/6734)）
- [C09 Cursor 接入从综合 PR 拆出](#c09)（[#6519](https://github.com/farion1231/cc-switch/pull/6519)、[#7015](https://github.com/farion1231/cc-switch/pull/7015)）
- [C10 Codex 历史修复后端与界面](#c10)（[#4292](https://github.com/farion1231/cc-switch/pull/4292)、[#4294](https://github.com/farion1231/cc-switch/pull/4294)）
- [C11 正文搜索与可靠性补丁](#c11)（[#7896](https://github.com/farion1231/cc-switch/pull/7896)、[#8150](https://github.com/farion1231/cc-switch/pull/8150)）

<a id="c01"></a>

### C01　账号界面重构包含已经合并的重复账号检查

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7086](https://github.com/farion1231/cc-switch/pull/7086) refactor(codex): remove default and re-login account actions | 开放 | 2026-09-03 | `7016bed67c51` |
| [#7061](https://github.com/farion1231/cc-switch/pull/7061) fix(codex): reject duplicate managed accounts | 已合并 | 2026-09-02 | `0716bfd6a588` |

**代码层面的结论：** #7086 的 codex_oauth_auth.rs 改动与已合并 #7061 相同，都是根据工作区和用户身份拒绝重复托管账号，当前 main 已有 DuplicateAccount 检查。但 #7086 另删除“设为默认”“重新登录”入口，并改变未绑定账号时的界面行为，这些不是 #7061 的目标。

**对应实现位置：**

- `src-tauri/src/proxy/providers/codex_oauth_auth.rs` — DuplicateAccount、duplicate_exists；[#7086 文件差异](https://github.com/farion1231/cc-switch/pull/7086/files#diff-121d56b1acaf3bec7f1ef737442a819f6c96b3472e66639a0ac17e10c3403fc6)、[#7061 文件差异](https://github.com/farion1231/cc-switch/pull/7061/files#diff-121d56b1acaf3bec7f1ef737442a819f6c96b3472e66639a0ac17e10c3403fc6)。
- `src/components/providers/forms/CodexOAuthSection.tsx` — 默认账号、重新登录操作；[#7086 文件差异](https://github.com/farion1231/cc-switch/pull/7086/files#diff-56bc7a28fc5d6abc8f9608856ea20ca93059324e5f6fde88761957014a36e06b)。

**建议处理：** 更新 #7086 的比较基线，去掉已合并基础修复后，只评审剩余账号交互调整。代码包含已合并补丁，不代表整个 PR 没有价值。

<a id="c02"></a>

### C02　卸载已合并功能的 Windows 后续修复

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8262](https://github.com/farion1231/cc-switch/pull/8262) Fix/windows uninstall path followups | 开放 | 2026-10-13 | `a99c6ef90931` |
| [#8165](https://github.com/farion1231/cc-switch/pull/8165) feat: add uninstall support for tools, including UI and backend integration | 已合并 | 2026-10-12 | `0de14fde5bb3` |

**代码层面的结论：** #8165 已合并卸载主功能；#8262 修改现有 useToolManagement 的卸载后诊断、Windows Hermes 残留提示和 CLI PATH 环境，并复用已有命令构造。它是在补实际边界问题，不是再实现一套卸载按钮。

**对应实现位置：**

- `src/components/apps/useToolManagement.ts` — hermesUninstallMayLeaveFiles、卸载后状态处理；[#8262 文件差异](https://github.com/farion1231/cc-switch/pull/8262/files#diff-88b98eb0b21670b146c28ab787a6fb949dae31b1629c966e1c4793c491b23cd2)、[#8165 文件差异](https://github.com/farion1231/cc-switch/pull/8165/files#diff-88b98eb0b21670b146c28ab787a6fb949dae31b1629c966e1c4793c491b23cd2)。
- `src-tauri/src/commands/misc.rs` — expand_env_chars_with_lookup、run_detected_tool_command_with_timeout；[#8262 文件差异](https://github.com/farion1231/cc-switch/pull/8262/files#diff-c5aed63713e8f68f8ba06c4529263ef62c5ec7e45b614d8c18db5e4916cd571d)、[#8165 文件差异](https://github.com/farion1231/cc-switch/pull/8165/files#diff-c5aed63713e8f68f8ba06c4529263ef62c5ec7e45b614d8c18db5e4916cd571d)。

**建议处理：** 作为已合并实现的增量修复评审；不要因为其主题也含“卸载”而按重复 PR 关闭。

<a id="c03"></a>

### C03　Claude Desktop 聚合路由的三层开发

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7785](https://github.com/farion1231/cc-switch/pull/7785) feat(claude-desktop): aggregate provider routing across providers | 开放 | 2026-09-30 | `4159ca2fbb52` |
| [#7786](https://github.com/farion1231/cc-switch/pull/7786) feat(claude-desktop): validate aggregate routes on save, protect their targets | 开放 | 2026-09-30 | `3d5a1d82dd8a` |
| [#7789](https://github.com/farion1231/cc-switch/pull/7789) feat(claude-desktop): editor UI for aggregate providers | 开放 | 2026-10-01 | `539ee3dba56d` |

**代码层面的结论：** #7785 实现跨供应商路由；#7786 在其基础上加保存校验、循环引用与删除保护；#7789 再加可编辑这些数据的界面。后续 diff 确实包含前序代码，但每一层有独立增量。

**对应实现位置：**

- `src-tauri/src/aggregate.rs`；[#7785 文件差异](https://github.com/farion1231/cc-switch/pull/7785/files#diff-a99f0ce15a79426634c5ba1f2409dbf6a69742d55cd87506a3461c206b5e8d58)、[#7786 文件差异](https://github.com/farion1231/cc-switch/pull/7786/files#diff-a99f0ce15a79426634c5ba1f2409dbf6a69742d55cd87506a3461c206b5e8d58)、[#7789 文件差异](https://github.com/farion1231/cc-switch/pull/7789/files#diff-a99f0ce15a79426634c5ba1f2409dbf6a69742d55cd87506a3461c206b5e8d58)。
- `src-tauri/src/services/provider/mod.rs`；[#7786 文件差异](https://github.com/farion1231/cc-switch/pull/7786/files#diff-756e437f067f4fa62230b10093aaab488d985a4c4f2d7b903d4394103ed74605)、[#7789 文件差异](https://github.com/farion1231/cc-switch/pull/7789/files#diff-756e437f067f4fa62230b10093aaab488d985a4c4f2d7b903d4394103ed74605)。
- `src/components/providers/forms/ClaudeDesktopProviderForm.tsx`；[#7789 文件差异](https://github.com/farion1231/cc-switch/pull/7789/files#diff-a0971e18c820789c678fc0e273d24bfecf601184f1cbaa20f19f2816326a34ea)。

**建议处理：** 按依赖顺序合并并更新比较基线，或明确合成一个 PR；不要当作三份无用重复直接关闭。

<a id="c04"></a>

### C04　Copilot 自动路由提示与 Auto 模式

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8196](https://github.com/farion1231/cc-switch/pull/8196) fix(forms): reflect automatic Copilot protocol routing | 开放 | 2026-10-12 | `96fdf991a24d` |
| [#8198](https://github.com/farion1231/cc-switch/pull/8198) fix: Allow copilot auto mode | 开放 | 2026-10-12 | `3c3063cf7af3` |

**代码层面的结论：** #8198 包含 #8196 的表单自动协议提示，此外真正增加 copilot-auto 的模型解析、Chat 路由、去掉 model 字段和工具 schema 处理。

**对应实现位置：**

- `src/components/providers/forms/ClaudeFormFields.tsx`；[#8196 文件差异](https://github.com/farion1231/cc-switch/pull/8196/files#diff-ee00ca655acacc266d9de2367558a5b67bf4a581d34b2d1369572d714d1afe5a)、[#8198 文件差异](https://github.com/farion1231/cc-switch/pull/8198/files#diff-ee00ca655acacc266d9de2367558a5b67bf4a581d34b2d1369572d714d1afe5a)。
- `src-tauri/src/proxy/providers/copilot_model_map.rs`；[#8198 文件差异](https://github.com/farion1231/cc-switch/pull/8198/files#diff-7b19d92bf4ed0bc46109a19944912c7b19a56605de3a952cfc59a5cb8e3d2038)。
- `src-tauri/src/proxy/forwarder.rs`；[#8198 文件差异](https://github.com/farion1231/cc-switch/pull/8198/files#diff-f044859ac54504af1d076ea87d5b28b782066cb8ee4712bb124d177e06bca080)。

**建议处理：** 按基础 UI 修复→Auto 功能的依赖处理；共享代码不是关闭 Auto 功能的理由。

<a id="c05"></a>

### C05　WSL 文件修复与 VS Code MCP 导入

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8249](https://github.com/farion1231/cc-switch/pull/8249) fix(wsl): skip syscalls 9P rejects when piConfigDir targets WSL | 开放 | 2026-10-13 | `7c6af7df6a40` |
| [#8250](https://github.com/farion1231/cc-switch/pull/8250) feat(mcp): import servers from the VS Code user mcp.json | 开放 | 2026-10-13 | `691d8e2450b7` |

**代码层面的结论：** #8250 的 diff 包含与 #8249 相同的 WSL 写文件/Skills 同步修复，但它还新增 vscode.rs，读取 VS Code 用户 mcp.json 并规范化 MCP 配置。

**对应实现位置：**

- `src-tauri/src/config.rs` — commit_staged；[#8249 文件差异](https://github.com/farion1231/cc-switch/pull/8249/files#diff-9d9aa34713985f52282c5980cc7fc5c11ea11dc5a22fcd8f8f073bca3b24e1ee)、[#8250 文件差异](https://github.com/farion1231/cc-switch/pull/8250/files#diff-9d9aa34713985f52282c5980cc7fc5c11ea11dc5a22fcd8f8f073bca3b24e1ee)。
- `src-tauri/src/services/skill.rs`；[#8249 文件差异](https://github.com/farion1231/cc-switch/pull/8249/files#diff-cba6a628e71ccdf5cf1e4442eae8c02808290e80335c53ffe1709af10d4a25f1)、[#8250 文件差异](https://github.com/farion1231/cc-switch/pull/8250/files#diff-cba6a628e71ccdf5cf1e4442eae8c02808290e80335c53ffe1709af10d4a25f1)。
- `src-tauri/src/mcp/vscode.rs`；[#8250 文件差异](https://github.com/farion1231/cc-switch/pull/8250/files#diff-ffbd9f5ca0e43e23339bd8288f917577e5da9f13c5712452085651d3aa7e78c1)。

**建议处理：** 先合文件系统基础修复，再让导入 PR 只显示剩余增量。

<a id="c06"></a>

### C06　macOS 与 Windows 系统代理刷新

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7030](https://github.com/farion1231/cc-switch/pull/7030) fix(proxy): refresh HTTP client when macOS system proxy configuration changes | 开放 | 2026-09-01 | `855204ed0c04` |
| [#7101](https://github.com/farion1231/cc-switch/pull/7101) fix(proxy): extend system-proxy change detection to Windows (registry snapshot) | 开放 | 2026-09-03 | `fa02c5364c51` |

**代码层面的结论：** #7030 增加系统代理快照和 HTTP 客户端重建；#7101 继承这套实现，并新增 Windows 注册表与 bypass 规则的变化检测。

**对应实现位置：**

- `src-tauri/src/proxy/http_client.rs` — SystemProxySnapshot、Windows registry snapshot；[#7030 文件差异](https://github.com/farion1231/cc-switch/pull/7030/files#diff-8f58cc28ac6618d022c1a9049d0487cb5fd1f1c8fcd6a46facdb657adc006d17)、[#7101 文件差异](https://github.com/farion1231/cc-switch/pull/7101/files#diff-8f58cc28ac6618d022c1a9049d0487cb5fd1f1c8fcd6a46facdb657adc006d17)。

**建议处理：** 按共享机制→Windows 支持合并；Windows 部分有独立价值。

<a id="c07"></a>

### C07　Codex 保存反馈基础修复与兼容补丁

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7980](https://github.com/farion1231/cc-switch/pull/7980) fix(codex): warn on deferred key-field saves and repair legacy takeover residue | 开放 | 2026-10-08 | `355766066365` |
| [#8001](https://github.com/farion1231/cc-switch/pull/8001) fix(codex): 补全 #7948 旧会话兼容与保存反馈 | 开放 | 2026-10-09 | `bc96b5059e17` |

**代码层面的结论：** #8001 保留 #7980 的 key-field 保存警告和旧接管残留修复，另外修正删除最后一个 Stack 模型的警告，并维护旧官方路由兼容表。

**对应实现位置：**

- `src-tauri/src/mode/controller.rs`；[#7980 文件差异](https://github.com/farion1231/cc-switch/pull/7980/files#diff-29947d24545a8abf85ce29ea78c87878fb997892ac3a56686f04a755f6866313)、[#8001 文件差异](https://github.com/farion1231/cc-switch/pull/8001/files#diff-29947d24545a8abf85ce29ea78c87878fb997892ac3a56686f04a755f6866313)。
- `src-tauri/src/services/provider/codex_editor.rs`；[#7980 文件差异](https://github.com/farion1231/cc-switch/pull/7980/files#diff-f006dc5f90b99bcbbaca7f61875be84494b0cdb6f3e3fe35524121f9c391d7d7)、[#8001 文件差异](https://github.com/farion1231/cc-switch/pull/8001/files#diff-f006dc5f90b99bcbbaca7f61875be84494b0cdb6f3e3fe35524121f9c391d7d7)。
- `src-tauri/src/live/project/codex.rs` — LegacyOfficialMirrorPatch；[#8001 文件差异](https://github.com/farion1231/cc-switch/pull/8001/files#diff-15bb7628e1b42c0ac6961fcdf59ba03d5bff0c5a23ae96f5f54489341d54f663)。

**建议处理：** 按依赖或合并整合处理；#8001 不是重复提交了一份毫无增量的 #7980。

<a id="c08"></a>

### C08　DSH 用量导入与 ZCode 用量导入

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6724](https://github.com/farion1231/cc-switch/pull/6724) feat(usage): add DSH session usage importer | 开放 | 2026-08-23 | `ea2574a2c7ed` |
| [#6734](https://github.com/farion1231/cc-switch/pull/6734) feat(usage): add ZCode session usage importer | 开放 | 2026-08-23 | `abe364468324` |

**代码层面的结论：** #6734 包含 #6724 的 DSH 导入器，同时新建 session_usage_zcode.rs，读取 ZCode 的 model_usage 表。相同代码来自开发依赖，支持的应用不同。

**对应实现位置：**

- `src-tauri/src/services/session_usage_dsh.rs`；[#6724 文件差异](https://github.com/farion1231/cc-switch/pull/6724/files#diff-cefddc522a3076ec3eb7f20742e0fc456e166fb9f75cccfae7b34b89d72a2ce5)、[#6734 文件差异](https://github.com/farion1231/cc-switch/pull/6734/files#diff-cefddc522a3076ec3eb7f20742e0fc456e166fb9f75cccfae7b34b89d72a2ce5)。
- `src-tauri/src/services/session_usage_zcode.rs`；[#6734 文件差异](https://github.com/farion1231/cc-switch/pull/6734/files#diff-46e4879ea2a21bfe8b01e9d165d443750d71b4fab5d4f9524c0873c4cdd83a8e)。

**建议处理：** 先合 DSH，再缩小 ZCode 的 diff；两个应用的导入器都可能需要。

<a id="c09"></a>

### C09　Cursor 接入从综合 PR 拆出

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6519](https://github.com/farion1231/cc-switch/pull/6519) feat(cursor, shared-memory): manage Cursor app with shared skills & MCP, add shared memory panel | 开放 | 2026-08-17 | `0bdc7af9317c` |
| [#7015](https://github.com/farion1231/cc-switch/pull/7015) feat(cursor): manage Cursor app with shared skills & MCP | 开放 | 2026-08-31 | `8fea2f35599c` |

**代码层面的结论：** #7015 基本保留 #6519 的 Cursor 配置、MCP 和 Skills 接入；旧 #6519 还包含 shared memory 面板。属于主动拆分后的代码重叠。

**对应实现位置：**

- `src-tauri/src/cursor_config.rs`；[#6519 文件差异](https://github.com/farion1231/cc-switch/pull/6519/files#diff-f42f00e10edae2cb7e19950520ac7fb823aaf095db41a50c599b24a17c89ccc1)、[#7015 文件差异](https://github.com/farion1231/cc-switch/pull/7015/files#diff-f42f00e10edae2cb7e19950520ac7fb823aaf095db41a50c599b24a17c89ccc1)。
- `src-tauri/src/database/dao/mcp.rs`；[#6519 文件差异](https://github.com/farion1231/cc-switch/pull/6519/files#diff-513c92973a3688092e6321d1a8d79e4ce3af2a41ec84a050009be3ca2bd0854b)、[#7015 文件差异](https://github.com/farion1231/cc-switch/pull/7015/files#diff-513c92973a3688092e6321d1a8d79e4ce3af2a41ec84a050009be3ca2bd0854b)。
- `src-tauri/src/database/dao/skills.rs`；[#6519 文件差异](https://github.com/farion1231/cc-switch/pull/6519/files#diff-57460dd9c23d10e8310b41d611d0a54d1a66ebc21ddda0009b070cd7c83da2fe)、[#7015 文件差异](https://github.com/farion1231/cc-switch/pull/7015/files#diff-57460dd9c23d10e8310b41d611d0a54d1a66ebc21ddda0009b070cd7c83da2fe)。

**建议处理：** 以拆分后的 Cursor PR 审查；旧综合 PR 若关闭，要明确 shared memory 部分的去向。

<a id="c10"></a>

### C10　Codex 历史修复后端与界面

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#4292](https://github.com/farion1231/cc-switch/pull/4292) fix(codex): repair history visibility for active sqlite DB | 开放 | 2026-06-16 | `f2c5fe18704a` |
| [#4294](https://github.com/farion1231/cc-switch/pull/4294) feat(codex): integrate history repair into session manager | 开放 | 2026-06-16 | `8226f65838b4` |

**代码层面的结论：** #4292 找到活跃 SQLite、修复历史归属并提供 Python 工具；#4294 包含这些代码，并把诊断、预览和修复操作接入会话管理页。

**对应实现位置：**

- `src-tauri/src/codex_history_migration.rs`；[#4292 文件差异](https://github.com/farion1231/cc-switch/pull/4292/files#diff-8145b2c928c2d4f5526493584bc3d3f65b2969053392187a000bc7f7ec535879)、[#4294 文件差异](https://github.com/farion1231/cc-switch/pull/4294/files#diff-8145b2c928c2d4f5526493584bc3d3f65b2969053392187a000bc7f7ec535879)。
- `scripts/codex-history-tool/codex_history_tool.py`；[#4292 文件差异](https://github.com/farion1231/cc-switch/pull/4292/files#diff-23b3956e2cdfc3e44fbdce3a9c64aa698485608184fc40183c5c7456d1b56e47)、[#4294 文件差异](https://github.com/farion1231/cc-switch/pull/4294/files#diff-23b3956e2cdfc3e44fbdce3a9c64aa698485608184fc40183c5c7456d1b56e47)。
- `src/components/sessions/SessionManagerPage.tsx`；[#4294 文件差异](https://github.com/farion1231/cc-switch/pull/4294/files#diff-3b04cdc38cdfb7c28308dcac452bb8f2ea03a0d0b1476a800a0f6916fdb4439e)。

**建议处理：** 是后端基础加界面的依赖关系，可合并整理，但不应因代码包含关系就丢掉界面增量。

<a id="c11"></a>

### C11　正文搜索与可靠性补丁

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7896](https://github.com/farion1231/cc-switch/pull/7896) feat(sessions): search message text across sessions with a local FTS5 index | 开放 | 2026-10-06 | `078031d37d16` |
| [#8150](https://github.com/farion1231/cc-switch/pull/8150) fix(sessions): harden content-search lifecycle and Unicode matching | 开放 | 2026-10-11 | `8546386de52e` |

**代码层面的结论：** #8150 的目标分支直接是 feat/session-content-search，针对 #7896。它修读取失败重试、空列表清理、索引开关竞争和 Unicode 匹配，未重新实现整套搜索。

**对应实现位置：**

- `src-tauri/src/session_manager/search.rs`；[#7896 文件差异](https://github.com/farion1231/cc-switch/pull/7896/files#diff-9c9dd5f66ae6fb4f470dddba51f7732069a78883a5ee724ca0d0e29858d6eff0)、[#8150 文件差异](https://github.com/farion1231/cc-switch/pull/8150/files#diff-9c9dd5f66ae6fb4f470dddba51f7732069a78883a5ee724ca0d0e29858d6eff0)。
- `src/hooks/useSessionContentSearch.ts`；[#7896 文件差异](https://github.com/farion1231/cc-switch/pull/7896/files#diff-fd50874d06617565cdda8b4762e416ad6395c83b611a6a9b15d9d0877806d344)、[#8150 文件差异](https://github.com/farion1231/cc-switch/pull/8150/files#diff-fd50874d06617565cdda8b4762e416ad6395c83b611a6a9b15d9d0877806d344)。
- `src/components/sessions/SessionManagerPage.tsx`；[#7896 文件差异](https://github.com/farion1231/cc-switch/pull/7896/files#diff-3b04cdc38cdfb7c28308dcac452bb8f2ea03a0d0b1476a800a0f6916fdb4439e)、[#8150 文件差异](https://github.com/farion1231/cc-switch/pull/8150/files#diff-3b04cdc38cdfb7c28308dcac452bb8f2ea03a0d0b1476a800a0f6916fdb4439e)。

**建议处理：** 先把修复吸收到搜索分支，再审主功能；不要将 #8150 当作另一个竞争性的全文搜索实现。

## D 类：不能直接判重复：不同问题或历史回归

- [D01 Ghostty 看似重提旧修复，但当前主分支已不保留旧做法](#d01)（[#5572](https://github.com/farion1231/cc-switch/pull/5572)、[#1506](https://github.com/farion1231/cc-switch/pull/1506)）
- [D02 新提交的共享密钥变量与旧多密钥配置不是同一功能](#d02)（[#8264](https://github.com/farion1231/cc-switch/pull/8264)、[#7188](https://github.com/farion1231/cc-switch/pull/7188)）
- [D03 标题都写 Responses 兼容，实际不是同一功能](#d03)（[#8185](https://github.com/farion1231/cc-switch/pull/8185)、[#7952](https://github.com/farion1231/cc-switch/pull/7952)）
- [D04 都叫终端提示延迟，修的层不同](#d04)（[#6716](https://github.com/farion1231/cc-switch/pull/6716)、[#3758](https://github.com/farion1231/cc-switch/pull/3758)）
- [D05 都叫界面闪烁，触发原因不同](#d05)（[#8201](https://github.com/farion1231/cc-switch/pull/8201)、[#8145](https://github.com/farion1231/cc-switch/pull/8145)、[#8200](https://github.com/farion1231/cc-switch/pull/8200)、[#8260](https://github.com/farion1231/cc-switch/pull/8260)、[#6420](https://github.com/farion1231/cc-switch/pull/6420)）
- [D06 相同的回复重复症状，协议链不同](#d06)（[#8025](https://github.com/farion1231/cc-switch/pull/8025)、[#6793](https://github.com/farion1231/cc-switch/pull/6793)、[#6766](https://github.com/farion1231/cc-switch/pull/6766)、[#6319](https://github.com/farion1231/cc-switch/pull/6319)）
- [D07 地址造成 404，但三种输入各不相同](#d07)（[#7259](https://github.com/farion1231/cc-switch/pull/7259)、[#6977](https://github.com/farion1231/cc-switch/pull/6977)、[#6292](https://github.com/farion1231/cc-switch/pull/6292)）

<a id="d01"></a>

### D01　Ghostty 看似重提旧修复，但当前主分支已不保留旧做法

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#5572](https://github.com/farion1231/cc-switch/pull/5572) fix(terminal): restore Ghostty session resume via --input=raw: | 开放 | 2026-07-20 | `5b0b61b8b5c6` |
| [#1506](https://github.com/farion1231/cc-switch/pull/1506) fix: restore Claude session resume in Ghostty | 已合并 | 2026-03-15 | `0ee0697590f7` |

**代码层面的结论：** #5572 与已合并 #1506 都用 --input=raw: 替代 -e，并对换行和反斜杠转义，核心新增代码高度相同。不过检查当前 main 的 launch_ghostty，仍是 -e、shell、-l、-c 的参数路径，旧 raw input 做法已不在当前实现中。不能只看到历史上合并过 #1506 就认定现在的问题已经解决。

**对应实现位置：**

- `src-tauri/src/session_manager/terminal/mod.rs` — launch_ghostty、build_ghostty_args、ghostty_raw_input；[#5572 文件差异](https://github.com/farion1231/cc-switch/pull/5572/files#diff-69fdc7d4d0b40a8e1466d547d9cfe35dfc4d82391a3c1ccca23ee4e07226414b)、[#1506 文件差异](https://github.com/farion1231/cc-switch/pull/1506/files#diff-69fdc7d4d0b40a8e1466d547d9cfe35dfc4d82391a3c1ccca23ee4e07226414b)。

**建议处理：** 将 #5572 作为恢复旧修复的候选继续评审，核对旧做法后来为何被替换，并在当前 Ghostty 版本复现。此处确认的是代码历史与当前状态差异，尚未执行 macOS 运行测试。

<a id="d02"></a>

### D02　新提交的共享密钥变量与旧多密钥配置不是同一功能

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8264](https://github.com/farion1231/cc-switch/pull/8264) feat(api-key-vars): add shared API key variables with script-based refresh | 开放 | 2026-10-13 | `679c0cc5debb` |
| [#7188](https://github.com/farion1231/cc-switch/pull/7188) feat: 支持供应商配置多个 API Key | 开放 | 2026-09-07 | `dac3ad994f37` |

**代码层面的结论：** #8264 新建变量解析、缓存和脚本刷新服务，把 {{变量名}} 解析成当前密钥供多个供应商引用；#7188 则在 ProviderMeta 和供应商表单中增加 apiKeys 列表及备注，保存多份密钥。后者没有同样的跨供应商变量解析或脚本刷新服务，前者也不等于提供了每个供应商的多密钥列表。

**对应实现位置：**

- `src-tauri/src/services/api_key_vars/resolve.rs` — parse_ref、resolve_value；[#8264 文件差异](https://github.com/farion1231/cc-switch/pull/8264/files#diff-7e5afc2f565eba5518b28a2002258c40bcae30ca5278eccffd63507de2bc468c)。
- `src-tauri/src/services/api_key_vars/mod.rs` — all_references、刷新调度；[#8264 文件差异](https://github.com/farion1231/cc-switch/pull/8264/files#diff-40710606cd56ab679a1a2b560b1ddec18d26aeb3da6912ae9717d4f71a2022c6)。
- `src-tauri/src/provider.rs` — ApiKeyEntry、api_keys；[#8264 文件差异](https://github.com/farion1231/cc-switch/pull/8264/files#diff-ac7d6f712ca0cbb6541bde3bf138323364434d6438ce359a3d8884c6dafa2b3c)、[#7188 文件差异](https://github.com/farion1231/cc-switch/pull/7188/files#diff-ac7d6f712ca0cbb6541bde3bf138323364434d6438ce359a3d8884c6dafa2b3c)。
- `src/components/providers/forms/ProviderForm.tsx` — apiKeys；[#7188 文件差异](https://github.com/farion1231/cc-switch/pull/7188/files#diff-c3c28ddc2481014e5428ac6ad6718c10dee78f5295f6bc2cde505a60d1181e3d)。

**建议处理：** 可分别评审；若将来同时合入，应再统一多密钥字段是否支持变量引用，当前不能因为都涉及 API Key 就关闭其中一条。

<a id="d03"></a>

### D03　标题都写 Responses 兼容，实际不是同一功能

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8185](https://github.com/farion1231/cc-switch/pull/8185) fix(codex): add opt-in native Responses compatibility | 开放 | 2026-10-12 | `5318445640b1` |
| [#7952](https://github.com/farion1231/cc-switch/pull/7952) feat(codex): opt in native OpenAI capabilities for Responses relays | 开放 | 2026-10-08 | `9d72244863a2` |

**代码层面的结论：** #7952 让兼容官方协议的转发服务保留模型目录能力、Fast 档和远程压缩；#8185 增加命名空间兼容和按模型注入 api_version。主要配置开关和实际行为不同。

**对应实现位置：**

- `src-tauri/src/provider.rs` — codex_official_compatible；[#7952 文件差异](https://github.com/farion1231/cc-switch/pull/7952/files#diff-ac7d6f712ca0cbb6541bde3bf138323364434d6438ce359a3d8884c6dafa2b3c)。
- `src-tauri/src/proxy/providers/codex.rs` — responsesCompatibility、apply_native_responses_api_version；[#8185 文件差异](https://github.com/farion1231/cc-switch/pull/8185/files#diff-2c9a29f63858c6803a6cabe70324e34504f042eaae2fbbd041d81ea29153ba4c)、[#7952 文件差异](https://github.com/farion1231/cc-switch/pull/7952/files#diff-2c9a29f63858c6803a6cabe70324e34504f042eaae2fbbd041d81ea29153ba4c)。

**建议处理：** 可分别审查；同名“原生兼容”不能作为重复依据。

<a id="d04"></a>

### D04　都叫终端提示延迟，修的层不同

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#6716](https://github.com/farion1231/cc-switch/pull/6716) fix(terminal): show provider-terminal toast at launch, not at window close | 开放 | 2026-08-22 | `c7043b5e93c0` |
| [#3758](https://github.com/farion1231/cc-switch/pull/3758) fix(provider): show terminal launch feedback immediately | 开放 | 2026-06-05 | `828b0796fda7` |

**代码层面的结论：** #3758 在前端等待打开期间先显示“正在打开”；#6716 修 Windows 后端等待 stdout 管道结束，避免必须关终端后调用才返回。

**对应实现位置：**

- `src/App.tsx` — handleOpenTerminal；[#3758 文件差异](https://github.com/farion1231/cc-switch/pull/3758/files#diff-26ad4b834941d9b19ebf9db8082bd202aaf72ea0ddea85f5a8a0cb3c729cc6f2)。
- `src-tauri/src/commands/misc.rs` — run_windows_start_command；[#6716 文件差异](https://github.com/farion1231/cc-switch/pull/6716/files#diff-c5aed63713e8f68f8ba06c4529263ef62c5ec7e45b614d8c18db5e4916cd571d)。

**建议处理：** 两者可以互补。前端提前显示消息不能替代后端阻塞修复。

<a id="d05"></a>

### D05　都叫界面闪烁，触发原因不同

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8201](https://github.com/farion1231/cc-switch/pull/8201) fix(ui): panel flicker | 已合并 | 2026-10-12 | `34cbc44ae5eb` |
| [#8145](https://github.com/farion1231/cc-switch/pull/8145) fix(providers): avoid flicker when opening the provider editor | 已合并 | 2026-10-11 | `3c30e531cb0f` |
| [#8200](https://github.com/farion1231/cc-switch/pull/8200) test(providers): verify edit panel opens without fading | 开放 | 2026-10-12 | `42fe29173331` |
| [#8260](https://github.com/farion1231/cc-switch/pull/8260) chore(providers): follow up on panel transition cleanup | 开放 | 2026-10-13 | `f9fa335feb14` |
| [#6420](https://github.com/farion1231/cc-switch/pull/6420) fix(windows): prevent provider form values from flickering | 开放 | 2026-08-13 | `f93272cbfe38` |

**代码层面的结论：** 已合并 #8145 等初始数据就绪再开编辑器；#8201 修面板透明动画和工作区读取竞争；#8200 是真实面板动画测试；#8260 是后续清理。#6420 关闭 Windows WebView2 自动填充，修的是字段值被浏览器改写。

**对应实现位置：**

- `src/components/providers/EditProviderDialog.tsx`；[#8145 文件差异](https://github.com/farion1231/cc-switch/pull/8145/files#diff-efc22b26c27741936e8a66ac39ebc95653f7d2ea14835432bf6b85823c8aab6f)、[#8260 文件差异](https://github.com/farion1231/cc-switch/pull/8260/files#diff-efc22b26c27741936e8a66ac39ebc95653f7d2ea14835432bf6b85823c8aab6f)。
- `src/components/common/FullScreenPanel.tsx`；[#8201 文件差异](https://github.com/farion1231/cc-switch/pull/8201/files#diff-522ac4e1a97785b50bb652d31f8952cd53271749ef00074f4894a435619bf5b9)、[#8260 文件差异](https://github.com/farion1231/cc-switch/pull/8260/files#diff-522ac4e1a97785b50bb652d31f8952cd53271749ef00074f4894a435619bf5b9)。
- `src-tauri/src/lib.rs` — WebView2 autofill；[#6420 文件差异](https://github.com/farion1231/cc-switch/pull/6420/files#diff-eabcebd0ae5c9b77a5247e1bdbdb88b1869fc0c932d0ef0cf2ecf9ee5221be7c)。
- `tests/components/EditProviderDialog.test.tsx`；[#8145 文件差异](https://github.com/farion1231/cc-switch/pull/8145/files#diff-8a67edf8c59c38897f04ce8f57f8cc8f43a0ac9c068679d48e3d635e310cecf9)、[#8200 文件差异](https://github.com/farion1231/cc-switch/pull/8200/files#diff-8a67edf8c59c38897f04ce8f57f8cc8f43a0ac9c068679d48e3d635e310cecf9)。

**建议处理：** 测试、清理和 Windows 自动填充问题不能因最近合并了“闪烁修复”而一并关闭。

<a id="d06"></a>

### D06　相同的回复重复症状，协议链不同

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#8025](https://github.com/farion1231/cc-switch/pull/8025) fix(codex): 修复 GitHub Copilot Responses 重复回复 | 开放 | 2026-10-09 | `690e51947776` |
| [#6793](https://github.com/farion1231/cc-switch/pull/6793) fix(proxy): prevent duplicate Responses text in Anthropic SSE | 开放 | 2026-08-25 | `0f23294fe020` |
| [#6766](https://github.com/farion1231/cc-switch/pull/6766) fix(proxy): avoid replaying terminal response text | 开放 | 2026-08-24 | `d52d05ffef1e` |
| [#6319](https://github.com/farion1231/cc-switch/pull/6319) fix(codex): prevent reasoning leak and duplication in Chat→Responses streaming | 开放 | 2026-08-10 | `eea8baa54c71` |

**代码层面的结论：** #8025 修 Copilot 原生 Responses 的 item ID 稳定性；#6793/#6766 修 Responses→Anthropic 的末尾正文重放；#6319 修 Chat→Responses 的思考标签和正文泄漏。

**对应实现位置：**

- `src-tauri/src/proxy/providers/copilot_responses.rs`；[#8025 文件差异](https://github.com/farion1231/cc-switch/pull/8025/files#diff-2cf0e6b1774dbc929fe449ca0c171ede92cbe38d97160d1e3ed661a72d85a380)。
- `src-tauri/src/proxy/providers/streaming_responses.rs`；[#6793 文件差异](https://github.com/farion1231/cc-switch/pull/6793/files#diff-27c657392315bc25d32727ca2a35d1d981f5235180683bc64805b6a07f497bb3)、[#6766 文件差异](https://github.com/farion1231/cc-switch/pull/6766/files#diff-27c657392315bc25d32727ca2a35d1d981f5235180683bc64805b6a07f497bb3)。
- `src-tauri/src/proxy/providers/streaming_codex_chat.rs`；[#6319 文件差异](https://github.com/farion1231/cc-switch/pull/6319/files#diff-5e25a4b8908557fb0aeb5d8360324f241256147633f7949a27372d91325328f6)。

**建议处理：** 只有 #6793 与 #6766 是同一状态机上的直接竞争方案；不能把其他两个也当成已被覆盖。

<a id="d07"></a>

### D07　地址造成 404，但三种输入各不相同

| PR | 截止时状态 | 创建日期（UTC） | 审查的代码版本 |
| --- | --- | --- | --- |
| [#7259](https://github.com/farion1231/cc-switch/pull/7259) fix(proxy): fall back to concatenation when full URL stops at /v1 | 开放 | 2026-09-09 | `79fd8605fdca` |
| [#6977](https://github.com/farion1231/cc-switch/pull/6977) fix(proxy): support versioned OpenAI-compatible base URLs | 开放 | 2026-08-29 | `2970c2ae3d75` |
| [#6292](https://github.com/farion1231/cc-switch/pull/6292) fix(claude): strip full endpoint suffix from base URL to avoid double-path 404 | 开放 | 2026-08-09 | `14a40681d37b` |

**代码层面的结论：** #7259 处理声明完整 URL 却只填到 /v1；#6977 处理 /v2 等带版本的基础地址；#6292 处理把完整 /messages 或 /chat/completions 填进基础地址后重复拼接。

**对应实现位置：**

- `src-tauri/src/proxy/forwarder.rs` — full_url_is_version_prefix_only、base_url_has_version_path；[#7259 文件差异](https://github.com/farion1231/cc-switch/pull/7259/files#diff-f044859ac54504af1d076ea87d5b28b782066cb8ee4712bb124d177e06bca080)、[#6977 文件差异](https://github.com/farion1231/cc-switch/pull/6977/files#diff-f044859ac54504af1d076ea87d5b28b782066cb8ee4712bb124d177e06bca080)。
- `src-tauri/src/proxy/providers/claude.rs` — strip_full_endpoint_suffix；[#6292 文件差异](https://github.com/farion1231/cc-switch/pull/6292/files#diff-d378bfc12b947319932500035a791935c085d3088808cce58f25b3769454c82b)。

**建议处理：** 可以统一 URL 处理规则，但现有三个补丁不能仅按“都修 404”认定互相替代。

## 已关闭的历史重提示例

以下三组比较过实际新增代码；旧 PR 已关闭，不作为当前重复开放队列计算。新增行集合一致仍不等于提交、注释、测试和元数据逐字相同。

| 旧 PR → 当前 PR | 代码比较结果 |
| --- | --- |
| [#7483](https://github.com/farion1231/cc-switch/pull/7483)（已关闭、未合并）→ [#7487](https://github.com/farion1231/cc-switch/pull/7487)（开放） | 2 个非噪声文件的规范化新增行集合一致。 |
| [#8244](https://github.com/farion1231/cc-switch/pull/8244)（已关闭、未合并）→ [#8250](https://github.com/farion1231/cc-switch/pull/8250)（开放） | 6 个非噪声文件的规范化新增行集合一致。 |
| [#4903](https://github.com/farion1231/cc-switch/pull/4903)（已关闭、未合并）→ [#5026](https://github.com/farion1231/cc-switch/pull/5026)（开放） | 16 个非噪声文件的规范化新增行集合一致。 |

## 审查层级与边界

全部 PR 都进入差异索引与代码筛选；上面的组另外完成了相关实现的逐组复核。未列出的条目没有被宣称为“无重复”。比较范围包括前后端、配置写入、协议转换、数据导入、测试和目标分支，但没有逐个编译或运行 PR。相同代码可能来自共同祖先或叠加开发，本报告不据此判断作者动机或代码来源。
