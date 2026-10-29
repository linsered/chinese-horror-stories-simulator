var GT = window.GT || {};

GT.StorySystem = (function() {
    var _currentNode = null;
    var _storyData = {};
    var _dailyLifeData = {};
    var _isAdvancing = false;
    var _dailyLifeUsed = {};
    var _pendingDailyCount = 0;
    var _inDailyLife = false;
    var _advancingSince = 0;
    var _ADVANCING_TIMEOUT = 15000;

    function init() {
        _storyData = {};
        _dailyLifeData = {};
        _dailyLifeUsed = {};
        _pendingDailyCount = 0;
        _inDailyLife = false;
        _isAdvancing = false;
        _advancingSince = 0;
        var sources = [GT.ChapterData, GT.Chapter2Data, GT.Chapter3Data, GT.Chapter4Data, GT.Chapter5Data];
        sources.forEach(function(src) {
            if (src) {
                Object.keys(src).forEach(function(key) {
                    _storyData[key] = src[key];
                });
            }
        });
        if (GT.DailyLifeData) {
            Object.keys(GT.DailyLifeData).forEach(function(identityKey) {
                var identityData = GT.DailyLifeData[identityKey];
                if (identityData) {
                    Object.keys(identityData).forEach(function(nodeKey) {
                        _dailyLifeData[nodeKey] = identityData[nodeKey];
                    });
                }
            });
        }
    }

    function startStory(identityId) {
        init();
        _isAdvancing = false;
        _currentNode = 'prologue_01';
        GT.State.set('currentNode', _currentNode);
        GT.State.set('chapter', 0);
        _processNode();
    }

    function _checkAdvancingTimeout() {
        if (_isAdvancing && _advancingSince > 0) {
            var elapsed = Date.now() - _advancingSince;
            if (elapsed > _ADVANCING_TIMEOUT) {
                GT.Logger.warn('Story', 'Advancing timeout detected (' + elapsed + 'ms), resetting');
                _isAdvancing = false;
                _advancingSince = 0;
            }
        }
    }

    function advance() {
        if (!_currentNode) return;

        if (GT.GhostEventSystem && GT.GhostEventSystem.isInEvent && GT.GhostEventSystem.isInEvent()) return;

        _checkAdvancingTimeout();

        if (_isAdvancing) return;

        var node = _getNode(_currentNode);
        if (!node) {
            GT.Logger.error('Story', 'Node not found in advance: ' + _currentNode);
            _returnToMainStory();
            return;
        }

        if (_inDailyLife && !node.next && !node.choices) {
            var queue = GT.State.get('_dailyQueue') || [];
            if (queue.length > 0) {
                _continueDailyLife();
            } else {
                _inDailyLife = false;
                _returnToMainStory();
            }
            return;
        }

        if (node.next) {
            if (node.next === '_identity_start') {
                _jumpToIdentityChapter();
                return;
            }
            if (node.next === '_daily_life') {
                _insertDailyLife();
                return;
            }
            if (node.next === '_afterstory') {
                _insertAfterstory();
                return;
            }
            if (node.next === '_continue_daily') {
                _continueDailyLife();
                return;
            }
            _currentNode = node.next;
            GT.State.set('currentNode', _currentNode);
            _processNode();
        } else if (node.choices && node.choices.length > 0) {
            showChoices(node.choices);
        } else {
            GT.Logger.warn('Story', 'Node has no next or choices: ' + _currentNode + ', attempting recovery');
            _inDailyLife = false;
            _returnToMainStory();
        }
    }

    function cancelAdvancement() {
        _isAdvancing = false;
        _advancingSince = 0;
    }

    function _jumpToIdentityChapter() {
        _currentNode = 'ch1_intro';
        GT.State.set('currentNode', _currentNode);
        GT.State.set('chapter', 1);
        _processNode();
    }

    function _insertDailyLife() {
        var identityId = GT.State.get('protagonist.identity');
        var chapter = GT.State.get('chapter');

        if (!_dailyLifeUsed[identityId]) {
            _dailyLifeUsed[identityId] = [];
        }

        var dailyKey = 'ch' + chapter + '_daily_';
        var identityDailyData = GT.DailyLifeData && GT.DailyLifeData[identityId];
        var availableNodes = [];

        if (identityDailyData) {
            for (var ik in identityDailyData) {
                if (identityDailyData.hasOwnProperty(ik) && ik.indexOf(dailyKey) === 0) {
                    if (_dailyLifeUsed[identityId].indexOf(ik) === -1) {
                        availableNodes.push(ik);
                    }
                }
            }
        }

        if (availableNodes.length > 0) {
            var count = Math.min(2 + Math.floor(Math.random() * 2), availableNodes.length);
            var selected = [];
            var pool = availableNodes.slice();
            for (var i = 0; i < count && pool.length > 0; i++) {
                var idx = Math.floor(Math.random() * pool.length);
                selected.push(pool[idx]);
                _dailyLifeUsed[identityId].push(pool[idx]);
                pool.splice(idx, 1);
            }

            _pendingDailyCount = selected.length;
            _inDailyLife = true;
            _currentNode = selected[0];
            GT.State.set('currentNode', _currentNode);
            GT.State.set('_dailyQueue', selected.slice(1));
            _processNode();
        } else {
            _returnToMainStory();
        }
    }

    function _continueDailyLife() {
        var queue = GT.State.get('_dailyQueue') || [];
        if (queue.length > 0) {
            var nextDaily = queue.shift();
            GT.State.set('_dailyQueue', queue);
            _currentNode = nextDaily;
            GT.State.set('currentNode', _currentNode);
            _processNode();
        } else {
            _inDailyLife = false;
            _returnToMainStory();
        }
    }

    function _insertAfterstory() {
        var horrorId = _currentNode;
        var afterstoryKey = horrorId + '_after';
        var afterstoryNode = _storyData[afterstoryKey];

        if (afterstoryNode) {
            _currentNode = afterstoryKey;
            GT.State.set('currentNode', _currentNode);
            _processNode();
        } else {
            _insertDailyLife();
        }
    }

    function _returnToMainStory() {
        var chapter = GT.State.get('chapter');
        var chapterKey = 'ch' + chapter + '_';
        var visited = GT.State.get('visitedNodes') || [];

        var candidates = [];
        for (var key in _storyData) {
            if (_storyData.hasOwnProperty(key) && key.indexOf(chapterKey) === 0) {
                if (visited.indexOf(key) === -1) {
                    var node = _storyData[key];
                    if (node.text && (node.text.indexOf('\u3010\u602a\u8c08') === 0 || node.text.indexOf('\u3010\u7ec8\u7ae0') === 0 || node.text.indexOf('\u3010\u6700\u7ec8') === 0)) {
                        var numMatch = key.match(/ch\d+_(\d+)/);
                        var num = numMatch ? parseInt(numMatch[1], 10) : 999;
                        candidates.push({ key: key, num: num });
                    }
                }
            }
        }

        candidates.sort(function(a, b) { return a.num - b.num; });

        if (candidates.length > 0) {
            _currentNode = candidates[0].key;
            GT.State.set('currentNode', _currentNode);
            _processNode();
        } else {
            var nextChapter = chapter + 1;
            var nextChapterIntro = 'ch' + nextChapter + '_intro';
            if (_storyData[nextChapterIntro]) {
                _currentNode = nextChapterIntro;
                GT.State.set('currentNode', _currentNode);
                GT.State.set('chapter', nextChapter);
                _processNode();
            } else {
                _isAdvancing = false;
                _advancingSince = 0;
            }
        }
    }

    function _getNode(nodeId) {
        if (_storyData[nodeId]) return _storyData[nodeId];

        var identityId = GT.State.get('protagonist.identity');
        if (identityId && GT.DailyLifeData && GT.DailyLifeData[identityId] && GT.DailyLifeData[identityId][nodeId]) {
            return GT.DailyLifeData[identityId][nodeId];
        }

        return _dailyLifeData[nodeId] || null;
    }

    function _isDailyNode(nodeId) {
        if (_dailyLifeData[nodeId]) return true;
        var identityId = GT.State.get('protagonist.identity');
        if (identityId && GT.DailyLifeData && GT.DailyLifeData[identityId] && GT.DailyLifeData[identityId][nodeId]) {
            return true;
        }
        return false;
    }

    function isInDailyLife() {
        return _inDailyLife;
    }

    function _processNode(skipEffects) {
        var node = _getNode(_currentNode);
        if (!node) {
            GT.Logger.error('Story', 'Node not found: ' + _currentNode);
            _isAdvancing = false;
            _advancingSince = 0;
            _returnToMainStory();
            return;
        }

        _isAdvancing = true;
        _advancingSince = Date.now();

        try {
            if (node.scene) {
                GT.Engine.updateScene(node.scene);
            }

            if (node.chapter !== undefined) {
                GT.State.set('chapter', node.chapter);
                var chapterEl = document.getElementById('chapter-info');
                if (chapterEl) {
                    chapterEl.textContent = node.chapter === 0 ? '\u5e8f\u7ae0' : '\u7b2c' + node.chapter + '\u7ae0';
                }
            }

            if (node.timeOfDay) {
                GT.State.set('timeOfDay', node.timeOfDay);
            }

            if (node.layer && GT.NarrativeSystem) {
                GT.NarrativeSystem.setLayer(node.layer);
            }

            if (!skipEffects) {
                if (node.effects) {
                    GT.State.applyEffects(node.effects);
                }

                if (node.sanityChange) {
                    GT.State.modifySanity(node.sanityChange);
                }
                if (node.fearChange) {
                    GT.State.modifyFear(node.fearChange);
                }
                if (node.knowledgeChange) {
                    GT.State.modifyKnowledge(node.knowledgeChange);
                }

                if (node.knowledgeEntry && GT.KnowledgeSystem && GT.KnowledgeSystem.collectKnowledge) {
                    if (Array.isArray(node.knowledgeEntry)) {
                        node.knowledgeEntry.forEach(function(entryId) {
                            GT.KnowledgeSystem.collectKnowledge(entryId);
                        });
                    } else {
                        GT.KnowledgeSystem.collectKnowledge(node.knowledgeEntry);
                    }
                }

                if (node.narrativeClue && GT.NarrativeSystem) {
                    GT.NarrativeSystem.addClue(node.narrativeClue.id, node.narrativeClue);
                }
            }
        } catch (e) {
            GT.Logger.error('Story', 'Error processing node effects: ' + e.message);
        }

        var text = node.text || '';
        var identityId = GT.State.get('protagonist.identity');
        if (node.identityIntro && node.identityIntro[identityId]) {
            text = node.identityIntro[identityId] + text;
        }
        if (node.identityText && node.identityText[identityId]) {
            text = node.identityText[identityId];
        }

        var speaker = node.speaker || '';
        GT.Engine.addToDialogLog(speaker, text);

        var speakerEl = document.getElementById('speaker-name');
        if (speakerEl) {
            speakerEl.textContent = speaker;
            speakerEl.style.display = speaker ? 'block' : 'none';
        }

        var dialogueTextEl = document.getElementById('dialogue-text');
        if (!dialogueTextEl) {
            _isAdvancing = false;
            _advancingSince = 0;
            return;
        }

        var processedNodeId = _currentNode;
        var processedNode = node;

        GT.Typewriter.type(dialogueTextEl, text, function() {
            _isAdvancing = false;
            _advancingSince = 0;

            if (GT.GhostEventSystem && GT.GhostEventSystem.isInEvent && GT.GhostEventSystem.isInEvent()) {
                return;
            }

            if (processedNode.choices && processedNode.choices.length > 0) {
                showChoices(processedNode.choices);
            } else if (processedNode.ghostEvent) {
                GT.GhostEventSystem.triggerEvent(processedNode.ghostEvent);
            } else if (processedNode.ending) {
                GT.EndingSystem.triggerEnding(processedNode.ending);
            } else if (processedNode.next === '_daily_life') {
                _insertDailyLife();
            } else if (processedNode.next === '_afterstory') {
                _insertAfterstory();
            } else if (processedNode.next === '_continue_daily') {
                _continueDailyLife();
            } else if (!processedNode.next && _isDailyNode(processedNodeId)) {
                _inDailyLife = true;
            }
        });

        GT.Engine.updateStatus();

        if (node.horrorEffect && GT.AnimationSystem) {
            GT.AnimationSystem.triggerEffect(node.horrorEffect);
        }
        if (node.sfx && GT.AudioSystem) {
            GT.AudioSystem.playSFX(node.sfx);
        }
        if (node.bgm && GT.AudioSystem) {
            GT.AudioSystem.playBGM(node.bgm);
        }
        if (node.ambient && GT.AudioSystem) {
            GT.AudioSystem.stopAmbient();
            GT.AudioSystem.playAmbient(node.ambient);
        }

        if (node.cinematic && GT.CinematicSystem) {
            GT.CinematicSystem.processDirectives(node.cinematic);
        }

        var visited = GT.State.get('visitedNodes') || [];
        if (visited.indexOf(_currentNode) === -1) {
            visited.push(_currentNode);
            GT.State.set('visitedNodes', visited);
        }
    }

    function showChoices(choices) {
        var container = document.getElementById('choices-container');
        if (!container) return;
        container.innerHTML = '';
        container.style.display = 'flex';

        var dialogueContainer = document.getElementById('dialogue-container');
        if (dialogueContainer) {
            dialogueContainer.style.pointerEvents = 'none';
            dialogueContainer.classList.add('choices-active');
        }

        var identityId = GT.State.get('protagonist.identity');
        var visibleCount = 0;

        choices.forEach(function(choice, index) {
            if (choice.condition && !GT.State.checkCondition(choice.condition)) return;
            if (choice.requiredIdentity && choice.requiredIdentity !== identityId) return;
            if (choice.requiredClue && GT.NarrativeSystem && !GT.NarrativeSystem.hasClue(choice.requiredClue)) return;

            visibleCount++;
            var btn = document.createElement('button');
            btn.className = 'choice-btn';

            var choiceText = choice.text;
            if (choice.identityText && choice.identityText[identityId]) {
                choiceText = choice.identityText[identityId];
            }

            if (choice.isIdentitySpecific) {
                btn.classList.add('identity-choice');
            }
            if (choice.isShortEnding) {
                btn.classList.add('short-ending-choice');
            }

            btn.textContent = choiceText;
            btn.style.animationDelay = (visibleCount * 0.1) + 's';
            btn.addEventListener('click', function() {
                _onChoiceSelected(choice);
            });
            container.appendChild(btn);
        });

        if (visibleCount === 0) {
            container.style.display = 'none';
            if (dialogueContainer) {
                dialogueContainer.style.pointerEvents = 'auto';
                dialogueContainer.classList.remove('choices-active');
            }
            GT.Logger.warn('Story', 'All choices filtered out for node: ' + _currentNode);
            _inDailyLife = false;
            _returnToMainStory();
        }
    }

    function _onChoiceSelected(choice) {
        var container = document.getElementById('choices-container');
        if (container) container.style.display = 'none';

        var dialogueContainer = document.getElementById('dialogue-container');
        if (dialogueContainer) {
            dialogueContainer.style.pointerEvents = 'auto';
            dialogueContainer.classList.remove('choices-active');
        }

        if (GT.AudioSystem) GT.AudioSystem.playSFX('click');

        GT.EventBus.emit('story:choice-made', choice);

        if (choice.effects) {
            GT.State.applyEffects(choice.effects);
        }
        if (choice.sanityChange) {
            GT.State.modifySanity(choice.sanityChange);
        }
        if (choice.fearChange) {
            GT.State.modifyFear(choice.fearChange);
        }
        if (choice.knowledgeChange) {
            GT.State.modifyKnowledge(choice.knowledgeChange);
        }
        if (choice.knowledgeEntry && GT.KnowledgeSystem && GT.KnowledgeSystem.collectKnowledge) {
            if (Array.isArray(choice.knowledgeEntry)) {
                choice.knowledgeEntry.forEach(function(entryId) {
                    GT.KnowledgeSystem.collectKnowledge(entryId);
                });
            } else {
                GT.KnowledgeSystem.collectKnowledge(choice.knowledgeEntry);
            }
        }
        if (choice.narrativeClue && GT.NarrativeSystem) {
            GT.NarrativeSystem.addClue(choice.narrativeClue.id, choice.narrativeClue);
        }

        if (choice.ending) {
            GT.EndingSystem.triggerEnding(choice.ending);
            return;
        }

        if (choice.next) {
            if (choice.next === '_identity_start') {
                _jumpToIdentityChapter();
                return;
            }
            if (choice.next === '_daily_life') {
                _insertDailyLife();
                return;
            }
            if (choice.next === '_afterstory') {
                _insertAfterstory();
                return;
            }
            _currentNode = choice.next;
            GT.State.set('currentNode', _currentNode);
            _processNode();
        }

        GT.Engine.updateStatus();
    }

    function getCurrentNode() {
        return _currentNode;
    }

    function resumeFromNode(nodeId) {
        init();
        _isAdvancing = false;
        _advancingSince = 0;
        _currentNode = nodeId;
        _processNode();
    }

    // 恐惧警告后恢复：重新渲染当前（或指定）节点，不推进到下一节点
    function showNode(nodeId) {
        _isAdvancing = false;
        _advancingSince = 0;
        if (nodeId && typeof nodeId === 'string') {
            _currentNode = nodeId;
            GT.State.set('currentNode', nodeId);
        }
        if (!_currentNode) {
            _returnToMainStory();
            return;
        }
        _processNode(true);
    }

    return {
        init: init,
        startStory: startStory,
        advance: advance,
        showChoices: showChoices,
        getCurrentNode: getCurrentNode,
        resumeFromNode: resumeFromNode,
        showNode: showNode,
        isInDailyLife: isInDailyLife,
        cancelAdvancement: cancelAdvancement
    };
})();
