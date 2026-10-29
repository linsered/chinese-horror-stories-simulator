# 中国恐怖怪谈模拟器

> 基于「网络冰山图」理论的沉浸式中文恐怖怪谈文字冒险网页游戏。
> 你所知道的，只是冰山一角。

[![Play](https://img.shields.io/badge/%E5%9C%A8%E7%BA%BF%E8%AF%95%E7%8E%A9-Play%20Now-8B0000?style=for-the-badge)](https://linsered.github.io/chinese-horror-stories-simulator/)

## 🎮 在线游玩

部署完成后，直接打开：

```
https://linsered.github.io/chinese-horror-stories-simulator/
```

> 纯前端静态网页游戏，无需下载安装，打开即玩。

## 简介

《中国恐怖怪谈模拟器》是一款以中国本土都市传说、网络怪谈与真实案件改编为素材的文字冒险（Visual Novel）游戏。玩家选择一个身份，在层层递进的怪谈事件中做出抉择，管理自己的**恐惧**与**理智**，逐步潜入冰山之下，最终揭开隐藏在怪谈背后的真相。

游戏采用「冰山图」叙事结构：水面之上是人人熟知的传说，水面之下则是层层深入的恐怖与真相。每一次游玩，都会在日常与怪谈之间随机穿插不同的事件。

## 核心特性

- **11 种身份**：夜班保安、大学生、外卖骑手、调查记者、急诊科医生、探险主播、出租车司机、考古研究生、程序员、殡仪馆工作人员、乡村教师。不同身份会触发专属剧情分支与开场。
- **主线 + 随机双轨叙事**：5 个章节的主线怪谈，配合大量随机怪谈事件与身份专属的日常剧情，事件之间有过场衔接，不会「遇到一个怪谈就结束」。
- **取材现实**：怪谈内容大量改编自中国网络怪谈、都市传说与真实案件，力求「一看就知道参照了什么」。
- **双数值系统**：恐惧值会自然攀升也会自然回落，达到上限会触发「恐惧过载」缓冲警告；理智崩溃与恐惧吞噬是两条不同的毁灭之路。
- **多种结局**：主线结局 + 短线结局 + 特殊结局，结局收录系统（Ending Archive）可长期收集。
- **剧情演出（Cinematic）**：黑边、暗角、角色立绘、屏震、闪光、故障风等电影化演出手法。
- **收集与成长**：怪谈图鉴、成就系统、怪谈知识库，跨局存档于本地。
- **存档 / 读档**：自动存档 + 手动多存档位。
- **纯前端**：零后端依赖，离线可用。

## 玩法说明

1. 主菜单选择「开始新游戏」。
2. 创建角色（姓名、性别），然后选择你的**身份** —— 身份决定你的能力、专属剧情与面对怪谈时的不同反应。
3. 阅读剧情文本，在关键节点做出选择：
   - 部分选项会标注「（这将走向短线结局：XXX）」。
   - 提高恐惧的选项可能把你推向「恐惧吞噬」结局，请谨慎。
4. 留意底部状态栏的**理智 / 恐惧 / 认知 / 时间**。
5. 撑过五个章节，或在一个个抉择中走向属于你的结局。

## 技术栈

- 原生 **HTML / CSS / JavaScript**（ES5 语法，无框架、无构建步骤）
- 模块化的 `GT.*` 引擎命名空间（core / data / systems / ui 分层）
- 本地 `localStorage` 存档与收集数据持久化
- 面向 GitHub Pages 的纯静态部署

## 本地运行

项目为纯静态站点，任选其一：

```bash
# 方式一：Python
python -m http.server 8080

# 方式二：Node（http-server）
npx http-server . -p 8080 -c-1
```

然后浏览器访问 `http://localhost:8080`。

> 也可以直接用 `npm run serve`（需先 `npm install`）。
> 建议用本地服务器打开，而非直接双击 `index.html`，以避免个别浏览器对本地文件的限制。

## 项目结构

```
chinese-horror-stories-simulator/
├── index.html                 # 游戏入口
├── src/
│   ├── css/                   # 样式：main / ui / scenes / animations / horror-effects / responsive / screens / themes
│   └── js/
│       ├── core/              # 引擎核心：engine / state / storage / loader / event-bus / logger / error-handler
│       ├── data/              # 数据：scenes / identities / stories(章节) / ghost-events(随机怪谈) / endings / achievements / knowledge-base
│       ├── systems/           # 系统：story / ghost-event / ending / achievement / collection / knowledge / cinematic ...
│       ├── ui/                # 界面：screens / components / typewriter / choices / modal
│       └── app.js             # 启动入口
├── docs/                      # 开发文档
├── package.json
└── README.md
```

## 免责声明

本游戏所有剧情、角色、事件均为文学创作，取材自公开流传的网络怪谈、都市传说与新闻报道并进行**虚构化改编**，不对应任何现实中的具体个人或组织。游戏中涉及暴力、死亡、心理恐怖等内容，**请未成年人及心理承受能力较弱者谨慎游玩**。

## 授权

[MIT](./LICENSE)
