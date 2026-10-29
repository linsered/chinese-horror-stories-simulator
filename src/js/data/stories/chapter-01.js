﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿var GT = window.GT || {};

GT.ChapterData = {
    prologue_01: {
        id: "prologue_01",
        chapter: 0,
        scene: null,
        speaker: "",
        text: "你从黑暗中醒来，意识模糊，只记得自己是一个普通人。你的名字......你的名字是什么来着？",
        layer: "surface",
        next: "prologue_02"
    },
    prologue_02: {
        id: "prologue_02",
        chapter: 0,
        scene: null,
        speaker: "",
        text: "记忆像碎片一样缓缓拼合。你记得自己选择了某个身份，开始了某段不该开始的旅程。但具体是什么，你想不起来了。你只知道，从今夜起，一切都将不同。",
        layer: "surface",
        next: "prologue_03"
    },
    prologue_03: {
        id: "prologue_03",
        chapter: 0,
        scene: null,
        speaker: "",
        text: "黑暗中传来一个声音，像是从很远的地方飘来，又像是在你耳边低语：「你所看到的，只是冰山一角。」你感到一阵寒意从脊椎升起，但同时也有一股说不清的好奇心在驱使你向前。",
        layer: "surface",
        horrorEffect: "whisper",
        next: "prologue_04"
    },
    prologue_04: {
        id: "prologue_04",
        chapter: 0,
        scene: null,
        speaker: "",
        text: "你睁开眼睛，发现自己身处一片漆黑之中。远处有一点微弱的光，像是黑暗中唯一的出口。你可以选择走向那道光，也可以选择留在原地等待。",
        layer: "surface",
        choices: [
            {
                text: "走向那道光",
                next: "prologue_05",
                effects: {
                    courage: {
                        add: 1
                    }
                },
                sanityChange: -1,
                fearChange: 2
            },
            {
                text: "留在原地等待",
                next: "prologue_05_wait",
                effects: {
                    perception: {
                        add: 1
                    }
                },
                sanityChange: -1,
                fearChange: 3 },
            {
                text: "闭上眼，拒绝这一切（这将走向短线结局：半途而废）",
                ending: "give_up_early",
                sanityChange: -2,
                fearChange: 3,
                isShortEnding: true
            }
        ]
    },
    prologue_05: {
        id: "prologue_05",
        chapter: 0,
        scene: null,
        speaker: "",
        text: "你迈步走向那道光。每走一步，周围的黑暗就退散一分。你的心跳加速，不是因为恐惧，而是因为一种莫名的期待。光越来越近，你隐约看到了光那边的景象——那是一个你从未见过，却又似曾相识的世界。",
        layer: "surface",
        next: "prologue_identity_bridge"
    },
    prologue_05_wait: {
        id: "prologue_05_wait",
        chapter: 0,
        scene: null,
        speaker: "",
        text: "你选择留在原地。黑暗中，你听到了更多声音——脚步声、低语声、还有某种不属于这个世界的呼吸声。它们在靠近，又像是在等待。你意识到，等待并不能让它们消失。你必须做出选择，而你的身份，将决定你面对的是什么。",
        layer: "surface",
        sanityChange: -1,
        fearChange: 1,
        next: "prologue_identity_bridge"
    },
    prologue_identity_bridge: {
        id: "prologue_identity_bridge",
        chapter: 0,
        scene: null,
        speaker: "",
        text: "你的记忆逐渐清晰。你想起自己是谁，想起自己在这个世界中的身份。那些恐怖的事情，从一开始就与你的身份息息相关......",
        layer: "surface",
        next: "_identity_start"
    },
    ch1_intro: {
        id: "ch1_intro",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "你站在深夜的街头，城市的灯火在远处闪烁。一切看起来都很正常，但你知道，从这一刻起，你将踏入一个常人无法触及的世界。你不知道为什么这些事情会找到你——也许是因为你的身份让你更容易接触到那些隐藏在日常之下的东西，也许是因为你天生就拥有某种「看见」的能力。无论如何，你已经无法回头了。手机突然震动，屏幕上弹出一条没有来源的消息：「欢迎来到真实的世界。第一个故事，就在你身边。它和你有关。」",
        layer: "surface",
        bgm: "main_horror_theme",
        ambient: "night_city",
        fearChange: 2,
        next: "ch1_01"
    },
    ch1_01: {
        id: "ch1_01",
        chapter: 1,
        scene: "old_building",
        speaker: "",
        text: "【怪谈一：午夜电梯】你走进一栋老旧写字楼，准备搭乘电梯上楼。这栋楼你很熟悉——也许你在这里上班，也许你经常来这里，也许你只是路过。但今晚不一样。电梯门缓缓关上，你按下楼层按钮，电梯开始上升。但数字跳过了你按的楼层，继续往上——11、12、13......这栋楼只有10层。显示屏上的数字还在增加：14、15、16......你感到电梯在加速，而楼层按钮全部失灵了。你突然想起，之前有人跟你提过这栋楼的电梯「不太对」，但你当时没放在心上。现在，你不得不认真面对了。",
        layer: "surface",
        fearChange: 2,
        
        cinematic: [{"type":"flash","color":"white"},{"type":"letterbox","active":true},{"type":"vignette","active":true},{"type":"character","id":"elevator","text":"?","position":"center","enter":"glitch","state":"dimmed","float":true}],
        knowledgeEntry: ["kb_midnight_elevator","kb_cctv_anomaly"],
        identityIntro: {
            night_watchman: "今晚轮到你在这栋写字楼值夜班。你像往常一样巡逻完各楼层，准备搭电梯回值班室休息。",
            college_student: "你在这栋写字楼里做兼职，今晚加班到很晚，准备搭电梯下楼回家。",
            delivery_rider: "你接了一个这栋楼的送餐订单，送完餐准备搭电梯下楼继续接单。",
            journalist: "你追踪一条线索来到这栋写字楼，采访完住户后准备离开。",
            doctor: "你刚结束在这栋楼里的私人诊所会诊，准备搭电梯下楼。",
            streamer: "你在这栋楼里做了一场探险直播，结束后准备搭电梯下楼。",
            taxi_driver: "你送了一位乘客到这栋楼下，顺便上楼借用洗手间，现在准备下楼。",
            archaeologist: "你在这栋楼的档案室查阅旧资料，忙到深夜准备离开。",
            programmer: "你在这栋楼的科技公司加班到深夜，终于可以下班了。",
            funeral_director: "这栋楼里有人去世，你来协调遗体转运事宜，办完手续准备离开。",
            teacher: "你在这栋楼的培训机构上完晚课，准备搭电梯下楼回家。"
        },
        choices: [
            {
                text: "猛按所有楼层按钮",
                next: "ch1_01a",
                sanityChange: -1,
                fearChange: 1,
                effects: {
                    courage: {
                        add: 1
                    }
                }
            },
            {
                text: "按下紧急呼叫按钮",
                next: "ch1_01b",
                sanityChange: -1,
                fearChange: 3 },
            {
                text: "用手机录像记录",
                next: "ch1_01c",
                sanityChange: -1,
                fearChange: 4,
                effects: {
                    perception: {
                        add: 1
                    }
                }
            },
            {
                text: "检查电梯检修证——你干过这行，知道怎么看",
                next: "ch1_01d",
                requiredIdentity: "night_watchman",
                isIdentitySpecific: true,
                sanityChange: -1,
                fearChange: 3 }
        ]
    },
    ch1_01a: {
        id: "ch1_01a",
        chapter: 1,
        scene: "old_building",
        speaker: "",
        text: "你疯狂地按着所有按钮，但没有任何反应。电梯继续加速上升，数字已经跳到了24。突然，电梯猛地停住了，惯性让你差点摔倒。门缓缓打开——外面是一条走廊，但走廊的墙壁上贴满了旧报纸，每张报纸的日期都是同一天：1994年3月15日。走廊尽头站着一个穿灰色工装的人，背对着你，一动不动。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "staticNoise",
        next: "ch1_01_resolve"
    ,
        cinematic: [{"type":"shake","intensity":5,"duration":400},{"type":"effect","name":"ghostAppear"}],
    },
    ch1_01b: {
        id: "ch1_01b",
        chapter: 1,
        scene: "old_building",
        speaker: "对讲机",
        text: "紧急呼叫按钮按下去后，对讲机里传来一阵刺耳的电流声。然后，一个声音响起，但不是物业的回复——那是一个女人的声音，轻柔而遥远：「你到了吗？我等了好久......」信号中断了。电梯突然减速，停在了第4层。门打开了，外面是正常的走廊。但你的手机显示，你在电梯里待了47分钟，而你感觉只过了不到两分钟。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        next: "ch1_01_resolve"
    },
    ch1_01c: {
        id: "ch1_01c",
        chapter: 1,
        scene: "old_building",
        speaker: "",
        text: "你掏出手机开始录像。镜头里，电梯楼层显示屏上的数字在疯狂跳动。但当你回看录像时，发现画面里显示屏始终停在4楼，而你的手在发抖。更诡异的是，录像的背景音里有一个你当时没听到的声音——一个女人的笑声，从电梯顶部传来。电梯最终停在了4楼，门正常打开了。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        next: "ch1_01_resolve"
    },
    ch1_01d: {
        id: "ch1_01d",
        chapter: 1,
        scene: "old_building",
        speaker: "",
        text: "你的职业习惯让你注意到了电梯角落的检修证。你凑近一看——下次检修日期是1994年4月1日。你看了看今天的日期，再看了看检修证上标注的电梯编号：B-004。你记得这栋楼的电梯编号是A系列。这不是这栋楼的电梯。你猛地抬头，发现电梯内的装潢变了——墙壁从米白色变成了暗红色，天花板上多了一个你从未见过的监控摄像头，镜头正对着你。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "glitch",
        next: "ch1_01_resolve"
    },
    ch1_01_resolve: {
        id: "ch1_01_resolve",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "你从那栋楼里走了出来，深呼吸了几次。不管刚才发生了什么，你活下来了。但你的手机上多了一条未读消息，来自一个不存在的号码：「第一个故事结束了。但故事不会停止。下一个，已经在等你了。」你抬头看向夜空，月亮被乌云遮住了一半。这座城市，远比你想象的要暗。",
        layer: "surface",
        sanityChange: -1,
        fearChange: 2,
        next: "ch1_01_resolve_after"
    },
    ch1_02: {
        id: "ch1_02",
        chapter: 1,
        scene: "apartment_night",
        speaker: "",
        text: "【怪谈二：午夜梦语】凌晨两点，你被一阵低语声惊醒。声音来自隔壁——有人在说梦话，反复念叨着同一个地址：「城郊工业区17号......17号......17号......「声音机械而重复，像一段被卡住的录音。你翻了个身想继续睡，但那声音突然变了——它开始念你的名字。",
        layer: "surface",
        fearChange: 2,
        
        cinematic: [{"type":"tint","color":"blue","active":true},{"type":"character","id":"dreamer","text":"梦","position":"center","enter":"fadeIn","float":true}],
        knowledgeEntry: ["kb_sleep_paralysis","kb_dream_message"],
        identityIntro: {
            night_watchman: "今晚你在值班室值夜班，隔壁是空着的储物间。",
            college_student: "你住在大学宿舍，隔壁是你的室友小王。",
            delivery_rider: "你住在城中村的出租屋，隔壁住着一个你从没见过的邻居。",
            journalist: "你住在单身公寓，隔壁是一个总是深夜才回来的住户。",
            doctor: "你刚下夜班回到医院宿舍，隔壁是另一位值班医生的房间。",
            streamer: "你直播结束回到出租屋，隔壁住着一个从不露面的邻居。",
            taxi_driver: "你收车回到出租屋，隔壁是一个白天从不出来的住户。",
            archaeologist: "你住在野外考察的临时宿舍，隔壁住着你的同事。",
            programmer: "你加班到凌晨才回到公寓，隔壁住着一个作息不规律的邻居。",
            funeral_director: "你值完夜班回到殡仪馆的员工宿舍，隔壁住着老陈。",
            teacher: "你住在学校的教师宿舍，隔壁是另一位老师。"
        },
        choices: [
            {
                text: "起身去查看",
                next: "ch1_02a",
                sanityChange: -1,
                fearChange: 1,
                effects: {
                    courage: {
                        add: 1
                    }
                }
            },
            {
                text: "用枕头捂住耳朵",
                next: "ch1_02b",
                sanityChange: -1,
                fearChange: 3 },
            {
                text: "录下声音分析",
                next: "ch1_02c",
                sanityChange: -1,
                fearChange: 4,
                effects: {
                    perception: {
                        add: 1
                    }
                }
            },
            {
                text: "用心理学方法分析",
                next: "ch1_02d",
                requiredIdentity: "college_student",
                isIdentitySpecific: true,
                sanityChange: -1,
                fearChange: 3 }
        ]
    },
    ch1_02a: {
        id: "ch1_02a",
        chapter: 1,
        scene: "apartment_night",
        speaker: "",
        text: "你起身走到隔壁门前，犹豫了一下，推开了门。房间里，你的邻居坐在床上，双眼紧闭，嘴唇不停翕动。但当你走近时，你发现不对——他的嘴在动，但声音不是从他嘴里发出来的。声音来自墙壁。你把耳朵贴在墙上，听到了无数个声音在同时念叨那个地址，像是整栋楼的人都在做同一个梦。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "whisper",
        next: "ch1_02_resolve"
    },
    ch1_02b: {
        id: "ch1_02b",
        chapter: 1,
        scene: "apartment_night",
        speaker: "",
        text: "你用枕头捂住耳朵，试图隔绝那个声音。但声音似乎能穿透一切——它不再从隔壁传来，而是从你的枕头内部响起，像是有人把扬声器缝进了棉花里。你扔掉枕头，声音又回到了隔壁。你发现，那个声音一直在念叨的地址，就写在你的手背上——用你自己的笔迹。但你不记得自己写过。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        next: "ch1_02_resolve"
    },
    ch1_02c: {
        id: "ch1_02c",
        chapter: 1,
        scene: "apartment_night",
        speaker: "",
        text: "你打开手机录音，对着墙壁录了三分钟。第二天你回放录音时，发现录音里除了正常的房间噪音外，还有一个你当时没听到的声音——一个女人的声音，在说：」他只是信使。真正的邀请，还在后面。」你查了城郊工业区17号，那里曾是一家生物研究所，十五年前因「实验事故」被关闭。所有相关记录都被删除了。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        next: "ch1_02_resolve"
    },
    ch1_02d: {
        id: "ch1_02d",
        chapter: 1,
        scene: "apartment_night",
        speaker: "",
        text: "你用心理学的知识分析这个现象。从内容来看，这不像是普通的梦话——描述过于精确、过于一致，更像是某种「记忆」而非「想象」。你查阅了关于「集体无意识」和「遗传记忆」的文献，发现一个被主流心理学界忽视的理论：某些记忆可以通过非正常渠道在人与人之间传递。如果这个理论成立，那这个「梦」可能不是梦，而是某个真实存在的「信号」——而你的邻居，只是接收器。",
        layer: "middle",
        sanityChange: -1,
        fearChange: 3,
        next: "ch1_02_resolve"
    },
    ch1_02_resolve: {
        id: "ch1_02_resolve",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "天亮后，你试图向邻居求证，但他完全不记得昨晚说过什么。你看着手背上已经淡去的字迹，心里清楚这不是结束。手机又震动了——「第二个故事讲完了。你开始习惯了吗？」你没有回复，但你知道，下一个故事不会等你准备好。",
        layer: "surface",
        sanityChange: -1,
        fearChange: 2,
        next: "ch1_02_resolve_after"
    },
    ch1_03: {
        id: "ch1_03",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "【怪谈三：末班地铁】深夜的地铁站空无一人，你赶上了末班地铁。车厢里只有你一个乘客，列车缓缓启动。但到了下一站，车门没有打开。站台上站着一排人，他们面朝列车，一动不动，穿着不同年代的服装——有民国的长衫、六七十年代的中山装、九十年代的西装。他们的眼睛都盯着你。",
        layer: "surface",
        fearChange: 2,
        
        cinematic: [{"type":"bgTransition","gradient":"linear-gradient(to bottom, #0a0a15 0%, #151520 50%, #0a0a10 100%)","duration":1500},{"type":"character","id":"subway","text":"末班车","position":"center","enter":"slideRight","state":"dimmed"}],
        knowledgeEntry: ["kb_last_subway","kb_kisaragi_station"],
        choices: [
            {
                text: "走到车厢连接处查看",
                next: "ch1_03a",
                sanityChange: -1,
                fearChange: 1,
                effects: {
                    courage: {
                        add: 1
                    }
                }
            },
            {
                text: "闭眼假装没看到",
                next: "ch1_03b",
                sanityChange: -1,
                fearChange: 3 },
            {
                text: "用手机拍下站台",
                next: "ch1_03c",
                sanityChange: -1,
                fearChange: 4,
                effects: {
                    perception: {
                        add: 1
                    }
                }
            },
            {
                text: "查看地铁线路图",
                next: "ch1_03d",
                requiredIdentity: "taxi_driver",
                isIdentitySpecific: true,
                sanityChange: -1,
                fearChange: 3 }
        ]
    },
    ch1_03a: {
        id: "ch1_03a",
        chapter: 1,
        scene: "underground_passage",
        speaker: "",
        text: "你走到车厢连接处，透过玻璃看向下一节车厢——那里也站满了人。不，不是站，是悬在半空中，脚尖离地几厘米。他们的身体在微微摇晃，像是被看不见的绳索吊着。你猛地后退，撞到了车厢壁上。当你再看时，下一节车厢空了，但连接处的门上多了一行字，像是用指甲刮出来的：「你也很快会到站的。」",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "jumpScare",
        next: "ch1_03_resolve"
    },
    ch1_03b: {
        id: "ch1_03b",
        chapter: 1,
        scene: "underground_passage",
        speaker: "",
        text: "你闭上眼睛，告诉自己这只是幻觉。但当你闭上眼后，你听到了车厢门打开的声音——不是到站的那种，而是从外面有人在逐一打开每扇车门。你感到有目光在注视你，从不同的方向。你不敢睁眼，但一滴冰冷的水落在了你的手背上。你睁开眼——车厢里坐满了人，他们全都侧着头看着你，面无表情。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "ghostAppear",
        next: "ch1_03_resolve"
    },
    ch1_03c: {
        id: "ch1_03c",
        chapter: 1,
        scene: "underground_passage",
        speaker: "",
        text: "你举起手机拍照。屏幕上，站台空空荡荡，没有任何人。你放下手机看向窗外——那排人还在。你再举起手机——还是空的。第三次，你同时看着站台和手机屏幕。屏幕里是空的，但你的眼睛告诉你那里站满了人。你的手机突然自动打开了一个网页，标题是：「本市地铁失踪人员名单（1952-至今）」，名单很长，非常长。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "glitch",
        next: "ch1_03_resolve"
    },
    ch1_03d: {
        id: "ch1_03d",
        chapter: 1,
        scene: "underground_passage",
        speaker: "",
        text: "作为老司机，你对这座城市的地下交通了如指掌。你抬头看线路图——这条线路你跑过无数次，但线路图上多出了三个你从未见过的站点，用红色标注：太平间、送行站、终点。列车正在驶向第一个红色站点。你看了看其他站点的距离显示——下一站还有3分钟，但窗外的隧道壁上已经出现了「太平间」三个字，用白色油漆刷的，还没干透。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        next: "ch1_03_resolve"
    },
    ch1_03_resolve: {
        id: "ch1_03_resolve",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "列车最终在你原本的站点停下了，一切恢复了正常。你走出地铁站，冷汗浸透了后背。站台上等车的乘客看着你，似乎什么都没发生。但你的地铁卡余额变成了一个负数：-17。而手机上又多了一条消息：「第三个故事。你开始发现规律了吗？它们一直在你身边。」",
        layer: "surface",
        sanityChange: -1,
        fearChange: 2,
        next: "ch1_03_resolve_after"
    },
    ch1_04: {
        id: "ch1_04",
        chapter: 1,
        scene: "hospital_er",
        speaker: "",
        text: "【怪谈四：红衣女人】你路过一栋被封禁的住宅楼，铁门上贴着法院的封条。但封条已经断裂，门虚掩着。你隐约听到楼上传来哭声，断断续续，像是一个女人在呜咽。你想起本地论坛上的帖子——这栋楼因连续发生跳楼事件而被封禁，所有死者都提到了同一个名字：「红衣」。",
        layer: "surface",
        fearChange: 2,
        
        cinematic: [{"type":"tint","color":"red","active":true},{"type":"vignette","active":true},{"type":"character","id":"red_dress","text":"红衣","position":"right","enter":"slideLeft","pulseRed":true}],
        knowledgeEntry: ["kb_fengshui","kb_ghost_wall"],
        choices: [
            {
                text: "走进大楼查看",
                next: "ch1_04a",
                sanityChange: -1,
                fearChange: 1,
                effects: {
                    courage: {
                        add: 1
                    }
                }
            },
            {
                text: "在楼下观察",
                next: "ch1_04b",
                sanityChange: -1,
                fearChange: 3,
                effects: {
                    perception: {
                        add: 1
                    }
                }
            },
            {
                text: "打电话报警",
                next: "ch1_04c",
                sanityChange: -1,
                fearChange: 3 },
            {
                text: "查看急诊病历",
                next: "ch1_04d",
                requiredIdentity: "doctor",
                isIdentitySpecific: true,
                sanityChange: -1,
                fearChange: 3 }
        ]
    },
    ch1_04a: {
        id: "ch1_04a",
        chapter: 1,
        scene: "abandoned_building",
        speaker: "",
        text: "你推开铁门走了进去。楼道里一片漆黑，手电筒照亮了墙壁上层层叠叠的符纸和经文。你沿着楼梯往上走，哭声越来越清晰。到了三楼，你发现走廊尽头有一扇门开着，门框上挂着一条红布。你走近一看——房间里空无一人，但墙上挂着一幅画，画中是一个穿红裙的女人。她的眼睛似乎在跟着你转动。你后退一步，画中女人的嘴角似乎微微上扬了。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "ghostAppear",
        next: "ch1_04_resolve"
    },
    ch1_04b: {
        id: "ch1_04b",
        chapter: 1,
        scene: "abandoned_building",
        speaker: "",
        text: "你站在楼下往上看。所有窗户都是黑的，只有三楼的一扇窗户透出暗红色的光。你盯着那扇窗户看了几秒，窗帘动了——有人从里面拉开了窗帘。你看到了一只苍白的手贴在玻璃上，五指张开。然后，那只手缓缓滑下，在玻璃上留下了五道痕迹。窗帘又合上了，但窗台上多了一个东西——一朵红色的纸花，在风中轻轻摇曳。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        next: "ch1_04_resolve"
    },
    ch1_04c: {
        id: "ch1_04c",
        chapter: 1,
        scene: "abandoned_building",
        speaker: "",
        text: "你拨打了报警电话。电话接通了，但对面没有说话，只有一阵轻微的呼吸声。你说了地址和情况，对面沉默了几秒，然后一个沙哑的声音说：「那栋楼......三年前就拆了。」你看着面前的大楼——它分明就在那里。你再打一次，号码已经变成了空号。你低头看手机，通话记录显示你拨打的是一个1894年的号码。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "staticNoise",
        next: "ch1_04_resolve"
    },
    ch1_04d: {
        id: "ch1_04d",
        chapter: 1,
        scene: "hospital_er",
        speaker: "",
        text: "作为急诊科医生，你最近接诊了几个症状相同的病人——他们都说自己在那栋楼里看到了「红衣女人」，随后陷入惊恐。你调出病历，发现一个被所有人忽略的细节：所有病人的瞳孔在暗处会变成红色，持续约30秒后恢复。这不是精神疾病的症状，这是某种生理反应——就好像他们的眼睛真的「看到了」某种特定波长的光。你决定亲自去那栋楼看看。",
        layer: "middle",
        sanityChange: -1,
        fearChange: 3,
        next: "ch1_04a"
    },
    ch1_04_resolve: {
        id: "ch1_04_resolve",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "你离开了那栋楼，心跳久久不能平复。回头看时，三楼那扇窗户的灯灭了。但你知道，「红衣」不会只待在一栋楼里。手机再次震动：「第四个故事。你有没有发现，它们都认识你？」你看着消息，脊背发凉——因为每条消息的落款，都是你自己的名字。",
        layer: "surface",
        sanityChange: -1,
        fearChange: 2,
        next: "ch1_04_resolve_after"
    },
    ch1_05: {
        id: "ch1_05",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "【怪谈五：无名巷订单】深夜，你的手机弹出一条奇怪的订单信息——配送地址是「旧城区·无名巷3号」，备注栏写着：「请送到门口，不要敲门。如果没人应答，把东西放在门口即可。千万不要往门缝里看。「你看了看地图，旧城区那片早就拆迁了，不存在」无名巷」这个地址。",
        layer: "surface",
        fearChange: 2,
        
        cinematic: [{"type":"effect","name":"staticNoise"},{"type":"character","id":"phone","text":"订单","position":"center","enter":"glitch"}],
        knowledgeEntry: ["kb_delivery_horror","kb_ghost_market"],
        identityIntro: {
            night_watchman: "你在值班时，手机突然弹出这条信息——你从没装过任何外卖软件。",
            college_student: "你深夜点了一份宵夜，等了半天没等到，却收到了这条来自未知来源的订单推送。",
            delivery_rider: "你的接单软件弹出了这条订单，小费五十元，地址却不存在于任何地图上。",
            journalist: "你在调查一条新闻线索时，手机突然收到这条信息——发件人是一个不存在的号码。",
            doctor: "你刚下夜班，手机弹出这条推送——你确定自己没有安装过任何配送类应用。",
            streamer: "你直播结束后刷手机，突然弹出这条订单——你从没见过这个界面。",
            taxi_driver: "你的导航软件突然弹出这条信息，像是有人给你派了一个不存在的目的地。",
            archaeologist: "你在整理资料时，手机弹出这条消息——地址里的「旧城区」和你正在研究的一片遗址重名。",
            programmer: "你调试完代码准备休息，手机弹出这条推送——你下意识觉得这段文字像是某种代码的输出。",
            funeral_director: "你值完夜班准备回家，手机弹出这条信息——「无名巷3号」让你想起了殡仪馆的某个旧编号。",
            teacher: "你批改完作业准备休息，手机弹出这条推送——备注里的语气像是在布置一道诡异的作业题。"
        },
        choices: [
            {
                text: "按地址去看看",
                next: "ch1_05a",
                sanityChange: -1,
                fearChange: 1,
                effects: {
                    courage: {
                        add: 1
                    }
                }
            },
            {
                text: "无视这条信息",
                next: "ch1_05b",
                sanityChange: -1,
                fearChange: 3 },
            {
                text: "先查查这个地址",
                next: "ch1_05c",
                sanityChange: -1,
                fearChange: 4,
                effects: {
                    perception: {
                        add: 1
                    }
                }
            },
            {
                text: "联系平台客服",
                next: "ch1_05d",
                requiredIdentity: "delivery_rider",
                isIdentitySpecific: true,
                sanityChange: -1,
                fearChange: 3 }
        ]
    },
    ch1_05a: {
        id: "ch1_05a",
        chapter: 1,
        scene: "abandoned_village",
        speaker: "",
        text: "你按照导航来到了旧城区。这里确实已经拆迁了——到处是废墟和荒草。但导航还在继续指引，带你穿过废墟，拐进了一条连地图上都没有的巷子。巷子尽头是一栋老旧的居民楼，楼道里没有灯。你找到了3号，站在门口。就在你转身要走的时候，你听到门内传来声音：「进来吧，外面冷。」门缝里透出暗红色的光。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        next: "ch1_05_resolve"
    },
    ch1_05b: {
        id: "ch1_05b",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "你无视了这条信息。但十分钟后，同样的信息又弹了出来，措辞变了。你再次忽略。然后信息越来越急迫：「你为什么不来？」「你怕了吗？」「你已经在路上了。」你关掉了手机，但屏幕自己亮了——地图导航已经启动，目的地：旧城区·无名巷3号。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "glitch",
        next: "ch1_05_resolve"
    },
    ch1_05c: {
        id: "ch1_05c",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "你搜索了「旧城区·无名巷3号」。搜索结果只有一条——一个十年前的本地论坛帖子，标题是「有人知道无名巷3号吗？」帖子内容很短：「不要去。不要接那个订单。不要往门缝里看。」帖子的回复只有一条，来自楼主自己：「我说了不要看。现在她知道你了。」帖子下面的IP地址，和你现在的位置一模一样。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        next: "ch1_05_resolve"
    },
    ch1_05d: {
        id: "ch1_05d",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "你联系了平台客服。客服查了半天，告诉你这个订单的来源非常奇怪——下单账号注册于三年前，但从未有过任何交易记录。更诡异的是，这个账号的注册手机号，和你三年前丢失的那张手机卡号码一模一样。你问客服下单者的定位，客服沉默了一会儿：「这个账号......它的定位就在你身边。一米以内。」",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "whisper",
        next: "ch1_05_resolve"
    },
    ch1_05_resolve: {
        id: "ch1_05_resolve",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "你最终没有去那个地址。但你知道，那条信息不会消失。它会在每一个深夜重新出现，直到你亲自前往的那一刻。手机上的消息又来了：「第五个故事。你逃不掉的，因为故事不是来找你的——故事就在你身上。「",
        layer: "surface",
        sanityChange: -1,
        fearChange: 2,
        next: "ch1_05_resolve_after"
    },
    ch1_06: {
        id: "ch1_06",
        chapter: 1,
        scene: "funeral_home",
        speaker: "",
        text: "【怪谈六：冷藏柜】深夜，你来到了殡仪馆。这里安静得可怕，只有冷藏柜压缩机嗡嗡的运转声。值班员告诉你，最近三号冷藏柜的温度显示异常——从零下十八度骤降到了零下三十度，而制冷功率并没有增加。三号柜里存放的是今天刚送来的遗体，一个在废弃大楼里被发现的中年男人，死因不明。",
        layer: "surface",
        fearChange: 2,
        
        cinematic: [{"type":"tint","color":"green","active":true},{"type":"bgTransition","gradient":"linear-gradient(to bottom, #0a100a 0%, #101510 50%, #080c08 100%)","duration":1200},{"type":"character","id":"fridge","text":"冷藏柜","position":"center","enter":"fadeIn","shake":true}],
        knowledgeEntry: ["kb_morgue","kb_cold_storage"],
        identityIntro: {
            night_watchman: "你巡逻时发现一具遗体被送到了你负责看管的旧楼里，警方让你来殡仪馆配合辨认。",
            college_student: "你的一位远房亲戚去世了，家人让你来殡仪馆帮忙处理后续事宜。",
            delivery_rider: "你深夜送餐到殡仪馆附近，值班员叫住了你，说有个包裹需要签收。",
            journalist: "你追踪一条新闻线索，发现所有线索都指向这具不明死因的遗体，你决定来殡仪馆调查。",
            doctor: "你接诊的一位病人突然死亡后被送到了这里，你来做最后的死亡确认。",
            streamer: "你的粉丝提议你来殡仪馆做一场深夜探险直播，你犹豫再三还是来了。",
            taxi_driver: "你深夜载了一位要去殡仪馆的乘客，到了之后乘客消失了，你不得不进去看看。",
            archaeologist: "这具遗体的发现地点和你正在研究的遗址有关联，你被通知来查看。",
            programmer: "你收到了一封匿名邮件，里面是这具遗体的数据和殡仪馆的地址，像是某种邀请。",
            funeral_director: "今晚轮到你在殡仪馆值班，三号柜的异常是你巡查时发现的。",
            teacher: "你以前的一个学生的家长去世了，你来殡仪馆表示慰问，却意外得知了三号柜的异常。"
        },
        choices: [
            {
                text: "打开三号柜检查",
                next: "ch1_06a",
                sanityChange: -1,
                fearChange: 1,
                effects: {
                    courage: {
                        add: 1
                    }
                }
            },
            {
                text: "查看监控录像",
                next: "ch1_06b",
                sanityChange: -1,
                fearChange: 3,
                effects: {
                    perception: {
                        add: 1
                    }
                }
            },
            {
                text: "询问值班员更多细节",
                next: "ch1_06c",
                sanityChange: -1,
                fearChange: 3 },
            {
                text: "检查遗体档案",
                next: "ch1_06d",
                requiredIdentity: "funeral_director",
                isIdentitySpecific: true,
                sanityChange: -1,
                fearChange: 3 }
        ]
    },
    ch1_06a: {
        id: "ch1_06a",
        chapter: 1,
        scene: "funeral_home",
        speaker: "",
        text: "你拉开三号柜的门，一股异常的寒气扑面而来。遗体躺在那里，看起来一切正常——直到你注意到它的手指微微弯曲，像是在握着什么东西。你小心翼翼地掰开它的手指，发现掌心里攥着一张纸条。纸条上写着你的名字和今天的日期，还有一句话：」今晚，我会来接你。」你猛地关上柜门，转身时看到走廊尽头站着一个人影——穿着和你一样的衣服。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "ghostAppear",
        next: "ch1_06_resolve"
    },
    ch1_06b: {
        id: "ch1_06b",
        chapter: 1,
        scene: "funeral_home",
        speaker: "",
        text: "你调出了三号柜附近的监控录像。画面中，三号柜的柜门在凌晨两点十七分自行打开了——没有任何人触碰。柜门缓缓打开后，遗体的手从柜内伸了出来，在空中摸索了一会儿，然后缩了回去。柜门又自行关闭了。整个过程持续了47秒。你看了看时间——现在正好是凌晨两点十七分。身后传来了柜门打开的声音。",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        horrorEffect: "jumpScare",
        next: "ch1_06_resolve"
    },
    ch1_06c: {
        id: "ch1_06c",
        chapter: 1,
        scene: "funeral_home",
        speaker: "值班员",
        text: "值班员压低声音告诉你，这已经不是第一次了。上个月也有一具遗体出现过同样的异常——温度骤降、姿势改变。那具遗体火化前的那个晚上，值班员听到了冷藏柜里传来的敲门声，从里面敲的。他当时以为是幻觉，但第二天发现那具遗体的手指上有新鲜的撞伤。「还有，」值班员补充道，「送这具遗体来的人说，发现他的时候，他手里攥着一张纸条。纸条上写着......你的名字。「",
        layer: "shallow",
        sanityChange: -1,
        fearChange: 1,
        next: "ch1_06_resolve"
    },
    ch1_06d: {
        id: "ch1_06d",
        chapter: 1,
        scene: "funeral_home",
        speaker: "",
        text: "你查阅了这具遗体的档案。死者是一名保安，在废弃商业大楼内被发现，官方死因是」心脏骤停」。但你的职业经验让你注意到了几个不正常的细节：遗体的瞳孔极度扩张，面部表情不是恐惧而是——微笑。更让你不安的是，遗体送来时穿着的保安制服上，工牌号码和你入职时的工牌号码只差一位。你翻了翻近三年的记录，发现了一个规律：每年这个日期，都会送来一具同样的遗体。同样的姿势，同样的微笑，同样的工牌号差一位。",
        layer: "middle",
        sanityChange: -1,
        fearChange: 3,
        next: "ch1_06_resolve"
    },
    ch1_06_resolve: {
        id: "ch1_06_resolve",
        chapter: 1,
        scene: "city_street_night",
        speaker: "",
        text: "你离开了殡仪馆，夜风吹在脸上，但你感觉不到冷。你的手指在发抖，不是因为恐惧，而是因为某种更深层的东西正在觉醒。手机上的消息变了——不再是那个诡异的号码，而是来自你自己：「第一章结束了。你已经触碰到了冰山的水面。但水面之下，还有更深的黑暗在等着你。准备好了吗？「",
        layer: "surface",
        sanityChange: -1,
        fearChange: 2,
        next: "ch1_06_resolve_after"
    },
    ch1_01_resolve_after: {
        id: "ch1_01_resolve_after",
        speaker: "",
        text: "【后日谈·午夜电梯】从那栋楼出来后，你花了很长时间才缓过来。电梯里那些画面反复在脑海中闪回，你开始对封闭空间产生了本能的警惕。",
        identityText: {
            night_watchman: "那天之后，你每次巡逻经过那栋写字楼，都会下意识地绕开电梯改走楼梯。老张问你最近怎么总走楼梯，你只是摇了摇头。你在监控画面里反复回看那部电梯的录像——凌晨两点，电梯门确实自己开合过三次，但里面从来没有人。",
            college_student: "那天之后，你再也不敢一个人坐电梯了。小王说你最近总是走楼梯，你找了个借口说想锻炼身体。但你只是不敢面对那个可能再次跳过你按的楼层的显示屏。你开始研究电梯的工作原理，试图用物理学解释那天的事，但你心里清楚，物理学解释不了检修证上1994年的日期。",
            delivery_rider: "那天之后，你送餐时开始刻意避开那栋写字楼。阿强说你最近绕路了，你笑了笑说那栋楼的电梯老坏。但只有你知道，那部电梯不是坏了，是它根本不属于这栋楼。你开始习惯性地在进电梯前看一眼检修证，虽然你知道，看了也未必是真相。",
            journalist: "那天之后，你把那段经历写进了私人日记。你想写一篇报道，但每次动笔都写不下去——因为你自己都无法解释那天发生了什么。小林问你是不是还在调查那件事，你说已经放下了。但每天晚上，你都会把门锁检查两遍，然后站在窗前看那栋写字楼的顶层，确认灯是灭的。",
            doctor: "那天之后，你在病历系统里查了又查，试图找到和那部电梯有关的医疗记录。什么都没有。你开始怀疑是不是自己太累了产生了幻觉，但你手机里那段47分钟的通话记录是真实的。你把那天的值班记录改了，写的是'一切正常'。有些异常，记录下来反而更危险。",
            streamer: "那天之后，你把电梯里的直播录像看了一遍又一遍。画面里一切正常，但弹幕里有人说，他们在直播中看到了电梯楼层显示屏上闪过一个不存在的数字。你把那段录像设为私密，不再公开。粉丝们问你怎么不更新了，你说最近身体不舒服。其实你是不知道，下一场直播，镜头里还会出现什么。",
            taxi_driver: "那天之后，你每次经过那栋写字楼都会下意识地看一眼顶层。刘哥说你最近开车变慢了，你说是因为油价涨了想省油。但只有你知道，你不是在省油，你是在给自己留反应时间。你开始在车里放一串佛珠，虽然你不信佛，但你觉得总比什么都没有强。",
            archaeologist: "那天之后，你把检修证上1994年的日期和那栋楼的历史做了对比。这栋楼1994年确实发生过一起事故，但所有档案都被销毁了。你在笔记本上写了一行字：'有些历史，也许应该永远埋在地下。'但你忍不住想，如果那些旧报纸上的日期都是同一天，那1994年3月15日到底发生了什么？",
            programmer: "那天之后，你给那栋楼的电梯系统加了一层额外的监控程序。每天早上你都会先查看日志，确认电梯没有异常运行记录。阿杰问你最近怎么总是加班，你说项目赶进度。其实你只是想确认，那部电梯的楼层编号，还是你认识的样子。你开始备份所有数据，因为你有一种预感——有一天，这些东西可能会自己消失。",
            funeral_director: "那天之后，你开始更加认真地对待每一具遗体。老陈说你最近工作特别仔细，你说只是想更专业。但只有你知道，那天在电梯里看到的那个穿灰色工装的人，和三号柜里那具遗体的穿着一模一样。你开始相信老陈说的话——有些灵魂还没准备好离开，而你能做的，就是让它们的最后一程尽量安详。",
            teacher: "那天之后，你在课堂上变得更加关注每一个学生。你开始记录每个孩子的状态，生怕有人像那部电梯一样突然消失。同事们说你最近瘦了，你说是不太适应新学期的节奏。但你知道，让你睡不着的不是工作，是每天深夜都会梦到那个不断上升的数字。"
        },
        sanityChange: 2,
        fearChange: -1,
        next: "_daily_life"
    },
    ch1_02_resolve_after: {
        id: "ch1_02_resolve_after",
        speaker: "",
        text: "【后日谈·午夜梦语】那个声音在你耳边回响了很久。白天的时候你努力回归正常，但每到夜深人静，那个地址就会从记忆深处浮上来，像一根刺扎在你的意识里。",
        identityText: {
            night_watchman: "那天之后，你值夜班时开始戴着耳机听白噪音。老张说你最近怎么总听音乐，你说怕犯困。但只有你知道，你是怕再听到那种不属于任何人的声音。你查了那栋楼的住户名单，发现你隔壁那间房三年前就没人住了。",
            college_student: "那天之后，你花了好几天才让自己恢复正常的学习节奏。小王说你最近总是走神，你找了个借口说是论文压力大。你把那晚的录音删了，但有些声音，删了也忘不掉。你开始习惯在睡前检查一遍宿舍的门窗，虽然你知道，有些东西关不住。",
            delivery_rider: "那天之后，你晚上骑车的时候不再走那些没路灯的小巷了。阿强说你最近接单变少了，你笑了笑说最近想多休息。你告诉自己，绕远路只是多花几分钟，但那几分钟，可能就是生与死的距离。你手背上的字迹虽然淡了，但每到凌晨两点，你总觉得它在发痒。",
            journalist: "那天之后，你把城郊工业区17号作为一条线索记在了笔记本上。你试图查到那家生物研究所的更多信息，但所有记录都被删除了。小林问你是不是又在追什么新闻，你说没有。但每天晚上，你都会把门锁检查两遍，然后竖起耳朵听隔壁的动静。",
            doctor: "那天之后，你在病历系统里搜索了'集体梦话'和'遗传记忆'相关的病例。什么都没有——至少在公开记录里什么都没有。你开始怀疑是不是自己太累了产生了幻觉，但你手背上那道字迹是真实的。你把那天的值班记录改了，写的是'一切正常'。",
            streamer: "那天之后，你把直播时间从深夜改到了白天。粉丝们问你怎么不熬夜了，你说想调整作息。但真正的原因是，你不敢在凌晨两点还保持清醒——因为你怕那个声音会再次响起，而这次，它可能不只是念你的名字。",
            taxi_driver: "那天之后，你每次收车回家都会在门口站一会儿，听隔壁的动静。刘哥说你最近开车变慢了，你说是因为油价涨了想省油。但只有你知道，你不是在省油，你是在给自己留反应时间。你开始在车里放一串佛珠，虽然你不信佛，但你觉得总比什么都没有强。",
            archaeologist: "那天之后，你查了城郊工业区17号的历史。那里确实曾是一家生物研究所，但在所有公开档案中，关于它的记录只有一行字：'因实验事故关闭'。什么实验？什么事故？没有人知道。你在笔记本上写了一行字：'有些历史，也许应该永远埋在地下。'",
            programmer: "那天之后，你给手机装了一个录音监控程序，设定在凌晨两点自动启动。第二天你查看录音文件——三分钟的静默，然后是一个你听不懂的声音，像是某种编码。你试着用频谱分析软件解析，发现那段声音的波形和你手背上字迹的形状惊人地相似。",
            funeral_director: "那天之后，你开始更加仔细地检查每一具遗体的手。老陈说你最近工作特别仔细，你说只是想更专业。但只有你知道，你在找——找那种可能攥着纸条的手指。你开始相信老陈说的话——有些灵魂还没准备好离开，而你能做的，就是让它们的最后一程尽量安详。",
            teacher: "那天之后，你在课堂上变得更加关注每一个学生。你开始记录每个孩子的状态，生怕有人像那个声音一样悄无声息地消失。同事们说你最近瘦了，你说是不太适应新学期的节奏。但你知道，让你睡不着的不是工作，是每天凌晨两点都会准时醒来的习惯。"
        },
        sanityChange: 2,
        fearChange: -1,
        next: "_daily_life"
    },
    ch1_03_resolve_after: {
        id: "ch1_03_resolve_after",
        speaker: "",
        text: "【后日谈·末班地铁】从地铁站出来后，你花了很长时间才让心跳恢复正常。那些穿着不同年代服装的人影，像是刻在了你的视网膜上，闭上眼就能看到。",
        identityText: {
            night_watchman: "那天之后，你每次巡逻经过地铁站入口，都会下意识地往里看一眼。老张说你最近怎么总是走神，你只是摇了摇头。你在监控画面里回看了那段时间的地铁出入口录像——画面里，你确实走出了地铁站，但在你身后，还跟着一排模糊的人影。",
            college_student: "那天之后，你再也不敢坐末班地铁了。小王说你最近怎么总是早走，你说想回去多看点书。但你只是不敢再面对那趟只有你一个乘客的列车。你开始研究地铁的历史，发现这条线路在修建时曾挖出过大量无名骸骨，但这件事从未被报道过。",
            delivery_rider: "那天之后，你送餐时开始刻意避开地铁沿线。阿强说你最近绕路了，你笑了笑说最近想多骑车锻炼。但只有你知道，你不是在锻炼，你是在远离那些站台上可能站着的人。你的地铁卡余额还是-17，你试过充值，但数字永远不会变。",
            journalist: "那天之后，你把'本市地铁失踪人员名单'作为一条重要线索记在了笔记本上。你试图联系名单上失踪者的家属，但所有人的回答都一样：'他/她只是坐了一趟末班地铁，就再也没回来。'你开始怀疑，那趟列车不是在运送乘客，而是在收集乘客。",
            doctor: "那天之后，你在病历系统里搜索了和地铁相关的精神科病例。有十几个人报告过类似的经历——在末班地铁上看到了'不该看到的人'。他们的共同症状是：瞳孔在暗处会出现短暂的异常反应，持续约30秒。你把这个发现记在了私人笔记本上，没有写入任何正式病历。",
            streamer: "那天之后，你再也不敢在地铁里直播了。粉丝们问你怎么不拍通勤日常了，你说最近改走路上班。但真正的原因是，你怕直播镜头再次拍到那些手机拍不到的东西。你把那段地铁直播的录像删了，但弹幕截图里那排人的影子还保存在你的相册里。",
            taxi_driver: "那天之后，你每次经过地铁站都会下意识地看一眼出口。刘哥说你最近开车变慢了，你说是因为油价涨了想省油。但只有你知道，你不是在省油，你是在给自己留反应时间。你开始记下每天经过的地铁站名，确认它们还在线路图上。",
            archaeologist: "那天之后，你查了那条地铁线路的修建历史。在施工日志中，你发现了一个被忽略的细节：修建过程中曾发现一处地下空间，但报告里只写了'地质异常'，没有更多描述。你在笔记本上写了一行字：'有些历史，也许应该永远埋在地下。'",
            programmer: "那天之后，你试图用技术手段分析那张自动弹出的失踪人员名单网页。但网页的源代码里只有一行注释：'你已经看到了。'你检查了浏览器历史记录——那个网页从未被访问过，但它确实出现在了你的屏幕上。你开始备份所有数据，因为你有一种预感——有一天，这些东西可能会自己消失。",
            funeral_director: "那天之后，你开始更加仔细地检查每一具遗体的身份信息。老陈说你最近工作特别仔细，你说只是想更专业。但只有你知道，你在核对——核对那些遗体的信息是否和失踪名单上的名字重合。你开始相信老陈说的话——有些灵魂还没准备好离开，而你能做的，就是让它们的最后一程尽量安详。",
            teacher: "那天之后，你在课堂上变得更加关注每一个学生。你开始记录每个孩子的状态，生怕有人像那些站台上的身影一样悄无声息地消失。同事们说你最近瘦了，你说是不太适应新学期的节奏。但你知道，让你睡不着的不是工作，是那张地铁卡上永远不会变的-17。"
        },
        sanityChange: 2,
        fearChange: -1,
        next: "_daily_life"
    },
    ch1_04_resolve_after: {
        id: "ch1_04_resolve_after",
        speaker: "",
        text: "【后日谈·红衣女人】离开那栋楼后，你总觉得有什么东西跟着你出来了。每次经过有红色灯光的地方，你都会不自觉地加快脚步。",
        identityText: {
            night_watchman: "那天之后，你每次巡逻经过那栋被封禁的楼，都会下意识地加快脚步。值班的时候，你开始习惯性地多看两眼监控画面——尤其是三楼那个角度。老张问你最近怎么总是心不在焉，你只是摇了摇头。有些事情，说出来反而更可怕。",
            college_student: "那天之后，你花了好几天才让自己恢复正常的学习节奏。小王说你最近总是走神，你找了个借口说是论文压力大。但你只是不敢看任何红色的东西——红色的书皮、红色的水杯、红色的衣服。你开始习惯在睡前检查一遍宿舍的门窗，虽然你知道，有些东西关不住。",
            delivery_rider: "那天之后，你送餐时开始刻意避开那栋楼附近的路线。阿强说你最近接单变少了，你笑了笑说最近想多休息。但只有你知道，你是在躲——躲那个可能出现在任何一扇窗户后面的红色身影。你告诉自己，绕远路只是多花几分钟，但那几分钟，可能就是生与死的距离。",
            journalist: "那天之后，你把那段经历写进了私人日记，而不是工作笔记。你知道这篇报道永远不会发表——不是因为没人信，而是因为信了之后会发生什么，你不敢想。小林问你是不是还在调查那件事，你说已经放下了。但每天晚上，你都会把窗帘拉得严严实实，生怕窗外出现红色的光。",
            doctor: "那天之后，你在病历系统里查了又查，试图找到那些'红衣女人'目击者的后续记录。什么都没有——就好像那些病人从来没有来过急诊。你开始怀疑是不是自己太累了产生了幻觉，但你手背上那道抓痕是真实的。你把那天的值班记录改了，写的是'一切正常'。",
            streamer: "那天之后，你把直播录像看了一遍又一遍，试图找到那个画中女人的画面。录像里一切正常，但弹幕里有人说，他们在直播中看到了你身后有一道红色的影子。你把那段录像设为私密，不再公开。粉丝们问你怎么不更新了，你说最近身体不舒服。",
            taxi_driver: "那天之后，你每次经过那栋楼都会下意识地看一眼三楼的窗户。刘哥说你最近开车变慢了，你说是因为油价涨了想省油。但只有你知道，你不是在省油，你是在给自己留反应时间。你开始在车里放一串佛珠，虽然你不信佛，但你觉得总比什么都没有强。",
            archaeologist: "那天之后，你查了那栋楼的历史。它建于1994年，但原始设计图纸上三楼那间房的用途标注为'特殊用途'，没有更多说明。你在笔记本上写了一行字：'有些历史，也许应该永远埋在地下。'但你忍不住想，那幅画中的女人，是不是也'埋'在那里？",
            programmer: "那天之后，你给手机相册加了一层加密。你反复查看那天拍的照片，发现每张照片的角落都有一个模糊的红点——不是镜头问题，因为红点的位置在每张照片中都不一样，像是在移动。你开始备份所有数据，因为你有一种预感——有一天，这些东西可能会自己消失。",
            funeral_director: "那天之后，你开始更加认真地对待每一具遗体。老陈说你最近工作特别仔细，你说只是想更专业。但只有你知道，你在核对——核对那些跳楼身亡者的记录。你发现一个被所有人忽略的细节：他们的面部表情不是恐惧，而是微笑。和三号柜那具遗体一模一样的微笑。",
            teacher: "那天之后，你在课堂上变得更加关注每一个学生。你开始记录每个孩子的状态，生怕有人像那些跳楼者一样被某种东西吸引。同事们说你最近瘦了，你说是不太适应新学期的节奏。但你知道，让你睡不着的不是工作，是每天深夜窗帘缝隙里偶尔闪过的红色微光。"
        },
        sanityChange: 2,
        fearChange: -1,
        next: "_daily_life"
    },
    ch1_05_resolve_after: {
        id: "ch1_05_resolve_after",
        speaker: "",
        text: "【后日谈·无名巷订单】那条信息虽然被你忽略了，但它像一根鱼刺卡在喉咙里，吞不下去也吐不出来。你开始对每一个深夜弹出的手机通知都感到莫名的紧张。",
        identityText: {
            night_watchman: "那天之后，你值夜班时把手机调成了静音。老张问你最近怎么总不接电话，你说怕吵到别人。但只有你知道，你是怕再看到那条来自不存在地址的推送。你在监控画面里反复确认——旧城区那片废墟里，确实没有任何建筑。",
            college_student: "那天之后，你删掉了手机上所有外卖软件，改去食堂吃饭。小王说你最近怎么不吃外卖了，你说想省钱。但你只是不敢再点开任何配送页面——因为你怕那个不存在的地址会再次出现，而这次，备注栏里写的可能是你自己的地址。",
            delivery_rider: "那天之后，你送餐时开始刻意避开旧城区方向。阿强说你最近接单变少了，你笑了笑说最近想多休息。但只有你知道，你是在躲——躲那个可能再次弹出的订单。你试过卸载接单软件，但第二天它又自动出现在了你的手机上。",
            journalist: "那天之后，你把'旧城区·无名巷3号'作为一条线索记在了笔记本上。你搜索了所有相关的论坛帖子，发现每隔几年就会有人发帖询问同一个地址。而每一个发帖的人，后来都再也没有更新过。小林问你是不是又在追什么新闻，你说没有。",
            doctor: "那天之后，你在病历系统里搜索了和无名巷相关的地址记录。什么都没有——至少在公开记录里什么都没有。但你发现了一个奇怪的规律：最近三年，每到农历七月，急诊科都会接诊一个症状相同的病人——他们都说自己去了一个不存在的地址。",
            streamer: "那天之后，你再也不敢在深夜刷手机了。粉丝们问你怎么不更新了，你说最近身体不舒服。但真正的原因是，你怕再次看到那个自动弹出的页面——因为上次那个直播间的观众数是0，但弹幕一直在发。你把手机设了定时开关机，凌晨十二点自动关机。",
            taxi_driver: "那天之后，你每次导航到陌生地址都会反复确认。刘哥说你最近开车变慢了，你说是因为油价涨了想省油。但只有你知道，你不是在省油，你是在确认目的地真的存在。你开始在车里放一串佛珠，虽然你不信佛，但你觉得总比什么都没有强。",
            archaeologist: "那天之后，你查了旧城区的历史地图。在一份1950年代的地图上，你确实找到了'无名巷'——它就在现在废墟的位置。但地图上那条巷子的尽头标注的不是3号，而是一个你从未见过的符号。你在笔记本上写了一行字：'有些历史，也许应该永远埋在地下。'",
            programmer: "那天之后，你试图追踪那条推送信息的来源。但它的数据包不经过任何服务器——像是直接注入了你的手机内存。你检查了手机的安全日志，发现那天凌晨两点十七分，有一个未知进程在你的手机上运行了47秒，然后自行删除了所有痕迹。",
            funeral_director: "那天之后，你开始更加认真地对待每一具遗体的来源信息。老陈说你最近工作特别仔细，你说只是想更专业。但只有你知道，你在核对——核对那些遗体的发现地点是否和无名巷有关。你开始相信老陈说的话——有些灵魂还没准备好离开，而你能做的，就是让它们的最后一程尽量安详。",
            teacher: "那天之后，你在课堂上变得更加关注每一个学生。你开始记录每个孩子的状态，生怕有人像那条信息一样悄无声息地出现在不该出现的地方。同事们说你最近瘦了，你说是不太适应新学期的节奏。但你知道，让你睡不着的不是工作，是每天深夜手机屏幕自己亮起的那一瞬间。"
        },
        sanityChange: 2,
        fearChange: -1,
        next: "_daily_life"
    },
    ch1_06_resolve_after: {
        id: "ch1_06_resolve_after",
        speaker: "",
        text: "【后日谈·冷藏柜】离开殡仪馆后，你总觉得背后有一道冰冷的视线。那种寒意不是来自外界，而是从你的骨头缝里渗出来的，像是有什么东西在体内扎根。",
        identityText: {
            night_watchman: "那天之后，你每次巡逻经过存放物资的地方，都会下意识地加快脚步。值班的时候，你开始习惯性地多看两眼监控画面——尤其是冷藏区域。老张问你最近怎么总是心不在焉，你只是摇了摇头。你把那晚的经历当作一场噩梦，但你知道，走廊尽头那个穿和你一样衣服的人影，不是梦。",
            college_student: "那天之后，你花了好几天才让自己恢复正常的学习节奏。小王说你最近总是走神，你找了个借口说是论文压力大。但你只是不敢闭眼——因为每次闭眼，你都能看到那张纸条上的字：'今晚，我会来接你。'你开始习惯在睡前检查一遍宿舍的门窗，虽然你知道，有些东西关不住。",
            delivery_rider: "那天之后，你送餐时开始刻意避开殡仪馆附近的路线。阿强说你最近接单变少了，你笑了笑说最近想多休息。但只有你知道，你是在躲——躲那个可能再次出现在走廊尽头的人影。你告诉自己，绕远路只是多花几分钟，但那几分钟，可能就是生与死的距离。",
            journalist: "那天之后，你把那段经历写进了私人日记，而不是工作笔记。你试图查到那具遗体的更多信息，但所有记录都被标注为'机密'。小林问你是不是还在调查那件事，你说已经放下了。但每天晚上，你都会把门锁检查两遍，然后确认窗帘后面没有站着人。",
            doctor: "那天之后，你在病历系统里查了又查，试图找到那个保安的就诊记录。什么都没有——就好像他从来没有去过任何医院。你开始怀疑是不是自己太累了产生了幻觉，但你手背上那道冰凉的触感是真实的。你把那天的值班记录改了，写的是'一切正常'。有些异常，记录下来反而更危险。",
            streamer: "那天之后，你把直播时间从深夜改到了白天。粉丝们问你怎么不熬夜了，你说想调整作息。但真正的原因是，你不敢在凌晨两点十七分还保持清醒——因为那个时间，正是监控录像里柜门自行打开的时间。你怕你的直播镜头会拍到什么不该拍到的东西。",
            taxi_driver: "那天之后，你每次经过殡仪馆都会下意识地看一眼后视镜。刘哥说你最近开车变慢了，你说是因为油价涨了想省油。但只有你知道，你不是在省油，你是在给自己留反应时间。你开始在车里放一串佛珠，虽然你不信佛，但你觉得总比什么都没有强。",
            archaeologist: "那天之后，你查了那具遗体发现地点的历史。那栋废弃商业大楼建于1994年，和你之前遇到的多个怪谈都有时间上的关联。你在笔记本上写了一行字：'有些历史，也许应该永远埋在地下。'但你忍不住想，那个每年都会送来一具遗体的规律，是不是某种仪式的一部分？",
            programmer: "那天之后，你试图用技术手段分析殡仪馆的监控录像。但录像文件的时间戳显示，那段柜门自行打开的画面不是实时录制的——它的创建时间是1994年3月15日。你开始备份所有数据，因为你有一种预感——有一天，这些东西可能会自己消失。",
            funeral_director: "那天之后，你开始更加认真地对待每一具遗体。老陈说你最近工作特别仔细，你说只是想更专业。但只有你知道，那天之后你再也不敢在三号柜前背对着它站。你翻了翻近三年的记录，每年同一个日期都会送来一具微笑的遗体——你决定从今年开始，在那一天之前把三号柜空出来。",
            teacher: "那天之后，你在课堂上变得更加关注每一个学生。你开始记录每个孩子的状态，生怕有人像那具遗体一样悄无声息地消失。同事们说你最近瘦了，你说是不太适应新学期的节奏。但你知道，让你睡不着的不是工作，是每天凌晨两点十七分都会准时醒来的习惯。"
        },
        sanityChange: 2,
        fearChange: -1,
        next: "ch2_intro"
    }
};
