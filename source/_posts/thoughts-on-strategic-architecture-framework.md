---
title: 关于战略架构框架的思考
categories:
  - Independent Thinking
date: 2023-05-13 20:00:00
---

在做架构设计的过程中，我们经常会提到一个概念——"标准化"。标准化，通过设定最佳实践和创建统一的标准，确保企业在所有业务领域中实现一致的性能。然而，当我们完成了标准化之后，我们应该怎么做呢？下一步又是什么？是否存在一个通用的框架，能够指导架构师和技术负责人进一步优化和发展？经过一番思考，这个框架在我脑海中变得逐渐清晰——从「规范化」到「标准化」再到「平台化」的三段式进阶模式。

## 规范化

规范化是将公司的流程、操作和规则进行系统化整理，以确保一致性和透明度的过程。在软件架构设计中，规范化通常包括定义和执行固定的设计原则、编码规范、审查流程和测试方法等。规范化的目标是提高效率、质量和可维护性，降低风险，并促进团队之间的协作和沟通。

规范化有助于实现公司战略的多个方面。首先，通过制定和遵守规范，公司可以减少错误和遗漏，提高产品质量。其次，规范化可以提高效率，因为员工可以按照已知的规则和流程进行操作，而不需要每次都重新发明轮子。此外，规范化还可以增强公司的预测能力，因为流程和结果变得更加可预测。最后，规范化有助于培养一个共享的、统一的公司文化，这对于吸引和保留人才非常重要。

实施规范化需要从顶层设计开始。首先，需要明确规范化的目标，例如提高效率、质量或可预测性。然后，需要定义规范，包括流程、操作和规则。这可能涉及到跨部门的协作，因为需要考虑到公司的各个方面。接着，需要进行培训和教育，确保所有员工都理解和接受这些规范。最后，需要监控和评估规范的执行情况，并进行必要的调整。

在实施的过程中可能会遇到一些挑战，例如员工的抵触、流程的复杂性、以及规范的更新和维护。为了解决这些问题，公司需要提供足够的支持和资源，包括培训、工具和时间。同时，需要建立一个反馈机制，以便及时发现和解决问题。

## 标准化

标准化是一个过程，通过这个过程，公司确定最佳实践并创建统一的标准，以确保所有业务中都能实现一致的性能。在软件架构设计中，标准化可能涉及到的范围包括但不限于编程语言的使用、代码风格、设计模式、数据库设计、API设计、测试方法等。标准化有助于减少复杂性，提高效率，降低错误率，同时也有利于新员工的快速熟悉和接手工作。

之所以需要标准化，其主要目的是用了提高生产效率。如果所有的项目都遵循相同的标准，那么从设计到实施、测试、维护的整个过程都会更加流畅，减少因为缺乏一致性而导致的混乱和错误。其次，标准化可以提高产品的质量，因为所有的工作都基于最佳实践和证明过的方法进行。此外，标准化还有助于提高团队的协作能力，因为所有人都遵循相同的规则和流程。

如果要实施标准化，其关键是要找到适合公司的最佳实践，并将其转化为可执行的标准。这可能需要进行一些研究和试验，找出哪些方法在你的特定环境中最有效。然后，需要对这些最佳实践进行编码，并制定出明确的标准。最后，需要对员工进行培训，以确保他们理解并遵循这些标准。

在实施标准化的过程中可能会遇到一些挑战，例如找到最佳实践、让员工接受新的标准、以及标准的更新和维护。为了克服这些挑战，可以考虑引入专门的角色或团队来负责标准化的工作，提供持续的培训和支持，以及定期评估和更新标准。

## 平台化

平台化是通过利用技术，将公司的业务、服务或产品转变为一个可扩展的平台的过程。这个平台可以吸引更多的用户和合作伙伴，实现网络效应，带来更大的市场份额和更高的利润。在软件架构设计中，平台化可能包括构建内部平台以提高开发效率，或者构建外部平台以吸引第三方开发者和合作伙伴。

### Amazon vs Google

