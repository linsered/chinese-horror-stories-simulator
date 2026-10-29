var GT = window.GT || {};

GT.AchievementSystem = (function() {
    var _initialized = false;

    function init() {
        if (_initialized) return;
        _initialized = true;

        GT.EventBus.on('ghost-event:triggered', function() {
            checkGhostAchievements();
            checkMidnightOilAchievement();
        });

        GT.EventBus.on('narrative:layer-changed', function(layer) {
            checkNarrativeAchievements(layer);
        });

        GT.EventBus.on('collection:ghost-collected', function() {
            checkCollectionAchievements();
        });

        GT.EventBus.on('state:sanity-changed', function(newVal) {
            checkSanityAchievements(newVal);
        });

        GT.EventBus.on('state:fear-changed', function(newVal) {
            checkFearAchievements(newVal);
        });

        GT.EventBus.on('state:fear-warning', function(count) {
            unlockAchievement('fear_overload_survivor');
            if (count >= 4) {
                unlockAchievement('triple_overload');
            }
        });

        GT.EventBus.on('knowledge:collected', function() {
            checkKnowledgeAchievements();
        });

        GT.EventBus.on('story:choice-made', function(choice) {
            checkChoiceStreakAchievements(choice);
        });

        GT.EventBus.on('game:started', function() {
            checkPlayCountAchievements();
        });

        GT.EventBus.on('ending:triggered', function(endingId) {
            checkEndingAchievements(endingId);
            checkIdentityEndingAchievements();
            checkLowFearAchievement();
        });
    }

    function unlockAchievement(achievementId) {
        var unlocked = GT.State.get('unlockedAchievements') || [];
        if (unlocked.indexOf(achievementId) !== -1) return;

        var achievement = GT.AchievementData[achievementId];
        if (!achievement) return;

        unlocked.push(achievementId);
        GT.State.set('unlockedAchievements', unlocked);
        GT.State.increment('statistics.achievementsUnlocked');
        GT.Storage.saveAchievements(unlocked);

        GT.Engine.showAchievementPopup(achievement);
        GT.EventBus.emit('achievement:unlocked', achievementId, achievement);
    }

    function checkGhostAchievements() {
        var triggered = (GT.State.get('triggeredGhosts') || []).length;
        if (triggered >= 1) unlockAchievement('first_encounter');
        if (triggered >= 5) unlockAchievement('ghost_seeker');
        if (triggered >= 10) unlockAchievement('ghost_hunter');
        if (triggered >= 20) unlockAchievement('ghost_master');
    }

    function checkCollectionAchievements() {
        var collected = (GT.State.get('collectedGhosts') || []).length;
        if (collected >= 1) unlockAchievement('first_collection');
        if (collected >= 5) unlockAchievement('collector');
        if (collected >= 10) unlockAchievement('archivist');
        if (collected >= 20) unlockAchievement('encyclopedist');
    }

    function checkNarrativeAchievements(layer) {
        if (layer === 'shallow') unlockAchievement('surface_broken');
        if (layer === 'middle') unlockAchievement('truth_seeker');
        if (layer === 'deep') unlockAchievement('abyss_watcher');
        if (layer === 'abyss') unlockAchievement('beyond_abyss');
    }

    function checkSanityAchievements(sanity) {
        if (sanity <= 50) unlockAchievement('mind_fractured');
        if (sanity <= 25) unlockAchievement('madness_door');
        if (sanity <= 10) unlockAchievement('abyss_gaze');
    }

    function checkFearAchievements(fear) {
        if (fear >= 50) unlockAchievement('fear_rising');
        if (fear >= 75) unlockAchievement('terror_grip');
        if (fear >= 90) unlockAchievement('paralyzed');
    }

    function checkEndingAchievements(endingId) {
        var unlocked = GT.State.get('unlockedEndings') || [];
        if (unlocked.length >= 1) unlockAchievement('first_ending');
        if (unlocked.length >= 5) unlockAchievement('ending_seeker');
        if (unlocked.length >= 10) unlockAchievement('ending_collector');
        if (unlocked.length >= 20) unlockAchievement('ending_master');

        var ending = GT.EndingData[endingId];
        if (ending && ending.type === 'hidden') unlockAchievement('hidden_truth');
        if (ending && ending.type === 'true') unlockAchievement('true_ending');
        if (endingId === 'fear_overload') unlockAchievement('full_fear');
    }

    function checkKnowledgeAchievements() {
        var collected = (GT.State.get('collectedKnowledge') || []).length;
        if (collected >= 30) unlockAchievement('knowledge_is_power');
        var total = GT.KnowledgeBaseData ? Object.keys(GT.KnowledgeBaseData).length : 0;
        if (total > 0 && collected >= total) unlockAchievement('walking_encyclopedia');
    }

    function checkIdentityEndingAchievements() {
        var identity = GT.State.get('protagonist.identity');
        var completedIdentities = GT.State.get('completedIdentities') || [];
        if (completedIdentities.indexOf(identity) === -1) {
            completedIdentities.push(identity);
            GT.State.set('completedIdentities', completedIdentities);
            try { localStorage.setItem('gt_persistent_completedIdentities', JSON.stringify(completedIdentities)); } catch(e) {}
        }
        if (identity === 'night_watchman' || identity === 'programmer') {
            unlockAchievement('social_animal');
        }
        if (identity === 'delivery_rider') {
            unlockAchievement('food_delivery_master');
        }
        if (identity === 'taxi_driver') {
            unlockAchievement('night_rider');
        }
        var allIdentities = ['night_watchman','college_student','delivery_rider','journalist','doctor','streamer','taxi_driver','archaeologist','programmer','funeral_director','teacher'];
        if (completedIdentities.length >= allIdentities.length) {
            var hasAll = true;
            allIdentities.forEach(function(id) {
                if (completedIdentities.indexOf(id) === -1) hasAll = false;
            });
            if (hasAll) unlockAchievement('identity_crisis');
        }
    }

    function checkLowFearAchievement() {
        var maxFear = GT.State.get('statistics.maxFear') || 0;
        if (maxFear < 20) unlockAchievement('not_afraid');
    }

    function checkMidnightOilAchievement() {
        var hour = new Date().getHours();
        if (hour >= 2 && hour < 4) {
            var midnightCount = GT.State.get('statistics.midnightEvents') || 0;
            midnightCount++;
            GT.State.set('statistics.midnightEvents', midnightCount);
            if (midnightCount >= 3) unlockAchievement('midnight_oil');
        }
    }

    function checkChoiceStreakAchievements(choice) {
        if (!choice) return;
        var braveCount = GT.State.get('statistics.braveStreak') || 0;
        var avoidCount = GT.State.get('statistics.avoidStreak') || 0;
        var effects = choice.effects || {};
        var isBrave = effects.courage && effects.courage.add > 0;
        var isAvoid = false;
        if (choice.text) {
            var t = choice.text;
            if (t.indexOf('逃跑') >= 0 || t.indexOf('离开') >= 0 || t.indexOf('拒绝') >= 0 ||
                t.indexOf('回避') >= 0 || t.indexOf('无视') >= 0 || t.indexOf('闭眼') >= 0 ||
                t.indexOf('捂住') >= 0 || t.indexOf('转身') >= 0) {
                isAvoid = true;
            }
        }
        if (isBrave) {
            braveCount++;
            avoidCount = 0;
        } else if (isAvoid) {
            avoidCount++;
            braveCount = 0;
        } else {
            braveCount = 0;
            avoidCount = 0;
        }
        GT.State.set('statistics.braveStreak', braveCount);
        GT.State.set('statistics.avoidStreak', avoidCount);
        if (braveCount >= 5) unlockAchievement('brave_heart');
        if (avoidCount >= 5) unlockAchievement('always_running');
    }

    function checkPlayCountAchievements() {
        var playCount = GT.State.get('statistics.totalPlays') || 0;
        playCount++;
        GT.State.set('statistics.totalPlays', playCount);
        try { localStorage.setItem('gt_persistent_totalPlays', playCount.toString()); } catch(e) {}
        if (playCount >= 2) unlockAchievement('see_you_again');
        if (playCount >= 5) unlockAchievement('veteran');
    }

    function showScreen() {
        var panel = document.getElementById('side-panel');
        if (panel) panel.style.display = 'none';

        var screen = document.getElementById('achievement-screen');
        screen.style.display = 'flex';
        screen.classList.add('active');

        var gameScreen = document.getElementById('game-screen');
        if (gameScreen && gameScreen.classList.contains('active')) {
            gameScreen.classList.add('overlay-open');
        }

        _renderAchievements();
    }

    function _renderAchievements() {
        var progress = document.getElementById('achievement-progress');
        var unlocked = GT.State.get('unlockedAchievements') || [];
        var total = Object.keys(GT.AchievementData || {}).length;
        progress.innerHTML =
            '<div class="achievement-stat">已解锁: ' + unlocked.length + ' / ' + total + '</div>' +
            '<div class="achievement-progress-bar"><div class="achievement-progress-fill" style="width: ' +
            (total > 0 ? (unlocked.length / total * 100) : 0) + '%"></div></div>';

        var grid = document.getElementById('achievement-grid');
        grid.innerHTML = '';

        for (var id in GT.AchievementData) {
            if (!GT.AchievementData.hasOwnProperty(id)) continue;
            var ach = GT.AchievementData[id];
            var isUnlocked = unlocked.indexOf(id) !== -1;

            var card = document.createElement('div');
            card.className = 'achievement-card' + (isUnlocked ? ' unlocked' : ' locked');
            card.innerHTML =
                '<div class="ach-icon">' + (isUnlocked ? ach.icon : '🔒') + '</div>' +
                '<div class="ach-name">' + (isUnlocked ? ach.name : '???') + '</div>' +
                '<div class="ach-desc">' + (isUnlocked ? ach.description : ach.hint || '未解锁') + '</div>' +
                '<div class="ach-condition">' + (isUnlocked ? '✓ 已达成' : ach.condition || '条件未知') + '</div>';
            grid.appendChild(card);
        }
    }

    return {
        init: init,
        unlockAchievement: unlockAchievement,
        checkGhostAchievements: checkGhostAchievements,
        checkCollectionAchievements: checkCollectionAchievements,
        checkNarrativeAchievements: checkNarrativeAchievements,
        checkSanityAchievements: checkSanityAchievements,
        checkFearAchievements: checkFearAchievements,
        checkEndingAchievements: checkEndingAchievements,
        showScreen: showScreen
    };
})();
