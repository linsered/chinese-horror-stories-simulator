var GT = window.GT || {};

GT.KnowledgeSystem = (function() {
    var _currentCategory = 'all';
    var _searchKeyword = '';

    function init() {}

    function showScreen() {
        var panel = document.getElementById('side-panel');
        if (panel) panel.style.display = 'none';

        var screen = document.getElementById('knowledge-screen');
        screen.style.display = 'flex';
        screen.classList.add('active');

        var gameScreen = document.getElementById('game-screen');
        if (gameScreen && gameScreen.classList.contains('active')) {
            gameScreen.classList.add('overlay-open');
        }

        _renderKnowledge();
    }

    function _renderKnowledge() {
        var categoriesContainer = document.getElementById('knowledge-categories');
        var categories = _getCategories();

        categoriesContainer.innerHTML =
            '<button class="category-btn active" data-category="all">全部</button>';
        categories.forEach(function(cat) {
            categoriesContainer.innerHTML +=
                '<button class="category-btn" data-category="' + cat.id + '">' + cat.name + '</button>';
        });

        categoriesContainer.querySelectorAll('.category-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                categoriesContainer.querySelectorAll('.category-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                _currentCategory = this.dataset.category;
                _renderKnowledgeEntries();
            });
        });

        var searchInput = document.getElementById('knowledge-search-input');
        searchInput.value = _searchKeyword;
        searchInput.oninput = function() {
            _searchKeyword = this.value.trim().toLowerCase();
            _renderKnowledgeEntries();
        };

        _renderKnowledgeEntries();
    }

    function _renderKnowledgeEntries() {
        var entriesContainer = document.getElementById('knowledge-entries');
        entriesContainer.innerHTML = '';

        var collected = GT.State.get('collectedKnowledge') || [];
        var allKnowledge = _getAllKnowledge();

        var filtered = allKnowledge.filter(function(entry) {
            if (collected.indexOf(entry.id) === -1) return false;
            if (_currentCategory !== 'all' && entry.category !== _currentCategory) return false;
            if (_searchKeyword) {
                var keyword = _searchKeyword;
                return entry.name.toLowerCase().indexOf(keyword) !== -1 ||
                    entry.content.toLowerCase().indexOf(keyword) !== -1 ||
                    (entry.tags && entry.tags.some(function(t) { return t.toLowerCase().indexOf(keyword) !== -1; }));
            }
            return true;
        });

        if (filtered.length === 0) {
            entriesContainer.innerHTML = '<div class="empty-message">暂无已收录的知识条目</div>';
            return;
        }

        filtered.forEach(function(entry) {
            var el = document.createElement('div');
            el.className = 'knowledge-entry';
            el.innerHTML =
                '<div class="entry-header">' +
                '<span class="entry-icon">' + (entry.icon || '📚') + '</span>' +
                '<span class="entry-name">' + entry.name + '</span>' +
                '<span class="entry-category">' + _getCategoryName(entry.category) + '</span>' +
                '</div>' +
                '<div class="entry-content">' + entry.content + '</div>' +
                (entry.source ? '<div class="entry-source">来源: ' + entry.source + '</div>' : '') +
                (entry.tags ? '<div class="entry-tags">' + entry.tags.map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>' : '');

            el.addEventListener('click', function() {
                _showEntryDetail(entry);
            });
            entriesContainer.appendChild(el);
        });
    }

    function _showEntryDetail(entry) {
        var panel = document.getElementById('side-panel');
        document.getElementById('panel-title').textContent = entry.name;
        var content = document.getElementById('panel-content');
        content.innerHTML =
            '<div class="knowledge-detail">' +
            '<div class="detail-icon">' + (entry.icon || '📚') + '</div>' +
            '<div class="detail-category">' + _getCategoryName(entry.category) + '</div>' +
            '<div class="detail-content">' + entry.content + '</div>' +
            (entry.extendedContent ? '<div class="detail-extended">' + entry.extendedContent + '</div>' : '') +
            (entry.source ? '<div class="detail-source">来源: ' + entry.source + '</div>' : '') +
            (entry.relatedEntries ? '<div class="detail-related">相关条目: ' + entry.relatedEntries.join(', ') + '</div>' : '') +
            '</div>';
        panel.style.display = 'block';
    }

    function collectKnowledge(entryId) {
        var collected = GT.State.get('collectedKnowledge') || [];
        if (collected.indexOf(entryId) === -1) {
            collected.push(entryId);
            GT.State.set('collectedKnowledge', collected);
            GT.Storage.saveKnowledgeData(collected);
            GT.State.increment('statistics.knowledgeCollected');
            GT.EventBus.emit('knowledge:collected', entryId);
        }
    }

    function collectByEvent(eventId, category) {
        var mapping = {
            'dorm_404': ['kb_campus_horror'],
            'library_ghost': ['kb_campus_horror'],
            'toilet_hanako': ['kb_campus_horror'],
            'lab_noise': ['kb_campus_horror'],
            'night_runner': ['kb_campus_horror'],
            'art_room_portrait': ['kb_campus_horror', 'kb_urban_legend_psychology'],
            'music_room': ['kb_campus_horror'],
            'rooftop_dare': ['kb_campus_horror', 'kb_mass_hysteria'],
            'school_history': ['kb_campus_horror'],
            'corridor_echo': ['kb_campus_horror'],
            'midnight_canteen': ['kb_campus_horror', 'kb_ghost_market'],
            'locker_room': ['kb_campus_horror'],
            'graduation_photo': ['kb_graduation_photo', 'kb_campus_horror'],
            'night_bus': ['kb_kisaragi_station', 'kb_last_subway'],
            'red_room': ['kb_red_room_legend'],
            'kisaragi_station': ['kb_kisaragi_station', 'kb_last_subway'],
            'smile_dog': ['kb_smile_dog'],
            'midnight_stream': ['kb_cctv_anomaly', 'kb_livestream_horror'],
            'curse_chain': ['kb_urban_legend_psychology'],
            'ai_anomaly': ['kb_deepfake', 'kb_code_anomaly'],
            'dark_web_stream': ['kb_dark_web_privacy'],
            'digital_curse': ['kb_urban_legend_psychology', 'kb_red_room_legend'],
            'virtual_idol': ['kb_deepfake'],
            'deepfake_dead': ['kb_deepfake', 'kb_livestream_horror'],
            'ghost_friend': ['kb_dark_web_privacy'],
            'game_npc': ['kb_urban_legend_psychology', 'kb_backrooms'],
            'scp_china': ['kb_scp_china'],
            'backrooms_cn': ['kb_backrooms', 'kb_liminal_space'],
            'silver_mine': ['kb_baiyin_serial'],
            'nanjing_wanderer': ['kb_nanjing_dismemberment'],
            'guangxi_cannibal': ['kb_food_safety'],
            'chongqing_girl': ['kb_red_clothes_boy'],
            'wuhan_virus': ['kb_missing_411'],
            'missing_children': ['kb_human_trafficking'],
            'poison_dumpling': ['kb_food_safety'],
            'black_ambulance': ['kb_black_ambulance', 'kb_organ_trafficking'],
            'cult_sacrifice': ['kb_mass_hysteria', 'kb_sending_gods'],
            'organ_trafficking': ['kb_organ_trafficking'],
            'serial_arson': ['kb_missing_411'],
            'underground_hospital': ['kb_black_ambulance', 'kb_hospital_17'],
            'human_trafficking': ['kb_human_trafficking'],
            'paper_person': ['kb_paper_craft', 'kb_ghost_marriage'],
            'fox_fairy': ['kb_fox_fairy', 'kb_yellow_weasel'],
            'water_ghost': ['kb_water_ghost'],
            'ghost_marriage': ['kb_ghost_marriage', 'kb_spirit_money'],
            'corpse_driver': ['kb_corpse_driving', 'kb_jiangshi'],
            'yellow_weasel': ['kb_yellow_weasel', 'kb_fox_fairy'],
            'ghost_wall': ['kb_ghost_wall'],
            'dream_prophet': ['kb_dream_message', 'kb_sleep_paralysis'],
            'snake_immortal': ['kb_snake_cult', 'kb_sending_gods'],
            'cat_ghost': ['kb_cat_ghost'],
            'ghost_market': ['kb_ghost_market', 'kb_spirit_money'],
            'zombie_jiangshi': ['kb_jiangshi', 'kb_corpse_driving'],
            'midnight_elevator': ['kb_midnight_elevator', 'kb_cctv_anomaly'],
            'red_clothed_woman': ['kb_urban_legend_psychology', 'kb_1995_beijing'],
            'last_subway': ['kb_kisaragi_station', 'kb_last_subway'],
            'ghost_fire_taxi': ['kb_ghost_taxi', 'kb_1995_beijing'],
            'midnight_mirror': ['kb_mirrors_taboo', 'kb_mirror_world']
        };

        var entryIds = mapping[eventId];
        if (entryIds) {
            entryIds.forEach(function(entryId) {
                collectKnowledge(entryId);
            });
        }

        if (category === 'folklore') {
            collectKnowledge('kb_fengshui');
            collectKnowledge('kb_soul_calling');
        }
        if (category === 'campus') {
            collectKnowledge('kb_campus_horror');
            collectKnowledge('kb_3am_phenomenon');
        }
        if (category === 'true_crime') {
            collectKnowledge('kb_missing_411');
            collectKnowledge('kb_collective_fear');
        }
        if (category === 'network') {
            collectKnowledge('kb_urban_legend_psychology');
            collectKnowledge('kb_code_anomaly');
        }
    }

    function _getAllKnowledge() {
        return GT.KnowledgeBaseData ? Object.keys(GT.KnowledgeBaseData).map(function(key) {
            return GT.KnowledgeBaseData[key];
        }) : [];
    }

    function _getCategories() {
        return [
            { id: 'folklore', name: '民间传说' },
            { id: 'urban_legend', name: '都市传说' },
            { id: 'ritual', name: '禁忌仪式' },
            { id: 'supernatural', name: '超自然现象' },
            { id: 'psychology', name: '恐怖心理学' },
            { id: 'case_study', name: '案件研究' },
            { id: 'network', name: '网络怪谈' },
            { id: 'technology', name: '科技恐怖' }
        ];
    }

    function _getCategoryName(categoryId) {
        var categories = _getCategories();
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].id === categoryId) return categories[i].name;
        }
        return categoryId;
    }

    return {
        init: init,
        showScreen: showScreen,
        collectKnowledge: collectKnowledge,
        collectByEvent: collectByEvent
    };
})();