在讨论平台化的重要性和战略意义时，我们不能不提到 [Stevey's Google Platforms Rant](https://johnsonlee.io/2023/04/15/steveys-google-platforms-rant/)。这是一篇由 Google 前员工 Steve Yegge 在 2011 年写的博客文章，详细描述了 Google 在平台化方面的失败，并把 Google 与成功实施平台化的 Amazon 进行了对比。尽管这篇文章在发布后不久就被删除，但它的内容已经在互联网上广为传播，并对许多公司的平台战略产生了深远影响。

在这篇文章中，Yegge 指出，Google 失败的主要原因是它没有把自己的产品和服务构建成一个真正的平台。相反，Google 的每一个产品都是独立的，没有共享的基础设施，也没有统一的 API。这导致 Google 的产品无法有效地互相协作，也无法吸引外部开发者。

与此相反，Amazon 成功地将自己的产品和服务构建成了一个强大的平台。Amazon 的每一个服务都有一个统一的 API，可以与其他服务无缝集成。这使得 Amazon 的服务不仅可以互相协作，还可以吸引大量的外部开发者。这就是为什么 Amazon 能够在竞争激烈的电商市场中取得领先地位。

Yegge 的故事向我们展示了平台化的重要性。一个成功的平台可以带来更大的效率，更强的影响力，以及更高的利润。而一个失败的平台，可能会让公司失去市场竞争力，甚至影响到公司的生存。

因此，对于任何想要在今天这个数字化、网络化的世界中取得成功的公司来说，平台化不再是一个选择，而是一种必要。只有通过平台化，公司才能实现真正的规模效应，才能吸引更多的用户和开发者，才能在竞争中获得优势。

### 阿里巴巴

阿里的“中台战略”是一个关于平台化成功实施的典型例子。阿里在经过多年的发展后，意识到公司内部的各个业务线在进行开发和运营时，存在大量重复的工作，这不仅浪费了资源，也降低了效率。为了解决这个问题，阿里开始构建各种“中台”，包括数据中台、技术中台、业务中台等，将公共的、重复的部分抽象出来，形成统一的平台服务。

阿里的中台战略的核心思想是，通过构建各种中台，将公司内部的公共资源和能力集中起来，形成统一的平台服务，供各个业务线使用。这样，各个业务线就可以专注于自己的核心业务，而不需要关心公共部分的开发和运营。这种方式大大提高了公司的效率和效果，同时也降低了复杂性。中台架构主要包括三个层次：底层的技术中台，中间的数据中台，和顶层的业务中台。

阿里的中台战略取得了显著的成效。通过构建各种中台，阿里成功地实现了公司内部的资源和能力的共享，提高了效率，降低了复杂性。同时，通过提供统一的API，阿里也吸引了大量的内部开发者，进一步推动了公司的创新能力。这种方式不仅提高了公司的运营效率，还提高了产品和服务的质量，为阿里在激烈的市场竞争中赢得了优势。

另外，阿里的中台战略也带来了一些其他的好处。比如，通过构建数据中台，阿里得以利用大数据和人工智能技术，提供更精准的个性化服务，提升用户体验。通过构建业务中台，阿里得以快速复制和扩展成功的业务模式，推动公司的快速发展。

阿里的中台战略向我们展示了平台化的强大力量。通过构建平台，公司可以实现资源和能力的共享，提高效率，降低复杂性。同时，平台也可以吸引大量的开发者，推动公司的创新能力。因此，对于任何想要在今天这个数字化、网络化的世界中取得成功的公司来说，平台化是一种必不可少的战略。

然而，近年来，阿里开始转向去中台化的策略，这引起了业界的广泛关注。去中台化并不意味着放弃了中台战略，相反，它反映了阿里对平台化核心思想的更深层次的理解。去中台化的核心思想是将中台的职能下沉到各个业务线中去，让业务线更直接地对客户需求和市场变化做出响应。在这个过程中，原有的中台仍然存在，但它的角色转变为提供基础设施和平台服务，而不再直接参与业务处理。

阿里的去中台化战略的实施过程包括三个阶段：一是中台的建立，二是中台的扩展，三是中台的下沉。在中台的建立阶段，阿里构建了各种中台，将公司内部的公共资源和能力集中起来，形成统一的平台服务。在中台的扩展阶段，阿里进一步扩大了中台的覆盖范围，将更多的公共资源和能力纳入中台。在中台的下沉阶段，阿里将中台的职能下沉到各个业务线中去，让业务线更直接地对客户需求和市场变化做出响应。

阿里的去中台化战略体现了平台化的核心思想，即以用户为中心，提供灵活、高效、可扩展的服务。在这个过程中，平台的作用是提供基础设施和平台服务，帮助业务线更好地服务用户，而不是直接参与业务处理。同时，阿里的去中台化战略也突出了平台化的另一个重要方面，即平台的开放性。通过将中台的职能下沉到各个业务线中去，阿里让更多的内部和外部开发者能够利用平台的资源和能力，推动公司的创新和发展。

## 总结

总的来说，无论是阿里的中台战略，还是去中台化战略，都体现了平台化的核心思想，即以用户为中心，提供灵活、高效、可扩展的服务，并且保持平台的开放性，吸引更多的开发者参与。这两种策略都强调了平台化的关键：将公司的资源和能力集中起来，以更有效地满足用户需求和应对市场变化。

然而，阿里巴巴的去中台化战略也提醒我们，平台化并不是一个静态的过程，而是需要随着市场环境和公司战略的变化而不断调整的。公司需要根据自己的业务需求和市场环境，灵活地调整中台和业务线的关系，以实现最优的资源配置和业务效率。

而在这个过程中，最重要的是保持对平台化核心思想的坚持，即以用户为中心，提供灵活、高效、可扩展的服务，并且保持平台的开放性。只有这样，公司才能在激烈的市场竞争中保持领先，实现持续的发展。
