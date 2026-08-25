---
title: 数据中心最终验收要主动制造故障
date: 2026-08-23 06:00:00
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
i18n_key: data-center-commissioning
---

一座数据中心已经做过多次 commissioning exercise。DRUPS 能带住 IT load，mechanical generator 也能启动，每次测试结束以后，day tank 还剩燃油。

到了最后的 Tier facility demonstration，发电机要连续运行一整天。几个小时以后，多台 DRUPS 的 low-fuel alarm 同时响了。

最后查出来的不是发动机故障，而是一段 fuel transfer sequence：day tank 请求补油时，solenoid valve 先开，fuel pump 延迟启动。工程师把这段 delay 删掉，问题就有了解法。

可原定交付日还算数吗？旧的 PASS 还证明什么，哪些测试必须重做，谁有权在 issue log 仍未清零时签下 Ready for Service（RFS）？

<!-- more -->

## 为什么之前一直没有暴露

这个 [Uptime Institute 记录的案例](https://journal.uptimeinstitute.com/avoiding-data-center-construction-problems/)里，短时测试每次都停在 day tank 耗尽以前。测试与下一次启动之间隔着一整夜，pump 即使顶着已经关闭的 valve 运转，仍有少量燃油慢慢越过去，把 day tank 重新补了起来。

全天连续运行改变了测试边界。Day tank 一边消耗，bulk tank 必须同时补给；燃油靠重力先流过打开的 solenoid valve，又触发 automatic leak-detection valve 关闭，延迟启动的 pump 随后只能对着 closed valve 加压。之前的测试证明了 generator 能启动，也证明了短时切换能完成，却从未证明 fuel system 能持续维持 generator mode。

测试跑得更久以后，测试对象也变了：短时运行只覆盖 state transition，全天运行才覆盖 steady state。Battery 会放电和回充，day tank 会消耗和补给，设备与管路会升温，控制状态会累计；任何一个慢变量没有跨过完整循环，PASS 都只属于那段较短的运行窗口。

[Uptime Institute 的 commissioning guidance](https://journal.uptimeinstitute.com/improve-project-success-through-mission-critical-commissioning/)建议关键设备的 load-bank test 至少连续八小时，24 小时属于 best practice。具体项目不能机械地抄这个时长，但必须把 fuel autonomy、thermal behavior、battery recharge 和 acceptance criteria 一起放进 test duration。

## 从哪里断，决定旧证据证明了什么

运行多久只是一个边界。故障从哪里注入，同样会改变测试对象。

[Uptime Institute 2023 年对 pull-the-plug test 的分析](https://journal.uptimeinstitute.com/are-utility-companies-needed-for-pull-the-plug-testing/)列出了三种常见做法。Utility provider 可以直接切断进入园区的电源，让设施经历真实的 grid loss；项目也可以在 transformer 上游打开 isolation device，自行隔离市电；还可以拔掉 transformer fuse，让 PLC 收到 power-loss signal。

三种方法都可能让 generator 启动，却不一定覆盖同一条路径。Isolation device 如果由 PLC 监控，开关动作可能直接触发 backup sequence，绕过依赖 transformer 状态的 loss detection。拔 fuse 时，真正的 grid power 往往等到 generator 上线以后才离开，UPS battery 只短暂放电，部分 ancillary process 也可能没有被触发。

因此，旧的 PASS 不能脱离 fault injection point 来读。它证明的是某种 topology、某个 load point、某版 controls configuration 在一种故障边界下的结果。换一个开关位置，或者把 simulated loss 换成真实 grid loss，测试覆盖面就跟着变化。

## 一次断电把四条链叠在同一时间线上

完整的 utility-loss Integrated Systems Testing（IST），也不是 UPS 和 generator 之间的一次接力。

电力侧要检测 loss of source，UPS 转入 battery，generator 完成启动并达到允许的 voltage 与 frequency，switchgear 再把 critical bus 转到现场电源。冷却侧有自己的 ride-through 与 restart sequence：pump、CRAH、CDU 和 controls 未必都在同一段 UPS 上，有些依靠 UPS，有些依靠 thermal inertia，有些要等 generator bus 稳定以后重启。

BMS、EPMS 与 plant controller 要把 breaker position、generator state、flow、temperature、alarm 和 restart command 放到同一组 timestamp 里。Operations 也在这条时间线上：告警是否正确，Emergency Operating Procedure（EOP）是否匹配现场状态，自动恢复失败以后谁在什么条件下介入。

![一次市电中断如何同时穿过电力、冷却、控制与运营](/images/data-center-integrated-systems-test.svg)

[Uptime Institute 对 Tier facility demonstration 的说明](https://journal.uptimeinstitute.com/tiercertificationpreparation/)要求切断 incoming utility，由 UPS 维持 critical load，等 engine generator 接管，同时确认 cooling system 能跨过转换过程。Load bank 也要尽量按真实 rack 分布放进 data hall，才能让 electrical distribution 与 airflow 面对接近实际的负载；液冷系统还要另行建立能给 TCS 与 CDU 加上 thermal/hydraulic load 的测试条件。

于是一次 utility-loss IST 的 PASS 属于整条时间线。IT load 没掉，只能证明电力链没有越界；cooling recovery 超时、alarm sequence 错误或 EOP 无法执行，仍会让同一个 scenario 失败。

## 改掉一个 Delay，哪些测试需要重做

Fuel transfer delay 改掉以后，generator 还是同一台，测试对象却已经换成了新 sequence。旧的失败记录不能删除，旧的 PASS 也不能直接替新配置签字。

Uptime Institute 要求，programming 或 control wiring 为修复失败步骤而改变时，要重新执行完整的相关 test procedure；Level 5 中的任何变更也要先评估哪些测试必须重做。这里不是“改一行就把全部 L5 从头跑一遍”，也不是只盯着 low-fuel alarm 再等一次。

CxA 要先做 change-impact review。改动的 upstream trigger 是 day-tank low-level request，直接动作是 solenoid valve 与 pump，downstream response 是 tank level、fuel pressure 和 alarm；所有共用这段逻辑的 generator-mode scenario 都要重新判断。受影响的 procedure 要从 prerequisite、fault injection、持续运行到 recovery 完整执行，直到 day tank 真正经历消耗与在线补给。

PASS 因而必须绑定配置与证据：哪一版 single-line 和 sequence，哪些 setpoint 与 firmware，fault 从哪里注入，load 怎样施加，每一步允许的 threshold，以及 power quality、flow、temperature、alarm 与 operator log 的 timestamp。配置改变以后，change-impact review 决定哪些 evidence 仍有效，哪些已经过期。

一次 retest 通过也不会抹掉第一次失败。Issue log 仍要保留 root cause、责任方、修改内容、影响范围和 witness，才能证明缺陷被关闭，而不是换了一个更容易通过的脚本。

## 一次 FAIL 会不会推迟 RFS

答案不在通用的 L1-L5 定义里，而在项目合同里。

一份 2026 年公开的 [Digi Power X 与 Cerebras colocation agreement](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm)把 RFS 写得很具体：对应 phase 已经完成 construction、commissioning 与 testing，contracted IT Load 可以供客户设备 energize，并满足合同 exhibits 中的 criteria。Operator 发出 RFS Notice 时要附 Engineer of Record 准备的 commissioning report；客户随后可以检查 material deviation，发现 bona fide deficiency 后还要等整改并再次验证。

同一份合同也把 RFS 接到了 commercial event。Phase Commencement Date 就是 RFS 达成日，monthly colocation fee 从相应阶段开始；若 operator 错过 delivery date，合同设置 daily RFS credits，拖过 final outside date，客户还可能终止对应 service order。

回到 fuel transfer case，如果 acceptance criteria 要求 generator mode 持续支撑 critical load，low-fuel alarm 暴露的补油失败就是 blocking defect。删掉 delay 只完成整改，足够时长的 generator-mode retest 通过以后，operator 才重新拥有支持 RFS Notice 的证据。

其它 open item 能不能延期，仍由合同、法律要求和授权的 exception process 决定。等待季节条件的测试、不会影响功能的标识或文档尾项，可能进入 deferred list；无法维持 required critical load 的 fuel sequence，不能靠 owner 写下 residual risk 就变成 PASS。

## Time-to-Pass 怎样进入 Economics

现在，“下一笔钱”终于有了触发条件。RFS 晚一天，operator 的 recurring fee 可能晚一天开始，还可能同时承担 delay credit；一次 IST 失败又会增加 CxA、OEM technician、load-bank rental、generator fuel 与 retest days。Commissioning 的 operational constraint 通过 RFS 进入了合同与现金流。

但这还没有自动变成某家 controls vendor、CxA 或 OEM 的 alpha。要继续往下走，必须知道谁拥有这段 sequence，谁对整改负责，合同按 fixed price、time and materials 还是 performance incentive 计费，额外 retest 是收入、无偿返工还是 liquidated damage，以及这部分变化能否进入 segment revenue、margin 与 cash flow。

公开材料没有给出 fuel transfer case 的供应商与合同，也没有把 Digi Power X 项目的具体 commissioning failure 映射到某一家上市供应商。Company-level economics 尚未建立，price-in 也只能标成 Unverified。能够缩短 time-to-pass 很重要，谁能把它留下来，仍需要 supplier award、合同责任和财务数据来证明。

所以，一次断电测试失败会不会推迟交付，不能看 generator 有没有重新启动，也不能看 issue log 是否少了一行。要看失败触及哪条 RFS criterion，修改让哪些旧证据失效，受影响的 scenario 有没有在同一故障边界和足够时长下重新通过。

RFS 以后，facility capacity 才能承接 IT load。下一道边界落到 rack：GPU、CPU、HBM、NIC、power shelf 和 cold plate 都到齐以后，为什么还不能直接搬进 data hall？
