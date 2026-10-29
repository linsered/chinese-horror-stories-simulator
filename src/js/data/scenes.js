var GT = window.GT || {};

GT.SceneData = {
    old_building: {
        id: 'old_building',
        name: '旧商业大楼',
        description: '建于八十年代的老旧商业大楼，墙皮剥落，灯管闪烁。深夜的走廊空旷而寂静，只有你的脚步声在回荡。',
        gradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 30%, #0d0d1a 60%, #050510 100%)',
        backgroundColor: '#0a0a0a',
        ambientColor: '#2a2a4e',
        particles: [
            { type: 'dust', style: 'animation: float-up 10s infinite; color: rgba(150,150,150,0.3);' }
        ],
        music: 'ambient_building'
    },
    university_dorm: {
        id: 'university_dorm',
        name: '大学宿舍',
        description: '普通的四人宿舍，此刻只有你一人。窗外的路灯将树影投射在墙壁上，像是某种扭曲的符文。',
        gradient: 'linear-gradient(180deg, #0a0a1e 0%, #1a1a3e 30%, #0d0d2a 60%, #050515 100%)',
        backgroundColor: '#0a0a1e',
        ambientColor: '#3a3a6e',
        particles: [],
        music: 'ambient_dorm'
    },
    city_street_night: {
        id: 'city_street_night',
        name: '深夜街道',
        description: '凌晨的城市街道，路灯昏黄，偶尔有出租车驶过。巷子深处传来若有若无的声响。',
        gradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a0a 30%, #0d0d05 60%, #050505 100%)',
        backgroundColor: '#0a0a0a',
        ambientColor: '#3a3a1a',
        particles: [
            { type: 'fog', style: 'animation: drift 20s infinite; color: rgba(100,100,80,0.2);' }
        ],
        music: 'ambient_street'
    },
    newspaper_office: {
        id: 'newspaper_office',
        name: '报社办公室',
        description: '深夜的报社办公室，只有你的工位还亮着灯。桌上散落着匿名信和照片，墙上的时钟滴答作响。',
        gradient: 'linear-gradient(180deg, #1a1a0a 0%, #2a2a1a 30%, #1a1a0d 60%, #0a0a05 100%)',
        backgroundColor: '#1a1a0a',
        ambientColor: '#5a5a2a',
        particles: [],
        music: 'ambient_office'
    },
    hospital_er: {
        id: 'hospital_er',
        name: '急诊室',
        description: '深夜的急诊室，荧光灯发出嗡嗡的声响。走廊尽头的病房门微微晃动，仿佛有人在那边呼吸。',
        gradient: 'linear-gradient(180deg, #0a1a1a 0%, #1a2a2a 30%, #0d1a1a 60%, #050a0a 100%)',
        backgroundColor: '#0a1a1a',
        ambientColor: '#2a5a5a',
        particles: [
            { type: 'flicker', style: 'animation: flicker 3s infinite; color: rgba(200,255,255,0.1);' }
        ],
        music: 'ambient_hospital'
    },
    abandoned_building: {
        id: 'abandoned_building',
        name: '废弃住宅楼',
        description: '因连续跳楼事件被封禁的住宅楼，铁门上贴满了符纸。楼道里弥漫着潮湿和腐朽的气味，每层楼的声控灯都已损坏。',
        gradient: 'linear-gradient(180deg, #1a0a0a 0%, #2a1a1a 30%, #1a0d0d 60%, #0a0505 100%)',
        backgroundColor: '#1a0a0a',
        ambientColor: '#5a2a2a',
        particles: [
            { type: 'shadow', style: 'animation: drift 15s infinite; color: rgba(100,0,0,0.2);' }
        ],
        music: 'ambient_abandoned'
    },
    taxi_night: {
        id: 'taxi_night',
        name: '夜班出租车',
        description: '你的出租车行驶在空旷的夜路上，计价器跳动着数字。后视镜中，路灯一盏盏后退，但总觉得有什么东西在后座一闪而过。',
        gradient: 'linear-gradient(180deg, #0a0a0a 0%, #0a0a1e 30%, #050510 60%, #020208 100%)',
        backgroundColor: '#0a0a0a',
        ambientColor: '#1a1a3e',
        particles: [],
        music: 'ambient_driving'
    },
    excavation_site: {
        id: 'excavation_site',
        name: '考古发掘现场',
        description: '荒野中的考古工地，帐篷在夜风中摇曳。探照灯照向古墓入口，那里的黑暗似乎比周围更加浓稠。',
        gradient: 'linear-gradient(180deg, #1a1a0a 0%, #2a2a1a 30%, #1a1a0d 60%, #0a0a05 100%)',
        backgroundColor: '#1a1a0a',
        ambientColor: '#4a4a2a',
        particles: [
            { type: 'dust', style: 'animation: float-up 8s infinite; color: rgba(180,160,100,0.3);' }
        ],
        music: 'ambient_excavation'
    },
    office_night: {
        id: 'office_night',
        name: '深夜办公室',
        description: '空无一人的开放式办公室，只有你的显示器发出幽蓝的光。服务器机房传来持续的嗡鸣声，像是某种低频的心跳。',
        gradient: 'linear-gradient(180deg, #0a0a1e 0%, #0a1a2e 30%, #050d1a 60%, #020510 100%)',
        backgroundColor: '#0a0a1e',
        ambientColor: '#1a3a5e',
        particles: [
            { type: 'flicker', style: 'animation: flicker 5s infinite; color: rgba(100,150,255,0.1);' }
        ],
        music: 'ambient_server'
    },
    funeral_home: {
        id: 'funeral_home',
        name: '殡仪馆',
        description: '深夜的殡仪馆，焚香的味道弥漫在空气中。冷藏柜的压缩机嗡嗡运转，走廊尽头的花圈在微风中轻轻晃动。',
        gradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a1a 30%, #0d050d 60%, #050205 100%)',
        backgroundColor: '#0a0a0a',
        ambientColor: '#3a1a3a',
        particles: [
            { type: 'mist', style: 'animation: drift 25s infinite; color: rgba(150,100,150,0.15);' }
        ],
        music: 'ambient_funeral'
    },
    village_school: {
        id: 'village_school',
        name: '山村小学',
        description: '偏远山村的简易小学，教室里的课桌椅排列整齐。窗外的山雾越来越浓，仿佛要将整个村庄吞噬。',
        gradient: 'linear-gradient(180deg, #0a1a0a 0%, #1a2a1a 30%, #0d1a0d 60%, #050a05 100%)',
        backgroundColor: '#0a1a0a',
        ambientColor: '#2a4a2a',
        particles: [
            { type: 'fog', style: 'animation: drift 18s infinite; color: rgba(100,150,100,0.2);' }
        ],
        music: 'ambient_village'
    },
    underground_passage: {
        id: 'underground_passage',
        name: '地下通道',
        description: '城市地下的通道系统，潮湿的墙壁上渗出水珠。远处传来管道的共鸣声，像是地底深处某种巨大生物的呼吸。',
        gradient: 'linear-gradient(180deg, #050505 0%, #0a0a0a 30%, #030303 60%, #000000 100%)',
        backgroundColor: '#050505',
        ambientColor: '#1a1a1a',
        particles: [
            { type: 'drip', style: 'animation: fall 6s infinite; color: rgba(100,150,200,0.3);' }
        ],
        music: 'ambient_underground'
    },
    red_room: {
        id: 'red_room',
        name: '红色房间',
        description: '一间墙壁被涂成暗红色的房间，空气中弥漫着铁锈的气味。房间中央放着一把椅子，椅背上刻着你看不懂的符号。',
        gradient: 'linear-gradient(180deg, #1a0505 0%, #2a0a0a 30%, #1a0505 60%, #0a0202 100%)',
        backgroundColor: '#1a0505',
        ambientColor: '#5a0a0a',
        particles: [
            { type: 'shadow', style: 'animation: drift 12s infinite; color: rgba(200,0,0,0.15);' }
        ],
        music: 'ambient_redroom'
    }
};
