---
title: Booster 3.3.1 正式发布
categories:
  - Computer Science
  - Open Source
  - Booster
tags:
  - Booster
  - ReleaseNote
date: 2021-05-11 22:00:00
---

Booster 又双叒叕发布了新的版本—— v3.3.1，本次更新内容如下：

1. Fix issue [#222](https://github.com/didi/booster/issues/222) : `JavassistTransformer` 中没有将 app 编译的 *class* 添加到 *classPool* 中
1. Fix issue [#224](https://github.com/didi/booster/issues/224) : `Context.getFilesDir()` 返回 `null`
1. Fix issue [#231](https://github.com/didi/booster/issues/231) : 将 *commons-io* 从 *2.6* 升级至 *2.7* 修复漏洞 [CVE-2021-29425](https://github.com/advisories/GHSA-gwrp-pvrq-jmwv)
