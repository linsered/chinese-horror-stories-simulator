var GT = window.GT || {};

GT.GhostEventSystem = (function() {
    var _activeEvents = [];
    var _eventCooldown = 0;
    var _cooldownDuration = 25000;
    var _isInEvent = false;
    var _savedStoryNode = null;
    var _currentEventId = null;
    var _eventStartTime = 0;
    var _currentNodeIndex = 0;
    var _currentEvent = null;
    var _EVENT_TIMEOUT = 300000;
    var _waitingForClick = false;
    var _triggeredEventIds = [];

    var _transitionTexts = [
        '\u4f60\u5ffd\u7136\u611f\u5230\u4e00\u9635\u83ab\u540d\u7684\u5bd2\u610f\uff0c\u50cf\u662f\u6709\u4ec0\u4e48\u4e1c\u897f\u6b63\u5728\u9760\u8fd1......',
        '\u5468\u56f4\u7684\u7a7a\u6c14\u4f3c\u4e4e\u51dd\u56fa\u4e86\u4e00\u77ac\uff0c\u4f60\u4e0b\u610f\u8bc6\u5730\u505c\u4e0b\u4e86\u811a\u6b65......',
        '\u4e00\u9635\u4e0d\u534f\u8c03\u7684\u58f0\u54cd\u6253\u65ad\u4e86\u4f60\u7684\u601d\u7eea\uff0c\u4f60\u62ac\u8d77\u5934\u2014\u2014',
        '\u4f60\u7684\u540e\u9888\u7a81\u7136\u53d1\u51c9\uff0c\u4eff\u4f5b\u6709\u4eba\u5728\u80cc\u540e\u6ce8\u89c6\u7740\u4f60......',
        '\u4f60\u611f\u5230\u4e00\u9635\u604d\u60da\uff0c\u773c\u524d\u7684\u666f\u8c61\u4f3c\u4e4e\u53d1\u751f\u4e86\u5fae\u5999\u7684\u53d8\u5316......',
        '\u4e00\u9635\u82e5\u6709\u82e5\u65e0\u7684\u4f4e\u8bed\u4f20\u5165\u4f60\u7684\u8033\u4e2d\uff0c\u4f60\u4e0d\u7531\u5f97\u5c4f\u4f4f\u4e86\u547c\u5438......',
        '\u4f60\u7a81\u7136\u89c9\u5f97\u5468\u56f4\u5b89\u9759\u5f97\u4e0d\u6b63\u5e38\uff0c\u8fde\u866b\u9e23\u58f0\u90fd\u6d88\u5931\u4e86......',
        '\u4f60\u7684\u5fc3\u8df3\u83ab\u540d\u52a0\u901f\uff0c\u4e00\u79cd\u8bf4\u4e0d\u51fa\u7684\u4e0d\u5b89\u6d8c\u4e0a\u5fc3\u5934......'
    ];

    var _identityCategoryMap = {
        night_watchman: ['urban_legend', 'true_crime', 'folklore'],
        college_student: ['campus', 'network', 'folklore'],
        delivery_rider: ['urban_legend', 'true_crime', 'folklore'],
        journalist: ['true_crime', 'urban_legend', 'network'],
        doctor: ['true_crime', 'folklore', 'campus'],
        streamer: ['network', 'urban_legend', 'campus'],
        taxi_driver: ['urban_legend', 'folklore', 'true_crime'],
        archaeologist: ['folklore', 'true_crime', 'campus'],
        programmer: ['network', 'urban_legend', 'true_crime'],
        funeral_director: ['folklore', 'true_crime', 'urban_legend'],
        teacher: ['campus', 'folklore', 'true_crime']
    };

    var _comfortCooldown = 0;
    var _comfortCooldownDuration = 60000;
    var _triggeredComfortIds = [];

    var _comfortTransitionTexts = [
        '\u4f60\u611f\u5230\u4e00\u9635\u8f7b\u677e\uff0c\u50cf\u662f\u6709\u4ec0\u4e48\u6e29\u6696\u7684\u4e1c\u897f\u6b63\u5728\u9760\u8fd1......',
        '\u5468\u56f4\u7684\u7a7a\u6c14\u4f3c\u4e4e\u67d4\u548c\u4e86\u4e00\u4e9b\uff0c\u4f60\u7684\u5fc3\u60c5\u4e5f\u8ddf\u7740\u597d\u8f6c\u4e86......',
        '\u4e00\u7f15\u6e29\u6696\u7684\u5149\u7ebf\u900f\u8fc7\u4e91\u5c42\u7167\u5728\u4f60\u8eab\u4e0a\uff0c\u4f60\u6df1\u5438\u4e00\u53e3\u6c14......',
        '\u4f60\u5ffd\u7136\u89c9\u5f97\u8eab\u4f53\u8f7b\u4e86\u4e00\u4e9b\uff0c\u50cf\u662f\u653e\u4e0b\u4e86\u4ec0\u4e48\u91cd\u62c5......',
        '\u4e00\u9635\u5fae\u98ce\u5439\u8fc7\uff0c\u5e26\u6765\u4e86\u4e00\u4e1d\u82b1\u9999\uff0c\u4f60\u7684\u7d27\u5f20\u611f\u7f13\u89e3\u4e86\u4e0d\u5c11......'
    ];

    function init() {
        _triggeredEventIds = GT.State.get('triggeredGhosts') || [];
        _triggeredComfortIds = GT.State.get('triggeredComforts') || [];
    }

    function checkAndTrigger() {
        if (_isInEvent) {
            if (_eventStartTime > 0 && Date.now() - _eventStartTime > _EVENT_TIMEOUT) {
                GT.Logger.warn('GhostEvent', 'Event timeout, forcing reset');
                _forceResetEvent();
            }
            return;
        }

        var fear = GT.State.get('fear');

        if (_comfortCooldown > 0) {
            _comfortCooldown -= 1000;
        } else if (fear >= 8 && fear < 85) {
            var comfortChance = 0.04 + fear * 0.002;
            if (fear >= 30) comfortChance += 0.03;
            if (fear >= 50) comfortChance += 0.05;
            if (fear >= 70) comfortChance += 0.08;

            if (Math.random() < comfortChance) {
                _triggerComfortEvent();
                return;
            }
        }

        if (_eventCooldown > 0) {
            _eventCooldown -= 1000;
            return;
        }

        var sanity = GT.State.get('sanity');
        var perception = GT.State.get('perception');

        var triggerChance = 0.03;
        triggerChance += (100 - sanity) * 0.0008;
        triggerChance += fear * 0.0006;
        triggerChance += perception * 0.0004;

        if (GT.StorySystem && GT.StorySystem.isInDailyLife && GT.StorySystem.isInDailyLife()) {
            triggerChance *= 3;
        }

        if (Math.random() < triggerChance) {
            _triggerRandomEvent();
        }
    }

    function _triggerComfortEvent() {
        if (!GT.ComfortEventData) return;

        var available = [];
        for (var key in GT.ComfortEventData) {
            if (GT.ComfortEventData.hasOwnProperty(key)) {
                if (_triggeredComfortIds.indexOf(key) === -1) {
                    available.push(GT.ComfortEventData[key]);
                }
            }
        }

        if (available.length === 0) {
            _triggeredComfortIds = [];
            available = [];
            for (var k in GT.ComfortEventData) {
                if (GT.ComfortEventData.hasOwnProperty(k)) {
                    available.push(GT.ComfortEventData[k]);
                }
            }
        }

        if (available.length === 0) return;

        var event = available[Math.floor(Math.random() * available.length)];

        _isInEvent = true;
        _savedStoryNode = GT.State.get('currentNode');

        if (GT.StorySystem && GT.StorySystem.cancelAdvancement) {
            GT.StorySystem.cancelAdvancement();
        }

        _showComfortTransition(event);
    }

    function _showComfortTransition(event) {
        if (GT.Typewriter && GT.Typewriter.isTyping()) {
            GT.Typewriter.finish();
        }

        if (GT.StorySystem && GT.StorySystem.cancelAdvancement) {
            GT.StorySystem.cancelAdvancement();
        }

        var choicesContainer = document.getElementById('choices-container');
        if (choicesContainer) choicesContainer.style.display = 'none';

        var transitionText = _comfortTransitionTexts[Math.floor(Math.random() * _comfortTransitionTexts.length)];

        var dialogueTextEl = document.getElementById('dialogue-text');
        var speakerEl = document.getElementById('speaker-name');
        if (speakerEl) speakerEl.textContent = '';

        _waitingForClick = false;

        GT.Typewriter.type(dialogueTextEl, transitionText, function() {
            _waitingForClick = true;
            var indicator = document.getElementById('dialogue-indicator');
            if (indicator) indicator.style.display = 'block';

            var dialogueContainer = document.getElementById('dialogue-container');
            if (dialogueContainer) {
                dialogueContainer.style.pointerEvents = 'auto';
                dialogueContainer.classList.remove('choices-active');
                dialogueContainer.onclick = function() {
                    if (!_waitingForClick) return;
                    _waitingForClick = false;
                    dialogueContainer.onclick = null;
                    _startComfortEvent(event);
                };
            }
        });
    }

    function _startComfortEvent(event) {
        _currentEventId = event.id;
        _eventStartTime = Date.now();
        _waitingForClick = false;

        try {
            GT.State.modifyFear(event.fearChange || -3);
            GT.State.modifySanity(event.sanityChange || 2);

            _triggeredComfortIds.push(event.id);
            GT.State.set('triggeredComforts', _triggeredComfortIds);

            _comfortCooldown = _comfortCooldownDuration;

            GT.State.increment('statistics.comfortEventsTriggered');

            GT.EventBus.emit('comfort-event:triggered', event);
        } catch (e) {
            GT.Logger.error('GhostEvent', 'Error in comfort event: ' + e.message);
        }

        var dialogueTextEl = document.getElementById('dialogue-text');
        var speakerEl = document.getElementById('speaker-name');
        if (speakerEl) speakerEl.textContent = '';

        _waitingForClick = false;

        GT.Typewriter.type(dialogueTextEl, event.description, function() {
            _showWaitingForClickThen(function() {
                _endComfortEvent();
            });
        });
    }

    function _endComfortEvent() {
        _isInEvent = false;
        _currentEventId = null;
        _eventStartTime = 0;
        _waitingForClick = false;

        if (GT.StorySystem && GT.StorySystem.cancelAdvancement) {
            GT.StorySystem.cancelAdvancement();
        }

        if (_savedStoryNode) {
            GT.State.set('currentNode', _savedStoryNode);
            _savedStoryNode = null;

            var dialogueTextEl = document.getElementById('dialogue-text');
            if (dialogueTextEl) {
                dialogueTextEl.textContent = '\uff08\u4f60\u611f\u5230\u8f7b\u677e\u4e86\u4e0d\u5c11\uff0c\u7ee7\u7eed\u524d\u884c......\uff09';
            }
            var speakerEl = document.getElementById('speaker-name');
            if (speakerEl) speakerEl.textContent = '';
            var indicator = document.getElementById('dialogue-indicator');
            if (indicator) indicator.style.display = 'block';

            var choicesContainer = document.getElementById('choices-container');
            if (choicesContainer) choicesContainer.style.display = 'none';

            var dialogueContainer = document.getElementById('dialogue-container');
            if (dialogueContainer) {
                dialogueContainer.style.pointerEvents = 'auto';
                dialogueContainer.classList.remove('choices-active');
                dialogueContainer.onclick = null;
            }
        }

        GT.EventBus.emit('comfort-event:completed');
    }

    function _forceResetEvent() {
        _isInEvent = false;
        _currentEventId = null;
        _currentEvent = null;
        _currentNodeIndex = 0;
        _eventStartTime = 0;
        _waitingForClick = false;

        if (GT.StorySystem && GT.StorySystem.cancelAdvancement) {
            GT.StorySystem.cancelAdvancement();
        }

        if (_savedStoryNode) {
            GT.State.set('currentNode', _savedStoryNode);
            _savedStoryNode = null;
        }

        var choicesContainer = document.getElementById('choices-container');
        if (choicesContainer) choicesContainer.style.display = 'none';

        var dialogueContainer = document.getElementById('dialogue-container');
        if (dialogueContainer) {
            dialogueContainer.style.pointerEvents = 'auto';
            dialogueContainer.classList.remove('choices-active');
            dialogueContainer.onclick = null;
        }

        var dialogueTextEl = document.getElementById('dialogue-text');
        if (dialogueTextEl) {
            dialogueTextEl.textContent = '\uff08\u4f60\u4ece\u90a3\u6bb5\u7ecf\u5386\u4e2d\u56de\u8fc7\u795e\u6765\uff0c\u7ee7\u7eed\u524d\u884c......\uff09';
        }
        var speakerEl = document.getElementById('speaker-name');
        if (speakerEl) speakerEl.textContent = '';
        var indicator = document.getElementById('dialogue-indicator');
        if (indicator) indicator.style.display = 'block';

        GT.EventBus.emit('ghost-event:completed');
    }

    function _triggerRandomEvent() {
        var allEvents = _getAllAvailableEvents();
        if (allEvents.length === 0) return;

        var identityId = GT.State.get('protagonist.identity');
        var preferredCategories = _identityCategoryMap[identityId] || ['urban_legend', 'folklore', 'true_crime', 'campus', 'network'];

        var identityFiltered = allEvents.filter(function(e) {
            return !e.requiredIdentity || e.requiredIdentity === identityId;
        });

        var categoryFiltered = identityFiltered.filter(function(e) {
            return preferredCategories.indexOf(e.category) !== -1;
        });

        var eventPool = categoryFiltered.length > 0 ? categoryFiltered : identityFiltered;

        var completedEvents = GT.State.get('completedEvents') || [];
        var availableEvents = eventPool.filter(function(e) {
            return completedEvents.indexOf(e.id) === -1;
        });

        if (availableEvents.length === 0) {
            availableEvents = eventPool;
        }

        if (availableEvents.length === 0) return;

        availableEvents.sort(function(a, b) {
            var aInPreferred = preferredCategories.indexOf(a.category);
            var bInPreferred = preferredCategories.indexOf(b.category);
            if (aInPreferred !== bInPreferred) return aInPreferred - bInPreferred;
            return 0;
        });

        var topCount = Math.min(5, availableEvents.length);
        var event = availableEvents[Math.floor(Math.random() * topCount)];

        _isInEvent = true;
        _savedStoryNode = GT.State.get('currentNode');

        if (GT.StorySystem && GT.StorySystem.cancelAdvancement) {
            GT.StorySystem.cancelAdvancement();
        }

        _showTransition(event);
    }

    function _showTransition(event) {
        if (GT.Typewriter && GT.Typewriter.isTyping()) {
            GT.Typewriter.finish();
        }

        if (GT.StorySystem && GT.StorySystem.cancelAdvancement) {
            GT.StorySystem.cancelAdvancement();
        }

        var choicesContainer = document.getElementById('choices-container');
        if (choicesContainer) choicesContainer.style.display = 'none';

        var transitionText = _transitionTexts[Math.floor(Math.random() * _transitionTexts.length)];
        if (event.transitionHint) {
            transitionText = event.transitionHint;
        }

        var dialogueTextEl = document.getElementById('dialogue-text');
        var speakerEl = document.getElementById('speaker-name');
        if (speakerEl) speakerEl.textContent = '';

        if (GT.AnimationSystem && GT.AnimationSystem.triggerEffect) {
            GT.AnimationSystem.triggerEffect('ghostApproach');
        }
        if (GT.AudioSystem && GT.AudioSystem.playSFX) {
            GT.AudioSystem.playSFX('ghost_approach');
        }

        _waitingForClick = false;

        GT.Typewriter.type(dialogueTextEl, transitionText, function() {
            _waitingForClick = true;
            var indicator = document.getElementById('dialogue-indicator');
            if (indicator) indicator.style.display = 'block';

            var dialogueContainer = document.getElementById('dialogue-container');
            if (dialogueContainer) {
                dialogueContainer.style.pointerEvents = 'auto';
                dialogueContainer.classList.remove('choices-active');
                dialogueContainer.onclick = function() {
                    if (!_waitingForClick) return;
                    _waitingForClick = false;
                    dialogueContainer.onclick = null;
                    _startEventInternal(event);
                };
            }
        });
    }

    function _startEventInternal(event) {
        _currentEventId = event.id;
        _currentEvent = event;
        _currentNodeIndex = 0;
        _eventStartTime = Date.now();
        _waitingForClick = false;

        _activeEvents.push(event);

        try {
            GT.State.modifyFear(event.fearChange || 1);
            GT.State.modifySanity(event.sanityChange || -1);

            var completed = GT.State.get('completedEvents') || [];
            if (completed.indexOf(event.id) === -1) {
                completed.push(event.id);
                GT.State.set('completedEvents', completed);
            }

            var triggered = GT.State.get('triggeredGhosts') || [];
            if (triggered.indexOf(event.id) === -1) {
                triggered.push(event.id);
                GT.State.set('triggeredGhosts', triggered);
            }
            _triggeredEventIds = triggered;

            if (GT.CollectionSystem && GT.CollectionSystem.collectGhost) {
                GT.CollectionSystem.collectGhost(event);
            }
            if (GT.KnowledgeSystem && GT.KnowledgeSystem.collectByEvent) {
                GT.KnowledgeSystem.collectByEvent(event.id, event.category);
            }
            _eventCooldown = _cooldownDuration;

            GT.State.increment('statistics.ghostEventsTriggered');
            if (GT.AnimationSystem && GT.AnimationSystem.triggerEffect) {
                GT.AnimationSystem.triggerEffect('ghostAppear');
            }
            if (GT.AudioSystem && GT.AudioSystem.playSFX) {
                GT.AudioSystem.playSFX('ghost_trigger');
            }

            GT.EventBus.emit('ghost-event:triggered', event);

            _showEventIntro(event);
        } catch (e) {
            GT.Logger.error('GhostEvent', 'Error starting event: ' + e.message);
            _forceResetEvent();
        }
    }

    function _getAllAvailableEvents() {
        var events = [];
        var dataSources = [
            GT.UrbanLegendsData,
            GT.CampusHorrorData,
            GT.NetworkHorrorData,
            GT.TrueCrimesData,
            GT.FolkloreData
        ];

        dataSources.forEach(function(dataSource) {
            if (dataSource) {
                for (var key in dataSource) {
                    if (dataSource.hasOwnProperty(key)) {
                        events.push(dataSource[key]);
                    }
                }
            }
        });

        return events;
    }

    function startEventStory(eventId) {
        var allEvents = _getAllAvailableEvents();
        var event = null;
        for (var i = 0; i < allEvents.length; i++) {
            if (allEvents[i].id === eventId) {
                event = allEvents[i];
                break;
            }
        }

        if (!event) {
            GT.Logger.warn('GhostEvent', 'Event not found: ' + eventId);
            return;
        }

        if (GT.Typewriter && GT.Typewriter.isTyping()) {
            GT.Typewriter.finish();
        }

        _isInEvent = true;
        _savedStoryNode = GT.State.get('currentNode');

        if (GT.StorySystem && GT.StorySystem.cancelAdvancement) {
            GT.StorySystem.cancelAdvancement();
        }

        var choicesContainer = document.getElementById('choices-container');
        if (choicesContainer) choicesContainer.style.display = 'none';

        var dialogueContainer = document.getElementById('dialogue-container');
        if (dialogueContainer) {
            dialogueContainer.style.pointerEvents = 'auto';
            dialogueContainer.classList.remove('choices-active');
            dialogueContainer.onclick = null;
        }

        _startEventInternal(event);
    }

    function _showEventIntro(event) {
        var speaker = event.speaker || '';
        var text = event.description || '';
        var dialogueTextEl = document.getElementById('dialogue-text');

        _waitingForClick = false;

        GT.Typewriter.type(dialogueTextEl, text, function() {
            _showEventChoices(event);
        });

        var speakerEl = document.getElementById('speaker-name');
        if (speakerEl) speakerEl.textContent = speaker;

        var indicator = document.getElementById('dialogue-indicator');
        if (indicator) indicator.style.display = 'none';
    }

    function _showEventChoices(event) {
        var container = document.getElementById('choices-container');
        if (!container) return;
        container.innerHTML = '';
        container.style.display = 'flex';

        var dialogueContainer = document.getElementById('dialogue-container');
        if (dialogueContainer) {
            dialogueContainer.style.pointerEvents = 'none';
            dialogueContainer.classList.add('choices-active');
            dialogueContainer.onclick = null;
        }

        var choices = event.choices || [];
        if (choices.length === 0) {
            _showWaitingForClickThen(function() {
                _processEventNode(event, 0);
            });
            return;
        }

        choices.forEach(function(choice, index) {
            var btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', function() {
                if (GT.AudioSystem && GT.AudioSystem.playSFX) {
                    GT.AudioSystem.playSFX('click');
                }
                _onEventChoiceSelected(event, choice, index);
            });
            container.appendChild(btn);
        });
    }

    function _onEventChoiceSelected(event, choice, index) {
        var container = document.getElementById('choices-container');
        if (container) container.style.display = 'none';

        var dialogueContainer = document.getElementById('dialogue-container');
        if (dialogueContainer) {
            dialogueContainer.style.pointerEvents = 'auto';
            dialogueContainer.classList.remove('choices-active');
            dialogueContainer.onclick = null;
        }

        if (choice.effects) {
            if (choice.effects.sanity && choice.effects.sanity.add) GT.State.modifySanity(choice.effects.sanity.add);
            if (choice.effects.fear && choice.effects.fear.add) GT.State.modifyFear(choice.effects.fear.add);
            if (choice.effects.knowledge && choice.effects.knowledge.add) GT.State.modifyKnowledge(choice.effects.knowledge.add);
            if (choice.effects.courage && choice.effects.courage.add) GT.State.set('courage', GT.State.get('courage') + choice.effects.courage.add);
            if (choice.effects.perception && choice.effects.perception.add) GT.State.set('perception', GT.State.get('perception') + choice.effects.perception.add);
        }

        if (event.storyNodes && event.storyNodes.length > 0) {
            _processEventNode(event, 0);
        } else {
            _showEventConclusion(event, choice);
        }
    }

    function _showWaitingForClickThen(callback) {
        _waitingForClick = true;
        var indicator = document.getElementById('dialogue-indicator');
        if (indicator) indicator.style.display = 'block';

        var dialogueContainer = document.getElementById('dialogue-container');
        if (dialogueContainer) {
            dialogueContainer.style.pointerEvents = 'auto';
            dialogueContainer.classList.remove('choices-active');
            dialogueContainer.onclick = function() {
                if (!_waitingForClick) return;
                _waitingForClick = false;
                dialogueContainer.onclick = null;
                if (indicator) indicator.style.display = 'none';
                if (callback) callback();
            };
        }
    }

    function _processEventNode(event, nodeIndex) {
        if (!event.storyNodes || nodeIndex >= event.storyNodes.length) {
            _showEventConclusion(event);
            return;
        }

        _currentNodeIndex = nodeIndex;
        var node = event.storyNodes[nodeIndex];
        var speaker = node.speaker || '';
        var text = node.text || '';
        var dialogueTextEl = document.getElementById('dialogue-text');

        _waitingForClick = false;

        GT.Typewriter.type(dialogueTextEl, text, function() {
            if (node.fearChange) GT.State.modifyFear(node.fearChange);
            if (node.sanityChange) GT.State.modifySanity(node.sanityChange);
            if (node.horrorEffect && GT.AnimationSystem) GT.AnimationSystem.triggerEffect(node.horrorEffect);

            if (node.choices && node.choices.length > 0) {
                _showStoryNodeChoices(event, node, nodeIndex);
            } else {
                _showWaitingForClickThen(function() {
                    if (nodeIndex + 1 < event.storyNodes.length) {
                        _processEventNode(event, nodeIndex + 1);
                    } else {
                        _showEventConclusion(event);
                    }
                });
            }
        });

        var speakerEl = document.getElementById('speaker-name');
        if (speakerEl) speakerEl.textContent = speaker;

        var indicator = document.getElementById('dialogue-indicator');
        if (indicator) indicator.style.display = 'none';
    }

    function _showStoryNodeChoices(event, node, nodeIndex) {
        var container = document.getElementById('choices-container');
        if (!container) return;
        container.innerHTML = '';
        container.style.display = 'flex';

        var dialogueContainer = document.getElementById('dialogue-container');
        if (dialogueContainer) {
            dialogueContainer.style.pointerEvents = 'none';
            dialogueContainer.classList.add('choices-active');
            dialogueContainer.onclick = null;
        }

        node.choices.forEach(function(choice, index) {
            var btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', function() {
                if (GT.AudioSystem && GT.AudioSystem.playSFX) GT.AudioSystem.playSFX('click');

                container.style.display = 'none';
                if (dialogueContainer) {
                    dialogueContainer.style.pointerEvents = 'auto';
                    dialogueContainer.classList.remove('choices-active');
                    dialogueContainer.onclick = null;
                }

                if (choice.effects) {
                    if (choice.effects.sanity && choice.effects.sanity.add) GT.State.modifySanity(choice.effects.sanity.add);
                    if (choice.effects.fear && choice.effects.fear.add) GT.State.modifyFear(choice.effects.fear.add);
                    if (choice.effects.knowledge && choice.effects.knowledge.add) GT.State.modifyKnowledge(choice.effects.knowledge.add);
                    if (choice.effects.courage && choice.effects.courage.add) GT.State.set('courage', GT.State.get('courage') + choice.effects.courage.add);
                    if (choice.effects.perception && choice.effects.perception.add) GT.State.set('perception', GT.State.get('perception') + choice.effects.perception.add);
                }

                var nextNodeIndex = nodeIndex + 1;
                if (nextNodeIndex < event.storyNodes.length) {
                    _processEventNode(event, nextNodeIndex);
                } else {
                    _showEventConclusion(event);
                }
            });
            container.appendChild(btn);
        });
    }

    function _showEventConclusion(event, choice) {
        var conclusionText = event.conclusion || '\u4f60\u4ece\u8fd9\u6bb5\u7ecf\u5386\u4e2d\u56de\u8fc7\u795e\u6765\uff0c\u7ee7\u7eed\u524d\u884c\u3002';
        var afterstoryText = event.afterstory || '';
        var fullText = conclusionText;
        if (afterstoryText) {
            fullText = conclusionText + '\n\n\u3010\u65e5\u540e\u8c08\u3011' + afterstoryText;
        }
        var dialogueTextEl = document.getElementById('dialogue-text');

        _waitingForClick = false;

        GT.Typewriter.type(dialogueTextEl, fullText, function() {
            _showWaitingForClickThen(function() {
                _endEventStory();
            });
        });

        var speakerEl = document.getElementById('speaker-name');
        if (speakerEl) speakerEl.textContent = '';
    }

    function _endEventStory() {
        _isInEvent = false;
        _currentEventId = null;
        _currentEvent = null;
        _currentNodeIndex = 0;
        _eventStartTime = 0;
        _waitingForClick = false;

        if (GT.StorySystem && GT.StorySystem.cancelAdvancement) {
            GT.StorySystem.cancelAdvancement();
        }

        if (_savedStoryNode) {
            GT.State.set('currentNode', _savedStoryNode);
            _savedStoryNode = null;

            var dialogueTextEl = document.getElementById('dialogue-text');
            if (dialogueTextEl) {
                dialogueTextEl.textContent = '\uff08\u4f60\u4ece\u90a3\u6bb5\u7ecf\u5386\u4e2d\u56de\u8fc7\u795e\u6765\uff0c\u7ee7\u7eed\u524d\u884c......\uff09';
            }
            var speakerEl = document.getElementById('speaker-name');
            if (speakerEl) speakerEl.textContent = '';
            var indicator = document.getElementById('dialogue-indicator');
            if (indicator) indicator.style.display = 'block';

            var choicesContainer = document.getElementById('choices-container');
            if (choicesContainer) choicesContainer.style.display = 'none';

            var dialogueContainer = document.getElementById('dialogue-container');
            if (dialogueContainer) {
                dialogueContainer.style.pointerEvents = 'auto';
                dialogueContainer.classList.remove('choices-active');
                dialogueContainer.onclick = null;
            }
        }

        GT.EventBus.emit('ghost-event:completed');
    }

    function isInEvent() {
        return _isInEvent;
    }

    function getActiveEvents() {
        return _activeEvents.slice();
    }

    function getEventById(eventId) {
        var allEvents = _getAllAvailableEvents();
        for (var i = 0; i < allEvents.length; i++) {
            if (allEvents[i].id === eventId) return allEvents[i];
        }
        return null;
    }

    return {
        init: init,
        checkAndTrigger: checkAndTrigger,
        triggerEvent: startEventStory,
        startEventStory: startEventStory,
        isInEvent: isInEvent,
        getActiveEvents: getActiveEvents,
        getEventById: getEventById
    };
})();
