# 博客配图

配图用于让读者看见纯文字难以表达的结构、流程、依赖、数量关系、地理分布或时间变化。先确定图要回答的问题，再决定图形；不要为了“文章需要图片”添加装饰图。图多不等于研究深，图必须来自文章已经建立的系统模型与证据。

## 先选对图

写下 figure brief：读者的问题、图中必须出现的数据或节点、要看见的关系、来源与口径。再选择形式：

- **Anatomy / architecture**：回答整体由什么组成、层级和边界在哪里
- **Flow / path**：回答物理、数据、合同或现金怎样从起点走到终点
- **State machine**：回答不同状态怎样转换、每道 gate 需要什么证据
- **Dependency graph / Gantt**：回答参与方、并行工作、硬依赖与 critical path
- **Ledger / waterfall / sensitivity**：回答一个 headline number 怎样变成可交付结果，哪些变量最敏感
- **Map / timeline / trend**：回答容量、状态或需求在空间和时间上怎样变化

同一张图不要同时承担全貌、项目计划、容量换算和结论。信息过多时从 high-level 到 low-level 拆开，但不要把同一关系换几种图重复表达。

## 信息设计

- 一张图只承担一个主要问题，正文应在读者需要这个答案的位置引用它。
- 正文已经提供上下文时，图内不重复文章标题、长副标题、方法论、作者备注或结论。
- 图例只保留解码颜色、形状、线型和状态所必需的信息。
- 不同维度不要放在同一排或用同一种容器，以免制造错误的并列关系。
- 图中的层级、状态、单位、数据和正文必须一致。

## 双语

有可见文字的图使用成对文件：`name.svg` 和 `name.en.svg`。中文版以中文为主，只保留业内通用且翻译会失真的术语；英文版翻译所有中文可见文字和 accessibility metadata。

两种语言保持相同的数据、结构、状态、视觉编码和画布语义。修改任一版本时同步检查另一版本，英文正文必须引用 `.en.svg`。

## SVG 几何

- 为固定格式元素设置稳定的尺寸和对齐基线，文本不能改变框、节点或工具条的布局。
- 先计算文字宽度和换行，再确定容器；序号、label 和长单词不能贴边或溢出。
- 能走直线的 connector 使用直线。需要转弯时保持统一的正交路径和转角半径。
- connector 必须连接到节点边界或明确 port，不能悬空、穿过文字或依靠视觉猜测。
- 使用 `marker-end` 时检查 marker 的 `refX`、viewBox 和 path 终点，保证线段停在箭头尾部，不穿过箭头尖。
- 相邻节点之间必须同时容纳可见线段和箭头，不能只剩箭头尖。
- 重复节点共享同一基线、间距和连接规则，不逐个目测摆放。
- 删除文字或元素后重新裁切画布，避免无意义空白。

## SVG 与 PNG 一起交付

文章定稿后，每个最终 SVG 都必须生成同名 PNG，不能只交 SVG 源文件。默认文件映射为：

```text
source/images/name.svg     -> ../wxmp/name.png
source/images/name.en.svg  -> ../wxmp/name.en.png
```

PNG 是 SVG 的 raster 版本，不是重新设计的一张图。必须使用可靠的 SVG renderer 按完整 `viewBox` 导出，保留原始宽高比、背景、字体、颜色、线条、marker、clip path 和 filter；不要用带网页边距的截图代替导出，也不要为了修 PNG 单独修改位图。

导出后把 SVG 与 PNG 渲染到相同尺寸逐项对照：画布边界、节点位置、文字换行、connector 终点、箭头、图例和数据必须一致。再单独检查 PNG 的实际像素尺寸与移动端可读性。出现字体替换、文字溢出、裁切、缺失元素或布局位移时，修正 SVG 或渲染环境后重新生成。

## 每篇文章的封面

中文标题和主视觉稳定后，为每篇文章生成一张 5:2 横版封面。默认保存到 `../wxmp/<slug>.png`；Hexo build 自动生成的通用 OG card 不能替代它。生成时使用下面这组约束；用户提供了样例时，必须把样例作为 reference image，而不是只用文字猜它的风格：

```text
Generate an image with a 5:2 aspect ratio for my blog, and make it work in both contexts:
1. A blog cover banner.
2. A square sharing thumbnail.

Keep all essential text and the primary visual subject inside the centered square safe area. Set the exact article title in a compact two-line layout. Match the composition, typography, visual language, and finish of the provided reference image. Do not add unrequested copy, logos, or watermarks.
```

中央正方形安全区的边长等于横图高度；左右区域只能承载即使被裁掉也不影响识别的延伸画面。标题必须使用已经确认的准确文字，紧凑排成两行，不能擅自改写，也不能生成乱码、错字或额外文案。文章主题、核心对象和视觉冲突要在第一眼成立，不能只做成气氛背景。

5:2 版本完成后，以它作为 reference image 再生成一张 3:4 竖版封面，保存到 `../wxmp/<slug>-3x4.png`。3:4 版本要重新组织构图，保持同一标题、主体、色彩、材质和视觉语言；禁止把横图直接拉伸，也不要机械裁切到主体或文字残缺。

两种封面都要实际打开验收。5:2 版本同时检查完整横幅和中央 1:1 裁切结果；3:4 版本检查完整竖图。确认宽高比准确、标题两行可读、核心信息未越出安全区、边缘无裁切、人物或物体没有生成缺陷，再视为完成。

## 视觉验收

SVG 源码通过 XML 检查不代表图是对的。每个语言版本都要实际渲染：

1. 桌面宽度查看整体层级和路径。
2. 约 390 px 宽度查看移动端缩放后的可读性。
3. 对文字密集区和 connector 以 3x-4x 放大检查。
4. 检查文字溢出、遮挡、错位、断线、交叉、箭头穿透和图例一致性。
5. 对照正文逐项确认数据、状态和术语。
6. 对照同名 PNG，确认 raster 输出完整还原 SVG。
7. 对封面检查 5:2 横幅、中央 1:1 裁切和 3:4 竖版三个最终画面。

发现一类几何问题时检查整组图和双语版本，不只修用户指出的单个节点。
