var GT = window.GT || {};

GT.AchievementData = {
    first_encounter: {
        id: 'first_encounter',
        name: '初次遭遇',
        icon: '👻',
        description: '首次遭遇怪谈事件',
        hint: '与未知相遇',
        condition: '遭遇1次怪谈事件'
    },
    ghost_seeker: {
        id: 'ghost_seeker',
        name: '怪谈猎人',
        icon: '🔍',
        description: '遭遇5次怪谈事件',
        hint: '你开始主动寻找',
        condition: '遭遇5次怪谈事件'
    },
    ghost_hunter: {
        id: 'ghost_hunter',
        name: '灵异调查员',
        icon: '🔦',
        description: '遭遇10次怪谈事件',
        hint: '你已经是老手了',
        condition: '遭遇10次怪谈事件'
    },
    ghost_master: {
        id: 'ghost_master',
        name: '怪谈大师',
        icon: '👁️',
        description: '遭遇20次怪谈事件',
        hint: '你已经见怪不怪了',
        condition: '遭遇20次怪谈事件'
    },
    first_collection: {
        id: 'first_collection',
        name: '初次收录',
        icon: '📖',
        description: '首次收录怪谈到图鉴',
        hint: '知识就是力量',
        condition: '收录1个怪谈'
    },
    collector: {
        id: 'collector',
        name: '收藏家',
        icon: '📚',
        description: '收录5个怪谈到图鉴',
        hint: '你的收藏在增长',
        condition: '收录5个怪谈'
    },
    archivist: {
        id: 'archivist',
        name: '档案管理员',
        icon: '🗂️',
        description: '收录10个怪谈到图鉴',
        hint: '你正在建立自己的档案',
        condition: '收录10个怪谈'
    },
    encyclopedist: {
        id: 'encyclopedist',
        name: '百科全书',
        icon: '📕',
        description: '收录20个怪谈到图鉴',
        hint: '你的知识已经无所不包',
        condition: '收录20个怪谈'
    },
    surface_broken: {
        id: 'surface_broken',
        name: '冰山裂痕',
        icon: '🧊',
        description: '首次突破水面层',
        hint: '你看到了冰山之下的第一道裂缝',
        condition: '叙事深度到达浅水区'
    },
    truth_seeker: {
        id: 'truth_seeker',
        name: '真相追寻者',
        icon: '🔎',
        description: '叙事深度到达中层水域',
        hint: '真相开始浮出水面',
        condition: '叙事深度到达中层'
    },
    abyss_watcher: {
        id: 'abyss_watcher',
        name: '深渊守望者',
        icon: '🌊',
        description: '叙事深度到达深渊边缘',
        hint: '当你凝视深渊时，深渊也在凝视你',
        condition: '叙事深度到达深层'
    },
    beyond_abyss: {
        id: 'beyond_abyss',
        name: '超越深渊',
        icon: '🕳️',
        description: '叙事深度到达无底深渊',
        hint: '你已经无法回头了',
        condition: '叙事深度到达最深层'
    },
    mind_fractured: {
        id: 'mind_fractured',
        name: '精神裂痕',
        icon: '💔',
        description: '理智值降至50以下',
        hint: '你的精神开始出现裂痕',
        condition: '理智值低于50'
    },
    madness_door: {
        id: 'madness_door',
        name: '疯狂之门',
        icon: '🚪',
        description: '理智值降至25以下',
        hint: '你已经站在疯狂的门槛上',
        condition: '理智值低于25'
    },
    abyss_gaze: {
        id: 'abyss_gaze',
        name: '深渊凝视',
        icon: '👁️',
        description: '理智值降至10以下',
        hint: '你看到了不该看的东西',
        condition: '理智值低于10'
    },
    fear_rising: {
        id: 'fear_rising',
        name: '恐惧上升',
        icon: '📈',
        description: '恐惧值达到50以上',
        hint: '恐惧正在侵蚀你的内心',
        condition: '恐惧值超过50'
    },
    terror_grip: {
        id: 'terror_grip',
        name: '恐怖之握',
        icon: '🫳',
        description: '恐惧值达到75以上',
        hint: '恐惧已经控制了你',
        condition: '恐惧值超过75'
    },
    paralyzed: {
        id: 'paralyzed',
        name: '瘫软无力',
        icon: '😰',
        description: '恐惧值达到90以上',
        hint: '你已经无法动弹',
        condition: '恐惧值超过90'
    },
    first_ending: {
        id: 'first_ending',
        name: '第一个结局',
        icon: '📜',
        description: '首次达成结局',
        hint: '这只是开始',
        condition: '达成1个结局'
    },
    ending_seeker: {
        id: 'ending_seeker',
        name: '结局探索者',
        icon: '🗺️',
        description: '达成5个不同结局',
        hint: '每条路都有不同的终点',
        condition: '达成5个结局'
    },
    ending_collector: {
        id: 'ending_collector',
        name: '结局收藏家',
        icon: '🎭',
        description: '达成10个不同结局',
        hint: '你已经走过了许多条路',
        condition: '达成10个结局'
    },
    ending_master: {
        id: 'ending_master',
        name: '结局大师',
        icon: '👑',
        description: '达成20个不同结局',
        hint: '你已经穷尽了所有可能',
        condition: '达成20个结局'
    },
    hidden_truth: {
        id: 'hidden_truth',
        name: '隐藏的真相',
        icon: '🔮',
        description: '达成隐藏结局',
        hint: '有些真相藏在最深处',
        condition: '达成隐藏结局'
    },
    true_ending: {
        id: 'true_ending',
        name: '冰山之下',
        icon: '🏔️',
        description: '达成真结局',
        hint: '所有的路最终都通向这里',
        condition: '达成真结局'
    },
    social_animal: {
        id: 'social_animal',
        name: '社畜本畜',
        icon: '💼',
        description: '选择保安或程序员身份完成游戏',
        hint: '打工人的怨气比鬼还重',
        condition: '以社畜身份通关'
    },
    food_delivery_master: {
        id: 'food_delivery_master',
        name: '您的订单已送达',
        icon: '🛵',
        description: '以外卖骑手身份完成游戏',
        hint: '阴间也挡不住我送单',
        condition: '以外卖骑手身份通关'
    },
    night_rider: {
        id: 'night_rider',
        name: '深夜老司机',
        icon: '🚕',
        description: '以出租车司机身份完成游戏',
        hint: '什么乘客我没拉过',
        condition: '以出租车司机身份通关'
    },
    knowledge_is_power: {
        id: 'knowledge_is_power',
        name: '知识就是力量',
        icon: '🧠',
        description: '收录30个以上怪谈知识条目',
        hint: '你已经可以出书了',
        condition: '收录30个知识条目'
    },
    walking_encyclopedia: {
        id: 'walking_encyclopedia',
        name: '行走的百度百科',
        icon: '📖',
        description: '收录全部怪谈知识条目',
        hint: '你比搜索引擎还全',
        condition: '收录所有知识条目'
    },
    fear_overload_survivor: {
        id: 'fear_overload_survivor',
        name: '恐惧过载幸存者',
        icon: '😱',
        description: '触发恐惧警告后继续游戏',
        hint: '你差点被恐惧吞噬',
        condition: '触发恐惧警告后存活'
    },
    triple_overload: {
        id: 'triple_overload',
        name: '三次元恐惧',
        icon: '💀',
        description: '触发3次恐惧警告仍未被吞噬',
        hint: '你是怎么活下来的？',
        condition: '3次恐惧过载后存活'
    },
    brave_heart: {
        id: 'brave_heart',
        name: '勇者无惧',
        icon: '🦁',
        description: '连续5次选择勇敢选项',
        hint: '莽夫还是勇士？',
        condition: '连续5次勇敢选择'
    },
    always_running: {
        id: 'always_running',
        name: '逃跑大师',
        icon: '🏃',
        description: '连续5次选择回避选项',
        hint: '三十六计走为上',
        condition: '连续5次回避选择'
    },
    identity_crisis: {
        id: 'identity_crisis',
        name: '身份危机',
        icon: '🎭',
        description: '以所有11种身份各完成一次游戏',
        hint: '你到底是谁？',
        condition: '以所有身份通关'
    },
    midnight_oil: {
        id: 'midnight_oil',
        name: '修仙党',
        icon: '🦉',
        description: '在凌晨2点到4点之间触发3次怪谈事件',
        hint: '这个时间段不太对劲...',
        condition: '凌晨时段触发3次怪谈'
    },
    mirror_mirror: {
        id: 'mirror_mirror',
        name: '魔镜魔镜告诉我',
        icon: '🪞',
        description: '触发所有与镜子相关的怪谈事件',
        hint: '你确定那是你的倒影？',
        condition: '触发所有镜子怪谈'
    },
    cant_stop_wont_stop: {
        id: 'cant_stop_wont_stop',
        name: '停不下来',
        icon: '🔄',
        description: '连续游玩5个章节不中断',
        hint: '你已经停不下来了',
        condition: '连续完成5章'
    },
    speedrunner: {
        id: 'speedrunner',
        name: '速通选手',
        icon: '⚡',
        description: '在30分钟内完成游戏',
        hint: '你是在玩游戏还是被游戏玩？',
        condition: '30分钟内通关'
    },
    completionist: {
        id: 'completionist',
        name: '全收集强迫症',
        icon: '💯',
        description: '收集所有成就',
        hint: '你真的要全部收集吗？',
        condition: '解锁所有其他成就'
    },
    see_you_again: {
        id: 'see_you_again',
        name: '又见面了',
        icon: '👋',
        description: '开始第2次游戏',
        hint: '你确定还要来一次？',
        condition: '开始2次游戏'
    },
    veteran: {
        id: 'veteran',
        name: '老玩家了',
        icon: '🎮',
        description: '开始第5次游戏',
        hint: '你是不是上瘾了？',
        condition: '开始5次游戏'
    },
    not_afraid: {
        id: 'not_afraid',
        name: '我不怕！',
        icon: '😤',
        description: '恐惧值从未超过20',
        hint: '你真的不怕吗？',
        condition: '通关时恐惧值低于20'
    },
    full_fear: {
        id: 'full_fear',
        name: '我全都要（指恐惧）',
        icon: '😈',
        description: '达成恐惧吞噬结局',
        hint: '有些路是你自己选的',
        condition: '达成恐惧吞噬结局'
    }
};
