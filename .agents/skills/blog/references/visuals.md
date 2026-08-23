# 博客配图

配图承担一次文字难以完成的认知转换。它不是文章深度的证明，也不是每个 subsystem 的标准交付包。主线未稳定以前不定图数、不复制上一篇的图型组合。

## 先写认知型 Figure Brief

每张图在绘制前写清：

```text
读者看图前怎样理解
哪种关系仅靠正文仍然看不见
看图后应当怎样修正理解
图中不可缺少的对象、状态、单位和数据
来源、日期和不确定性
为什么段落或表格不能更清楚地完成这一步
```

如果无法指出读者模型的具体变化，不画。若删除图不影响后续判断，图没有承担论证；若图只是在答案讲完后重复摘要，也没有必要。

## 按问题选择形式

图型是后台选项，不是写作顺序：

- **Anatomy / architecture**：整体、层级与边界
- **Flow / path**：physical、digital、contractual 或 financial flow
- **State machine**：状态转换和 gate evidence
- **Dependency graph**：参与方、并行工作和硬依赖
- **Gantt**：时间尺度、重叠、等待和 critical path 本身就是答案
- **Ledger / waterfall / sensitivity**：headline number 到可用结果的 reconciliation
- **Map / timeline / trend**：空间或时间分布改变判断

Gantt 只在任务持续时间、并行关系和 critical path 缺一不可时使用。若只需说明前置依赖，用 dependency graph；若只需说明状态，用 state machine。不能因为上一篇有 Gantt，下一篇也补一张。

一张图只承担一个主问题。内容过多时从 high-level 到 low-level 拆开；不要把相同关系换几种图重复表达，也不要把不同维度塞进同一排制造错误并列。

## 信息设计

- 图出现在读者需要那次模型升级的位置，不在章节末尾补作总结。
- 正文已有上下文时，图内不重复文章标题、长副标题、方法论、作者备注或结论。
- 图例只保留解码颜色、形状、线型和状态所必需的信息。
- 图中的对象、层级、状态、单位、时间和正文一致；跨项目或跨地域数据明确标注。
- 同系列保持 typography、颜色语义、线型和编号系统一致，但 composition 由当前问题决定。
- 开画前检查同系列现有配图，避免只替换文字的模板复制。

## 双语

有可见文字的图使用成对文件：`name.svg` 和 `name.en.svg`。中文版以中文为主，只保留业内通用且翻译会失真的术语；英文版翻译所有中文可见文字和 accessibility metadata。

两种语言保持相同的数据、结构、状态、视觉编码和画布语义。修改任一版本时同步检查另一版本，英文正文引用 `.en.svg`。

## SVG 几何

- 为固定格式元素设置稳定尺寸和对齐基线，文字不能改变节点布局。
- 先计算文字宽度和换行，再确定容器；序号、label 和长单词不能贴边或溢出。
- 能走直线的 connector 使用直线；需要转弯时保持统一正交路径和转角半径。
- connector 连接到节点边界或明确 port，不能悬空、穿过文字或依靠视觉猜测。
- 使用 `marker-end` 时检查 `refX`、viewBox 和 path 终点，线段停在箭头尾部，不穿过箭头尖。
- 相邻节点之间同时容纳可见线段和箭头，不能只剩箭头尖。
- 重复节点共享基线、间距和连接规则，不逐个目测摆放。
- 删除元素后重新裁切画布，避免无意义空白。

## SVG 与 PNG 一起交付

每个最终 SVG 生成同名 PNG：

```text
source/images/name.svg     -> ../wxmp/name.png
source/images/name.en.svg  -> ../wxmp/name.en.png
```

PNG 是完整 SVG 的 raster 版本，不是重新设计。使用可靠 renderer 按完整 `viewBox` 导出，保留宽高比、背景、字体、颜色、线条、marker、clip path 和 filter；不用带网页边距的截图代替。

把 SVG 与 PNG 渲染到相同尺寸对照画布、节点、文字、connector、箭头、图例和数据。字体替换、溢出、裁切、缺失或位移必须回到 SVG 或渲染环境修正，不单独涂改 PNG。

## 每篇文章的封面

中文标题和主视觉稳定后，生成 5:2 横版封面并保存到 `../wxmp/<slug>.png`。Hexo 自动 OG card 不能替代。用户提供样例时必须作为 reference image。

```text
Generate an image with a 5:2 aspect ratio for my blog, and make it work in both contexts:
1. A blog cover banner.
2. A square sharing thumbnail.

Keep all essential text and the primary visual subject inside the centered square safe area. Set the exact article title in a compact two-line layout. Match the composition, typography, visual language, and finish of the provided reference image. Do not add unrequested copy, logos, or watermarks.
```

中央正方形安全区边长等于横图高度；左右只放裁掉也不影响识别的延伸画面。标题使用确认后的准确文字，紧凑两行，不擅自改写，不添加文案。

再以 5:2 版本为 reference image 重构 3:4 竖版，保存到 `../wxmp/<slug>-3x4.png`。保持标题、主体、色彩、材质和视觉语言；不拉伸，也不机械裁切。

## 视觉验收

SVG 源码通过 XML 检查不代表图正确。每个语言版本实际渲染：

1. 桌面宽度检查整体层级和路径。
2. 约 390 px 宽度检查移动端可读性。
3. 对文字密集区和 connector 放大 3x-4x。
4. 检查溢出、遮挡、错位、断线、交叉、箭头穿透和图例。
5. 对照正文核对对象、数据、状态、单位和术语。
6. 对照同名 PNG，确认完整还原 SVG。
7. 检查 5:2 全图、中央 1:1 裁切和 3:4 全图。

发现一类几何问题时检查整组图和双语版本。最终再做语义验收：这张图是否确实让读者完成 figure brief 里定义的那次模型升级。
