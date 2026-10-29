# 中国恐怖怪谈模拟器 - 编码规范与文件命名指南

## 1. 项目架构概览

```
中国恐怖怪谈模拟器/
├── index.html                    # 入口页面
├── .gitignore                    # Git忽略配置
├── package.json                  # 项目配置与依赖管理
├── .editorconfig                 # 编辑器配置
├── .eslintrc.json                # ESLint配置
├── .stylelintrc.json             # Stylelint配置
├── src/
│   ├── js/
│   │   ├── core/                 # 核心引擎模块
│   │   ├── systems/              # 游戏系统模块
│   │   ├── data/                 # 游戏数据模块
│   │   │   ├── stories/          # 剧情数据（按章节）
│   │   │   └── ghost-events/     # 怪谈事件数据（按类别）
│   │   ├── ui/                   # UI组件模块
│   │   └── app.js                # 应用入口
│   ├── css/
│   │   ├── screens/              # 各屏幕样式
│   │   └── themes/               # 主题样式
│   └── assets/
│       ├── audio/                # 音频资源
│       │   ├── bgm/              # 背景音乐
│       │   ├── sfx/              # 音效
│       │   └── ambient/          # 环境音
│       ├── images/               # 图片资源
│       │   ├── backgrounds/      # 背景图
│       │   ├── portraits/        # 角色肖像
│       │   ├── ui/               # UI图片
│       │   └── effects/          # 特效图
│       └── fonts/                # 字体文件
└── docs/                         # 文档目录
```

## 2. 文件命名规范

### 2.1 JavaScript 文件
- **核心模块**: `kebab-case.js`（如 `event-bus.js`, `error-handler.js`）
- **系统模块**: `kebab-case.js`（如 `ghost-event.js`, `ending-archive.js`）
- **数据模块**: `kebab-case.js`（如 `urban-legends.js`, `knowledge-base.js`）
- **章节文件**: `chapter-NN.js`（如 `chapter-01.js`, `chapter-02.js`）

### 2.2 CSS 文件
- **全局样式**: `kebab-case.css`（如 `main.css`, `horror-effects.css`）
- **屏幕样式**: `screens/kebab-case.css`（如 `loading.css`, `main-menu.css`）
- **主题样式**: `themes/kebab-case.css`（如 `dark-horror.css`）

### 2.3 资源文件
- **音频**: `snake_case.mp3`（如 `main_horror_theme.mp3`, `ghost_trigger.mp3`）
- **图片**: `snake_case.png`（如 `old_building_bg.png`）
- **字体**: `FontName-Weight.format`（如 `NotoSerifSC-Regular.woff2`）

### 2.4 数据ID命名
- **身份ID**: `snake_case`（如 `night_watchman`, `college_student`）
- **场景ID**: `snake_case`（如 `old_building`, `red_room`）
- **剧情节点ID**: `{identity}_ch{N}_{NN}`（如 `watchman_ch1_01`）
- **怪谈事件ID**: `snake_case`（如 `elevator_game`, `paper_people`）
- **结局ID**: `snake_case`（如 `sanity_death`, `hidden_identity`）
- **成就ID**: `snake_case`（如 `first_encounter`, `ghost_master`）
- **知识条目ID**: `kb_{category}_{name}`（如 `kb_folklore_fengshui`）

## 3. JavaScript 编码规范

### 3.1 模块模式
所有JS模块采用IIFE + 全局命名空间模式：
```javascript
var GT = window.GT || {};

GT.ModuleName = (function() {
    var _privateVar = null;

    function _privateMethod() {}

    function publicMethod() {}

    return {
        publicMethod: publicMethod
    };
})();
```

