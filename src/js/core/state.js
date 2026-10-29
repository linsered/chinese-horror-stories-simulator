var GT = window.GT || {};

GT.State = (function() {
    var _state = {};
    var _listeners = {};
    var _history = [];

    var _defaultState = {
        screen: 'loading',
        protagonist: {
            name: '',
            gender: null,
            identity: null
        },
        chapter: 0,
        currentNode: null,
        timeOfDay: '深夜',
        sanity: 100,
        fear: 0,
        knowledge: 0,
        courage: 5,
        perception: 5,
        luck: 5,
        inventory: [],
        flags: {},
        visitedNodes: [],
        completedEvents: [],
        triggeredGhosts: [],
        unlockedAchievements: [],
        unlockedEndings: [],
        collectedGhosts: [],
        collectedKnowledge: [],
        storyProgress: {},
        dialogLog: [],
        ghostEncounterHistory: [],
        identityDifferences: {},
        settings: {
            bgmVolume: 60,
            sfxVolume: 80,
            ambientVolume: 50,
            textSpeed: 3,
            autoSpeed: 3,
            fontSize: 'medium',
            horrorEffects: true,
            fullscreen: false
        },
        statistics: {
            totalPlayTime: 0,
            choicesMade: 0,
            ghostEventsTriggered: 0,
            endingsReached: 0,
            achievementsUnlocked: 0,
            ghostsCollected: 0,
            knowledgeCollected: 0,
            maxFear: 0,
            minSanity: 100,
            savesCount: 0
        }
    };

    function init() {
        var preservedData = {};
        try {
            if (GT.Storage) {
                var rawPlays = localStorage.getItem('gt_persistent_totalPlays');
                if (rawPlays) preservedData.totalPlays = parseInt(rawPlays, 10);
                var rawIdentities = localStorage.getItem('gt_persistent_completedIdentities');
                if (rawIdentities) preservedData.completedIdentities = JSON.parse(rawIdentities);
                if (GT.Storage.loadAchievements) preservedData.unlockedAchievements = GT.Storage.loadAchievements();
                if (GT.Storage.loadEndings) preservedData.unlockedEndings = GT.Storage.loadEndings();
                if (GT.Storage.loadKnowledgeData) preservedData.collectedKnowledge = GT.Storage.loadKnowledgeData();
            }
        } catch(e) {}
        _state = JSON.parse(JSON.stringify(_defaultState));
        _listeners = {};
        _history = [];
        if (preservedData.totalPlays !== undefined) _state.statistics.totalPlays = preservedData.totalPlays;
        if (preservedData.completedIdentities) _state.completedIdentities = preservedData.completedIdentities;
        if (preservedData.unlockedAchievements) _state.unlockedAchievements = preservedData.unlockedAchievements;
        if (preservedData.unlockedEndings) _state.unlockedEndings = preservedData.unlockedEndings;
        if (preservedData.collectedKnowledge) _state.collectedKnowledge = preservedData.collectedKnowledge;
    }

    function get(path) {
        if (!path) return JSON.parse(JSON.stringify(_state));
        var parts = path.split('.');
        var current = _state;
        for (var i = 0; i < parts.length; i++) {
            if (current[parts[i]] === undefined) return undefined;
            current = current[parts[i]];
        }
        return JSON.parse(JSON.stringify(current));
    }

    function set(path, value) {
        var parts = path.split('.');
        var current = _state;
        for (var i = 0; i < parts.length - 1; i++) {
            if (current[parts[i]] === undefined) {
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }
        var oldValue = current[parts[parts.length - 1]];
        current[parts[parts.length - 1]] = value;

        _history.push({
            path: path,
            oldValue: oldValue,
            newValue: value,
            timestamp: Date.now()
        });
        if (_history.length > 1000) {
            _history = _history.slice(-500);
        }

        _notify(path, value, oldValue);
    }

    function update(path, updater) {
        var current = get(path);
        if (typeof updater === 'function') {
            var newValue = updater(current);
            set(path, newValue);
        }
    }

    function increment(path, amount) {
        amount = amount || 1;
        update(path, function(val) {
            return (val || 0) + amount;
        });
    }

    function toggle(path) {
        update(path, function(val) {
            return !val;
        });
    }

    function on(path, callback) {
        if (!_listeners[path]) {
            _listeners[path] = [];
        }
        _listeners[path].push(callback);
        return function() {
            var idx = _listeners[path].indexOf(callback);
            if (idx > -1) {
                _listeners[path].splice(idx, 1);
            }
        };
    }

    function _notify(path, newValue, oldValue) {
        var parts = path.split('.');
        for (var i = parts.length; i > 0; i--) {
            var listenPath = parts.slice(0, i).join('.');
            if (_listeners[listenPath]) {
                _listeners[listenPath].forEach(function(cb) {
                    try {
                        cb(newValue, oldValue, path);
                    } catch (e) {
                        GT.Logger.error('State', 'Listener error for path: ' + listenPath, e);
                    }
                });
            }
        }
        if (_listeners['*']) {
            _listeners['*'].forEach(function(cb) {
                try {
                    cb(newValue, oldValue, path);
                } catch (e) {
                    GT.Logger.error('State', 'Wildcard listener error', e);
                }
            });
        }
    }

    function exportState() {
        return JSON.parse(JSON.stringify(_state));
    }

    function importState(stateObj) {
        _state = JSON.parse(JSON.stringify(stateObj));
        _notify('*', null, null);
    }

    function reset() {
        init();
        _notify('*', null, null);
    }

    function checkCondition(condition) {
        if (!condition) return true;
        if (typeof condition === 'function') {
            try { return condition(_state); } catch (e) { return false; }
        }
        for (var key in condition) {
            if (!condition.hasOwnProperty(key)) continue;
            var condVal = condition[key];
            var stateVal = get(key);

            if (typeof condVal === 'object' && condVal !== null) {
                if (condVal.min !== undefined && stateVal < condVal.min) return false;
                if (condVal.max !== undefined && stateVal > condVal.max) return false;
                if (condVal.eq !== undefined && stateVal !== condVal.eq) return false;
                if (condVal.neq !== undefined && stateVal === condVal.neq) return false;
                if (condVal.in !== undefined && condVal.in.indexOf(stateVal) === -1) return false;
                if (condVal.has !== undefined && Array.isArray(stateVal) && stateVal.indexOf(condVal.has) === -1) return false;
            } else {
                if (stateVal !== condVal) return false;
            }
        }
        return true;
    }

    function applyEffects(effects) {
        if (!effects) return;
        for (var key in effects) {
            if (!effects.hasOwnProperty(key)) continue;
            var effect = effects[key];
            var currentVal = get(key);

            if (typeof effect === 'object' && effect !== null) {
                if (effect.add !== undefined) {
                    set(key, (currentVal || 0) + effect.add);
                } else if (effect.set !== undefined) {
                    set(key, effect.set);
                } else if (effect.toggle !== undefined) {
                    set(key, !currentVal);
                } else if (effect.push !== undefined && Array.isArray(currentVal)) {
                    currentVal.push(effect.push);
                    set(key, currentVal);
                }
            } else {
                set(key, effect);
            }
        }
    }

    function modifySanity(amount) {
        var current = get('sanity');
        var newVal = Math.max(0, Math.min(100, current + amount));
        set('sanity', newVal);
        if (newVal < get('statistics.minSanity')) {
            set('statistics.minSanity', newVal);
        }
        GT.EventBus.emit('state:sanity-changed', newVal, current);
        if (newVal <= 0) {
            GT.EventBus.emit('state:sanity-zero');
        }
    }

    var _fearOverloadProcessing = false;

    function modifyFear(amount) {
        var current = get('fear');
        var actualAmount = amount;
        if (amount > 0) {
            var diminishing = 1.0;
            if (current >= 80) {
                diminishing = 0.4;
            } else if (current >= 60) {
                diminishing = 0.6;
            } else if (current >= 40) {
                diminishing = 0.8;
            }
            actualAmount = Math.max(1, Math.round(amount * diminishing));
        }
        var newVal = Math.max(0, Math.min(100, current + actualAmount));
        set('fear', newVal);
        if (newVal > get('statistics.maxFear')) {
            set('statistics.maxFear', newVal);
        }
        GT.EventBus.emit('state:fear-changed', newVal, current);
        if (newVal >= 100 && !_fearOverloadProcessing) {
            _fearOverloadProcessing = true;
            var overloads = get('fearOverloadCount') || 0;
            overloads++;
            set('fearOverloadCount', overloads);
            if (overloads >= 4) {
                GT.EventBus.emit('state:fear-max');
            } else {
                GT.EventBus.emit('state:fear-warning', overloads);
            }
            _fearOverloadProcessing = false;
        }
    }

    function modifyKnowledge(amount) {
        increment('knowledge', amount);
        GT.EventBus.emit('state:knowledge-changed', get('knowledge'));
    }

    return {
        init: init,
        get: get,
        set: set,
        update: update,
        increment: increment,
        toggle: toggle,
        on: on,
        exportState: exportState,
        importState: importState,
        reset: reset,
        checkCondition: checkCondition,
        applyEffects: applyEffects,
        modifySanity: modifySanity,
        modifyFear: modifyFear,
        modifyKnowledge: modifyKnowledge
    };
})();
