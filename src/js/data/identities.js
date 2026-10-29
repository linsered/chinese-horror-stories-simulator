var GT = window.GT || {};

GT.IdentityData = {
    night_watchman: {
        id: 'night_watchman',
        name: '夜班保安',
        title: '守夜人',
        icon: '🔦',
        category: '职场',
        baseStats: { courage: 7, perception: 6, luck: 4 },
        background: '你是一名夜班保安，负责看守一栋建于上世纪八十年代的老旧商业大楼。每个深夜，你独自巡逻在空旷的走廊中，手电筒的光束划过斑驳的墙壁，映出岁月的痕迹。同事们都说这栋楼不太干净，三楼的走廊深夜总有脚步声，地下室的灯总是莫名其妙地熄灭。你本不信这些，直到那个雨夜，你在监控画面中看到了不该出现的东西......',
        storyHint: '你的夜班经历让你对黑暗中的异常有着敏锐的直觉，但也让你更容易注意到不该看到的东西。',
        differences: {
            nightVision: true,
            buildingKnowledge: true
        },
        startScene: 'old_building'
    },
    college_student: {
        id: 'college_student',
        name: '大学生',
        title: '求知者',
        icon: '📚',
        category: '校园',
        baseStats: { courage: 4, perception: 7, luck: 6 },
        background: '你是一名大三学生，主修心理学。最近你的室友开始频繁做噩梦，说梦话时总是念叨着同一个地址。出于好奇，你开始调查这个地址，发现它指向城郊一座废弃的研究所。你的学术背景让你习惯于用理性分析一切，但随着调查的深入，你发现有些事情远远超出了教科书上的解释......',
        storyHint: '你的学术训练让你善于分析和推理，但面对真正的未知时，理性可能是你最大的枷锁。',
        differences: {
            researchAbility: true,
            rationalThinking: true
        },
        startScene: 'university_dorm'
    },
    delivery_rider: {
        id: 'delivery_rider',
        name: '外卖骑手',
        title: '夜行者',
        icon: '🏍️',
        category: '职场',
        baseStats: { courage: 6, perception: 5, luck: 7 },
        background: '你是一名外卖骑手，深夜的订单总是格外多。这座城市的每一条小巷、每一栋老楼你都烂熟于心。但最近，你接到了一些奇怪的订单——地址指向那些早已拆迁的区域，收件人的名字你在本地新闻上见过，而备注栏里写着让人不安的话语。你本可以拒绝这些订单，但高额的小费和某种说不清的好奇心驱使你接下了它们......',
        storyHint: '你熟悉这座城市的每一个角落，但有些地方，连导航都无法找到。',
        differences: {
            cityKnowledge: true,
            mobility: true
        },
        startScene: 'city_street_night'
    },
    journalist: {
        id: 'journalist',
        name: '调查记者',
        title: '真相追寻者',
        icon: '📰',
        category: '职场',
        baseStats: { courage: 6, perception: 8, luck: 5 },
        background: '你是一名调查记者，专注于报道社会边缘事件。最近你收到一封匿名信，信中附有几张模糊的照片和一个坐标。照片上是一座废弃的村庄，据说全村人在一夜之间消失，官方记录只写了"集体搬迁"。你的职业直觉告诉你这背后有重大隐情，但当你深入调查时，发现所有知情者都讳莫如深，仿佛有什么力量在阻止真相被揭开......',
        storyHint: '你追寻真相的本能是你最大的武器，但有些真相一旦揭开，便再也无法假装不知道。',
        differences: {
            investigationSkill: true,
            interviewAbility: true
        },
        startScene: 'newspaper_office'
    },
    doctor: {
        id: 'doctor',
        name: '急诊科医生',
        title: '生死守望者',
        icon: '🏥',
        category: '职场',
        baseStats: { courage: 7, perception: 6, luck: 5 },
        background: '你是一名急诊科医生，见惯了生死。但最近急诊室来了几个症状完全相同的病人——他们都说自己在同一栋楼里看到了"不该看的东西"，随后便陷入了持续性的惊恐状态。更诡异的是，这些病人的病历记录中，都提到了同一个日期和同一个名字。你试图从医学角度解释这一切，但查遍文献也找不到任何类似的病例......',
        storyHint: '你的医学知识让你能理解身体的极限，但灵魂的创伤，不是任何药物能治愈的。',
        differences: {
            medicalKnowledge: true,
            calmUnderPressure: true
        },
        startScene: 'hospital_er'
    },
    streamer: {
        id: 'streamer',
        name: '探险主播',
        title: '流量猎手',
        icon: '📱',
        category: '网络',
        baseStats: { courage: 5, perception: 5, luck: 6 },
        background: '你是一名探险类主播，靠直播探访废弃建筑和灵异地点为生。你的粉丝一直在催你挑战传说中的"红衣女孩楼"——那是一栋因连续跳楼事件而被封禁的住宅楼。为了流量，你决定在深夜独自前往直播。当你推开那扇锈迹斑斑的铁门时，直播间的观众数突然暴涨，弹幕里全是同一句话："她就在你身后"......',
        storyHint: '镜头记录下的一切可能是真实的，但直播的镜头，也可能成为某种东西注视你的窗口。',
        differences: {
            broadcastAbility: true,
            audienceInteraction: true
        },
        startScene: 'abandoned_building'
    },
    taxi_driver: {
        id: 'taxi_driver',
        name: '出租车司机',
        title: '夜路客',
        icon: '🚕',
        category: '职场',
        baseStats: { courage: 5, perception: 7, luck: 6 },
        background: '你是一名夜班出租车司机，在这座城市跑了十五年夜车。你载过形形色色的乘客，也听过无数诡异的故事。但最近，你连续三次在后视镜中看到同一个乘客——一个穿白裙的女人，总是在凌晨三点出现在同一条路上。每次你想看清她的脸，她就消失了。老司机们说，这是"被缠上了"，你不确定这是迷信还是警告......',
        storyHint: '你在夜路上见过太多，但有些乘客，上车后就不想下车——或者说，下不了车。',
        differences: {
            nightDriving: true,
            passengerStories: true
        },
        startScene: 'taxi_night'
    },
    archaeologist: {
        id: 'archaeologist',
        name: '考古研究生',
        title: '遗迹探索者',
        icon: '🏺',
        category: '学术',
        baseStats: { courage: 5, perception: 8, luck: 4 },
        background: '你是一名考古学研究生，跟随导师参与一处新发现的古墓发掘。这座古墓的形制与已知的任何朝代都不相同，墓中的壁画描绘着令人不安的祭祀场景。更奇怪的是，自从发掘开始以来，工地上的工人接连出现精神恍惚的症状，都说自己在夜间听到了墓中传来的低语。导师禁止你独自进入墓室，但你的好奇心已经无法遏制......',
        storyHint: '你对古代文明的理解让你能解读常人看不懂的符号，但有些知识，本应永远埋在地下。',
        differences: {
            ancientKnowledge: true,
            symbolDecoding: true
        },
        startScene: 'excavation_site'
    },
    programmer: {
        id: 'programmer',
        name: '程序员',
        title: '代码行者',
        icon: '💻',
        category: '职场',
        baseStats: { courage: 4, perception: 6, luck: 7 },
        background: '你是一名程序员，最近在维护一个老旧的政府系统时，发现了一段不该存在的代码。这段代码每72小时就会执行一次，向一个未知的服务器发送加密数据。你试图追踪数据流向，却发现目标IP地址指向一个早已注销的内部网络节点。更诡异的是，当你尝试删除这段代码时，它总会在下一次系统重启后自动恢复，仿佛有什么东西在守护着它......',
        storyHint: '你在数字世界中游刃有余，但有些代码不是人写的——至少，不是活人写的。',
        differences: {
            techSkill: true,
            dataAnalysis: true
        },
        startScene: 'office_night'
    },
    funeral_director: {
        id: 'funeral_director',
        name: '殡仪馆工作人员',
        title: '送行者',
        icon: '🕯️',
        category: '特殊',
        baseStats: { courage: 8, perception: 7, luck: 3 },
        background: '你在殡仪馆工作了三年，早已习惯了与死亡为伴。但最近，你注意到一些反常的现象——某些遗体在火化前夜会改变姿势，冷藏柜的温度会无故骤降，而最让你不安的是，新来的那位同事似乎对这一切毫不意外，甚至在你注意到之前就已经"处理"好了。你开始怀疑，殡仪馆里除了你，还有谁在"值班"......',
        storyHint: '你与死亡朝夕相处，早已无所畏惧。但有些死者，并不愿意被送走。',
        differences: {
            deathKnowledge: true,
            spiritResistance: true
        },
        startScene: 'funeral_home'
    },
    teacher: {
        id: 'teacher',
        name: '乡村教师',
        title: '留守者',
        icon: '🏫',
        category: '校园',
        baseStats: { courage: 5, perception: 6, luck: 5 },
        background: '你是一名支教老师，来到一个偏远的山村小学。村子里的孩子不多，但都异常安静和听话。你注意到教室角落有一张空课桌，每天都有人给它放上一支新铅笔。当你问起这是谁的座位时，孩子们都沉默了，只有一个女孩小声说："那是小红的位子，她还在这里上课。"但你查过学籍，这个班上没有叫小红的学生......',
        storyHint: '你习惯了教导孩子，但在这个村子里，有些"孩子"可能已经不是活人了。',
        differences: {
            childCommunication: true,
            villageSecrets: true
        },
        startScene: 'village_school'
    }
};