### 3.2 命名约定
- **全局命名空间**: `GT`（GuaiTan缩写）
- **模块名**: `PascalCase`（如 `AudioSystem`, `GhostEventSystem`）
- **公共方法**: `camelCase`（如 `startStory`, `triggerEvent`）
- **私有方法/变量**: `_camelCase`（如 `_processNode`, `_activeAnimations`）
- **常量**: `UPPER_SNAKE_CASE`（如 `MAX_SAVES`, `ICEBERG_LAYERS`）
- **数据对象**: `PascalCase + Data`（如 `IdentityData`, `EndingData`）

### 3.3 代码风格
- 缩进: 4个空格
- 引号: 单引号
- 分号: 必须使用
- 行宽: 建议120字符以内
- 空行: 函数之间1个空行，逻辑段落之间1个空行
- 不添加注释（代码应自解释）

### 3.4 事件命名
事件采用 `模块:动作` 格式：
- `state:sanity-changed`
- `ghost-event:triggered`
- `narrative:layer-changed`
- `achievement:unlocked`
- `collection:ghost-collected`

## 4. CSS 编码规范

### 4.1 CSS变量
使用CSS自定义属性管理主题色和间距：
```css
:root {
    --color-accent: #8b0000;
    --color-accent-light: #cc2222;
    --transition-normal: 0.3s ease;
    --radius-small: 4px;
}
```

### 4.2 类名规范
- **布局类**: `kebab-case`（如 `game-header`, `status-bar`）
- **状态类**: `kebab-case`（如 `active`, `selected`, `locked`, `unlocked`）
- **特效类**: `kebab-case`（如 `horror-flash`, `screen-shake`）
- **屏幕类**: `#snake-case`（如 `#loading-screen`, `#game-screen`）

### 4.3 样式组织
每个CSS文件按以下顺序组织：
1. 布局（display, position, width, height）
2. 间距（margin, padding）
3. 排版（font, color, text-align）
4. 视觉（background, border, box-shadow）
5. 动画（transition, animation）

## 5. 数据结构规范

### 5.1 身份数据结构
```javascript
{
    id: 'snake_case',
    name: '显示名称',
    title: '称号',
    icon: 'emoji',
    category: '分类',
    baseStats: { courage: N, perception: N, luck: N },
    background: '背景故事文本（不少于200字）',
    storyHint: '专属剧情提示',
    differences: {},
    startScene: 'scene_id',
    startNode: 'node_id'
}
```

### 5.2 剧情节点结构
```javascript
{
    id: 'node_id',
    chapter: N,
    scene: 'scene_id',
    speaker: '说话者',
    text: '主要文本（不少于400字）',
    identityText: { identity_id: '身份差分文本' },
    layer: 'iceberg_layer',
    next: 'next_node_id',
    choices: [{ text, next, effects, identityText, isIdentitySpecific }],
    ghostEvent: 'event_id',
    ending: 'ending_id',
    effects: {},
    horrorEffect: 'effect_name',
    sfx: 'sfx_id',
    bgm: 'bgm_id',
    ambient: 'ambient_id'
}
```

### 5.3 怪谈事件结构
```javascript
{
    id: 'event_id',
    name: '事件名称',
    icon: 'emoji',
    category: 'category_id',
    description: '事件描述',
    backgroundInfo: '背景资料',
    relatedCases: '相关案件链接',
    multiPerspective: '多视角叙事文本',
    fearChange: N,
    sanityChange: N,
    choices: [{ text, effects }]
}
```

### 5.4 结局结构
```javascript
{
    id: 'ending_id',
    name: '结局名称',
    icon: 'emoji',
    type: 'short_bad|short_neutral|long_bad|long_neutral|long_good|hidden|true',
    description: '结局描述',
    unlockHint: '解锁提示',
    condition: '达成条件说明',
    isShortEnding: boolean,
    bgm: 'bgm_id'
}
```

## 6. 模块接口定义

### 6.1 核心模块接口
| 模块 | 公共方法 | 说明 |
|------|---------|------|
| GT.Engine | init, switchScreen, startGame, updateScene, updateStatus | 游戏引擎主控 |
| GT.State | get, set, update, increment, checkCondition, applyEffects, modifySanity, modifyFear | 状态管理 |
| GT.Storage | save, load, deleteSave, autoSave, saveSetting, loadSetting | 存档管理 |
| GT.Loader | registerResource, registerBatch, loadAll, get | 资源加载 |
| GT.EventBus | on, once, off, emit | 事件总线 |
| GT.Logger | debug, info, warn, error, setLevel | 日志系统 |
| GT.ErrorHandler | init, handleError, tryCatch, wrapAsync, onError | 错误处理 |

### 6.2 系统模块接口
| 模块 | 公共方法 | 说明 |
|------|---------|------|
| GT.AudioSystem | init, playBGM, stopBGM, playSFX, playAmbient, play3DSound | 3D空间音效 |
| GT.AnimationSystem | init, update, animate, triggerEffect, fadeIn, fadeOut, shake | 60fps动画特效 |
| GT.NarrativeSystem | getLayer, setLayer, descendLayer, addClue, hasClue | 冰山图叙事引擎 |
| GT.ProtagonistSystem | showCreateScreen, confirmCreation, showInfo | 主角系统 |
| GT.IdentitySystem | showSelectScreen, confirmSelection, getIdentityDifferences | 身份系统 |
| GT.StorySystem | init, startStory, advance, showChoices, resumeFromNode | 剧情系统 |
| GT.GhostEventSystem | init, checkAndTrigger, triggerEvent, getEventById | 怪谈事件系统 |
| GT.EndingSystem | triggerEnding, getUnlockedEndings, isEndingUnlocked, getEndingsByType | 结局系统 |
| GT.CollectionSystem | init, collectGhost, showScreen, getCollectedCount | 怪谈收集图鉴 |
| GT.AchievementSystem | init, unlockAchievement, showScreen, checkXxxAchievements | 成就解锁系统 |
| GT.EndingArchiveSystem | init, showScreen | 结局收录系统 |
| GT.KnowledgeSystem | init, showScreen, collectKnowledge | 怪谈知识收录 |

## 7. 脚本加载顺序

HTML中脚本必须按依赖顺序加载：
1. `core/logger.js` - 日志（无依赖）
2. `core/error-handler.js` - 错误处理（依赖Logger）
3. `core/event-bus.js` - 事件总线（依赖Logger）
4. `core/state.js` - 状态管理（依赖Logger, EventBus）
5. `core/storage.js` - 存档管理（依赖State, Logger）
6. `core/loader.js` - 资源加载（无系统依赖）
7. `core/engine.js` - 游戏引擎（依赖所有核心模块）
8. `data/*` - 数据模块（无系统依赖）
9. `systems/*` - 系统模块（依赖核心模块和数据）
10. `ui/*` - UI组件（依赖核心和系统模块）
11. `app.js` - 应用入口（依赖所有模块）

## 8. 扩展指南

### 8.1 添加新身份
1. 在 `src/js/data/identities.js` 中添加身份数据对象
2. 在 `src/js/data/stories/chapter-XX.js` 中添加专属剧情节点
3. 在 `src/js/data/scenes.js` 中添加专属场景（如需要）

### 8.2 添加新怪谈事件
1. 在 `src/js/data/ghost-events/` 对应类别文件中添加事件数据
2. 确保包含 `multiPerspective` 多视角叙事字段
3. 在 `src/js/data/knowledge-base.js` 中添加关联知识条目

### 8.3 添加新结局
1. 在 `src/js/data/endings.js` 中添加结局数据
2. 在剧情节点中通过 `ending` 字段或选项的 `ending` 字段触发
3. 短线结局需设置 `isShortEnding: true`

### 8.4 添加新成就
1. 在 `src/js/data/achievements.js` 中添加成就数据
2. 在 `src/js/systems/achievement.js` 中添加对应的检查方法
3. 在合适的事件回调中调用检查方法
