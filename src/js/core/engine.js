var GT = window.GT || {};

GT.Engine = (function() {
    var _initialized = false;
    var _currentScreen = 'loading';
    var _screenHistory = [];
    var _autoPlayTimer = null;
    var _isAutoPlaying = false;
    var _fearWarningActive = false;
    var _pendingNodeAfterWarning = null;
    var _gameLoopTimer = null;
    var _lastTick = 0;
    var _autoSaveInterval = 120000;

    function init() {
        if (_initialized) return;

        GT.ErrorHandler.init();
        GT.Logger.info('Engine', 'Initializing game engine...');

        GT.State.init();
        _loadSettings();
        _bindEvents();
        _startLoading();

        _initialized = true;
        GT.Logger.info('Engine', 'Game engine initialized');
    }

    function _loadSettings() {
        var settings = GT.State.get('settings');
        settings.bgmVolume = GT.Storage.loadSetting('bgmVolume', 60);
        settings.sfxVolume = GT.Storage.loadSetting('sfxVolume', 80);
        settings.ambientVolume = GT.Storage.loadSetting('ambientVolume', 50);
        settings.textSpeed = GT.Storage.loadSetting('textSpeed', 3);
        settings.autoSpeed = GT.Storage.loadSetting('autoSpeed', 3);
        settings.fontSize = GT.Storage.loadSetting('fontSize', 'medium');
        settings.horrorEffects = GT.Storage.loadSetting('horrorEffects', true);
        GT.State.set('settings', settings);
    }

    function _startLoading() {
        var loadingBar = document.getElementById('loading-bar');
        var loadingText = document.getElementById('loading-text');
        var steps = [
            { text: '正在唤醒沉睡的意识...', progress: 10 },
            { text: '正在加载场景数据...', progress: 20 },
            { text: '正在加载身份数据...', progress: 30 },
            { text: '正在加载剧情数据...', progress: 45 },
            { text: '正在加载怪谈事件...', progress: 60 },
            { text: '正在加载结局数据...', progress: 70 },
            { text: '正在初始化音效系统...', progress: 80 },
            { text: '正在准备恐怖特效...', progress: 90 },
            { text: '黑暗即将降临...', progress: 100 }
        ];

        var currentStep = 0;
        function nextStep() {
            if (currentStep >= steps.length) {
                setTimeout(function() {
                    _onLoadingComplete();
                }, 500);
                return;
            }
            var step = steps[currentStep];
            loadingText.textContent = step.text;
            loadingBar.style.width = step.progress + '%';
            currentStep++;
            setTimeout(nextStep, 300 + Math.random() * 200);
        }
        nextStep();
    }

    function _onLoadingComplete() {
        try {
            if (GT.AudioSystem) GT.AudioSystem.init();
            if (GT.AnimationSystem) GT.AnimationSystem.init();
            if (GT.CinematicSystem) GT.CinematicSystem.init();
            if (GT.AchievementSystem) GT.AchievementSystem.init();
            if (GT.CollectionSystem) GT.CollectionSystem.init();
            if (GT.EndingArchiveSystem) GT.EndingArchiveSystem.init();
            if (GT.KnowledgeSystem) GT.KnowledgeSystem.init();
        } catch(e) {
            console.error('Module init error:', e);
        }

        if (GT.Storage.hasSave('auto')) {
            document.getElementById('btn-continue').disabled = false;
        }

        switchScreen('main-menu');
        _initMenuEffects();
        GT.Logger.info('Engine', 'Loading complete');
    }

    function switchScreen(screenId) {
        _screenHistory.push(_currentScreen);
        _currentScreen = screenId;

        var targetScreen = document.getElementById(screenId);
        var isOverlay = targetScreen && targetScreen.classList.contains('overlay-screen');

        if (!isOverlay) {
            var screens = document.querySelectorAll('.screen');
            screens.forEach(function(screen) {
                if (screen.classList.contains('overlay-screen')) {
                    screen.style.display = 'none';
                    screen.classList.remove('active');
                } else {
                    screen.classList.remove('active');
                }
            });
        }

        if (targetScreen) {
            if (isOverlay) {
                targetScreen.style.display = 'flex';
            }
            targetScreen.classList.add('active');
        }

        GT.EventBus.emit('screen:switched', screenId);
    }

    function goBack() {
        if (_screenHistory.length > 0) {
            var prevScreen = _screenHistory.pop();
            _currentScreen = prevScreen;

            var currentOverlay = document.querySelector('.overlay-screen[style*="display: flex"], .overlay-screen[style*="display:flex"]');
            if (currentOverlay) {
                currentOverlay.style.display = 'none';
            }

            var targetScreen = document.getElementById(prevScreen);
            if (targetScreen) {
                targetScreen.classList.add('active');
            }
        }
    }

    function _bindEvents() {
        document.getElementById('btn-new-game').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.ProtagonistSystem.showCreateScreen();
        });

        document.getElementById('btn-continue').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            _loadAutoSave();
        });

        document.getElementById('btn-collection').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.CollectionSystem.showScreen();
        });

        document.getElementById('btn-achievements').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.AchievementSystem.showScreen();
        });

        document.getElementById('btn-ending-archive').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.EndingArchiveSystem.showScreen();
        });

        document.getElementById('btn-knowledge').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.KnowledgeSystem.showScreen();
        });

        document.getElementById('btn-settings').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            _showSettings();
        });

        document.getElementById('btn-back-from-protagonist').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            switchScreen('main-menu');
        });

        document.getElementById('btn-back-from-identity').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.ProtagonistSystem.showCreateScreen();
        });

        document.getElementById('btn-confirm-protagonist').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.ProtagonistSystem.confirmCreation();
        });

        document.getElementById('btn-confirm-identity').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.IdentitySystem.confirmSelection();
        });

        document.getElementById('btn-back-to-grid').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            var detail = document.getElementById('identity-detail');
            if (detail) detail.style.display = 'none';
            var grid = document.getElementById('identity-grid');
            if (grid) grid.style.display = '';
        });

        document.getElementById('btn-menu').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            _showGameMenu();
        });

        document.getElementById('btn-save').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            _showSaveScreen();
        });

        document.getElementById('btn-auto').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            toggleAutoPlay();
        });

        document.getElementById('btn-log').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            _showDialogLog();
        });

        document.getElementById('btn-protagonist-info').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.ProtagonistSystem.showInfo();
        });

        document.getElementById('btn-collection-panel').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.CollectionSystem.showScreen();
        });

        document.getElementById('btn-achievement-panel').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.AchievementSystem.showScreen();
        });

        document.getElementById('btn-knowledge-panel').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            GT.KnowledgeSystem.showScreen();
        });

        document.getElementById('btn-close-panel').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            document.getElementById('side-panel').style.display = 'none';
        });

        document.getElementById('btn-ending-back').addEventListener('click', function() {
            GT.AudioSystem.playSFX('click');
            _stopGameLoop();
            _isAutoPlaying = false;
            GT.AudioSystem.stopBGM();
            GT.AudioSystem.stopAmbient();
            document.getElementById('ending-popup').style.display = 'none';
            document.getElementById('ghost-event-popup').style.display = 'none';
            document.getElementById('achievement-popup').style.display = 'none';
            document.getElementById('choices-container').style.display = 'none';

            var dialogueContainer = document.getElementById('dialogue-container');
            if (dialogueContainer) dialogueContainer.style.pointerEvents = 'auto';

            switchScreen('main-menu');
        });

        document.getElementById('dialogue-container').addEventListener('click', function() {
            _advanceDialogue();
        });

        document.getElementById('scene-container').addEventListener('click', function() {
            _advanceDialogue();
        });

        _bindSettingsEvents();
        _bindBackButtons();
        _bindKeyboardEvents();

        GT.EventBus.on('state:sanity-zero', function() {
            GT.EndingSystem.triggerEnding('sanity_death');
        });

        GT.EventBus.on('state:fear-max', function() {
            GT.EndingSystem.triggerEnding('fear_overload');
        });

        GT.EventBus.on('state:fear-warning', function(count) {
            var remaining = 4 - count;
            var msg = '\u4f60\u611f\u5230\u4e00\u9635\u5267\u70c8\u7684\u6050\u60e7\uff0c\u5fc3\u810f\u5feb\u8981\u8df3\u51fa\u80f8\u8154\u4e86......\uff08\u6050\u60e7\u503c\u5df2\u8fbe\u4e0a\u9650\uff01\u8fd8\u6709' + remaining + '\u6b21\u673a\u4f1a\uff0c\u518d\u8fbe\u5230\u5c06\u89e6\u53d1\u6050\u60e7\u541e\u566c\u7ed3\u5c40\uff01\uff09';

            _fearWarningActive = true;
            _pendingNodeAfterWarning = GT.State.get('currentNode') || null;

            GT.State.modifyFear(-20);
            updateStatus();

            if (GT.Typewriter && GT.Typewriter.stop) {
                GT.Typewriter.stop();
            }

            var dialogueTextEl = document.getElementById('dialogue-text');
            if (dialogueTextEl) {
                dialogueTextEl.textContent = msg;
            }
            var speakerEl = document.getElementById('speaker-name');
            if (speakerEl) {
                speakerEl.textContent = '\u26a0\ufe0f \u6050\u60e7\u8b66\u544a';
                speakerEl.style.display = 'block';
            }
            var indicator = document.getElementById('dialogue-indicator');
            if (indicator) indicator.style.display = 'block';

            var choicesContainer = document.getElementById('choices-container');
            if (choicesContainer) choicesContainer.style.display = 'none';

            if (GT.AnimationSystem && GT.AnimationSystem.triggerEffect) {
                GT.AnimationSystem.triggerEffect('fearWarning');
            }

            if (GT.StorySystem && GT.StorySystem.cancelAdvancement) {
                GT.StorySystem.cancelAdvancement();
            }

            var fearOverlay = document.getElementById('fear-warning-overlay');
            if (!fearOverlay) {
                fearOverlay = document.createElement('div');
                fearOverlay.id = 'fear-warning-overlay';
                fearOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(139,0,0,0.3);z-index:9999;pointer-events:none;animation:fearPulse 1s ease-in-out 3;';
                document.body.appendChild(fearOverlay);
                setTimeout(function() {
                    if (fearOverlay.parentNode) {
                        fearOverlay.parentNode.removeChild(fearOverlay);
                    }
                }, 4000);
            }
        });
    }

    function _bindSettingsEvents() {
        document.getElementById('setting-bgm-volume').addEventListener('input', function(e) {
            var val = parseInt(e.target.value);
            document.getElementById('bgm-volume-value').textContent = val;
            GT.State.set('settings.bgmVolume', val);
            GT.Storage.saveSetting('bgmVolume', val);
            GT.AudioSystem.setBGMVolume(val / 100);
        });

        document.getElementById('setting-sfx-volume').addEventListener('input', function(e) {
            var val = parseInt(e.target.value);
            document.getElementById('sfx-volume-value').textContent = val;
            GT.State.set('settings.sfxVolume', val);
            GT.Storage.saveSetting('sfxVolume', val);
        });

        document.getElementById('setting-ambient-volume').addEventListener('input', function(e) {
            var val = parseInt(e.target.value);
            document.getElementById('ambient-volume-value').textContent = val;
            GT.State.set('settings.ambientVolume', val);
            GT.Storage.saveSetting('ambientVolume', val);
            GT.AudioSystem.setAmbientVolume(val / 100);
        });

        document.getElementById('setting-text-speed').addEventListener('input', function(e) {
            var val = parseInt(e.target.value);
            document.getElementById('text-speed-value').textContent = val;
            GT.State.set('settings.textSpeed', val);
            GT.Storage.saveSetting('textSpeed', val);
        });

        document.getElementById('setting-auto-speed').addEventListener('input', function(e) {
            var val = parseInt(e.target.value);
            document.getElementById('auto-speed-value').textContent = val;
            GT.State.set('settings.autoSpeed', val);
            GT.Storage.saveSetting('autoSpeed', val);
        });

        document.getElementById('setting-font-size').addEventListener('change', function(e) {
            GT.State.set('settings.fontSize', e.target.value);
            GT.Storage.saveSetting('fontSize', e.target.value);
            document.body.className = document.body.className.replace(/font-size-\w+/g, '');
            document.body.classList.add('font-size-' + e.target.value);
        });

        document.getElementById('btn-horror-effects').addEventListener('click', function() {
            var enabled = !GT.State.get('settings.horrorEffects');
            GT.State.set('settings.horrorEffects', enabled);
            GT.Storage.saveSetting('horrorEffects', enabled);
            this.textContent = enabled ? '开启' : '关闭';
            document.body.classList.toggle('horror-effects-disabled', !enabled);
        });

        document.getElementById('btn-fullscreen').addEventListener('click', function() {
            var isFull = !GT.State.get('settings.fullscreen');
            GT.State.set('settings.fullscreen', isFull);
            this.textContent = isFull ? '开启' : '关闭';
            // 容器统一管理原生全屏（requestFullscreen 不可用），用 CSS 沉浸式布局实现视觉全屏
            document.body.classList.toggle('fullscreen-mode', isFull);
        });
    }

    function _bindBackButtons() {
        var backButtons = [
            { id: 'btn-back-from-settings', screen: 'settings-screen' },
            { id: 'btn-back-from-save', screen: 'save-screen' },
            { id: 'btn-back-from-log', screen: 'dialog-log' },
            { id: 'btn-back-from-collection', screen: 'collection-screen' },
            { id: 'btn-back-from-achievements', screen: 'achievement-screen' },
            { id: 'btn-back-from-ending-archive', screen: 'ending-archive-screen' },
            { id: 'btn-back-from-knowledge', screen: 'knowledge-screen' }
        ];

        backButtons.forEach(function(btn) {
            document.getElementById(btn.id).addEventListener('click', function() {
                GT.AudioSystem.playSFX('click');
                _closeOverlay(btn.screen);
            });
        });
    }

    function _closeOverlay(screenId) {
        var screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'none';
            screen.classList.remove('active');
        }

        var gameScreen = document.getElementById('game-screen');
        var anyOverlayOpen = document.querySelector('.overlay-screen[style*="display: flex"], .overlay-screen[style*="display:flex"]');
        if (gameScreen) {
            if (anyOverlayOpen) {
                gameScreen.classList.add('overlay-open');
            } else {
                gameScreen.classList.remove('overlay-open');
            }
        }

        if (_currentScreen === screenId) {
            if (_screenHistory.length > 0) {
                _currentScreen = _screenHistory.pop();
            }
        }

        var baseScreen = document.getElementById(_currentScreen);
        if (baseScreen && !baseScreen.classList.contains('active')) {
            baseScreen.classList.add('active');
        }
    }

    function _openOverlay(screenId) {
        var gameScreen = document.getElementById('game-screen');
        if (gameScreen && _currentScreen === 'game-screen') {
            gameScreen.classList.add('overlay-open');
        }
    }

    function _bindKeyboardEvents() {
        document.addEventListener('keydown', function(e) {
            if (_currentScreen !== 'game-screen') return;
            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    _advanceDialogue();
                    break;
                case 'Escape':
                    _showGameMenu();
                    break;
                case 's':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        GT.Storage.autoSave();
                    }
                    break;
            }
        });
    }

    function _advanceDialogue() {
        if (_fearWarningActive) {
            _fearWarningActive = false;
            var speakerEl = document.getElementById('speaker-name');
            if (speakerEl) speakerEl.style.display = 'none';
            if (_pendingNodeAfterWarning) {
                var node = _pendingNodeAfterWarning;
                _pendingNodeAfterWarning = null;
                GT.StorySystem.showNode(node);
            } else {
                GT.StorySystem.advance();
            }
            return;
        }

        var choicesContainer = document.getElementById('choices-container');
        if (choicesContainer && choicesContainer.style.display !== 'none' && choicesContainer.children.length > 0) {
            return;
        }

        if (GT.Typewriter.isTyping()) {
            GT.Typewriter.finish();
            return;
        }

        GT.StorySystem.advance();
    }

    function toggleAutoPlay() {
        _isAutoPlaying = !_isAutoPlaying;
        var btn = document.getElementById('btn-auto');
        btn.textContent = _isAutoPlaying ? '⏸' : '▶';
        btn.classList.toggle('active', _isAutoPlaying);

        if (_isAutoPlaying) {
            _scheduleAutoAdvance();
        } else if (_autoPlayTimer) {
            clearTimeout(_autoPlayTimer);
            _autoPlayTimer = null;
        }
    }

    function _scheduleAutoAdvance() {
        if (!_isAutoPlaying) return;
        var speed = GT.State.get('settings.autoSpeed');
        var delay = [5000, 4000, 3000, 2000, 1000][speed - 1] || 3000;

        _autoPlayTimer = setTimeout(function() {
            if (_isAutoPlaying && _currentScreen === 'game-screen') {
                _advanceDialogue();
                _scheduleAutoAdvance();
            }
        }, delay);
    }

    function startGame(identityId) {
        GT.State.init();
        GT.State.set('protagonist.identity', identityId);

        var identity = GT.IdentityData[identityId];
        if (identity) {
            GT.State.set('courage', identity.baseStats.courage);
            GT.State.set('perception', identity.baseStats.perception);
            GT.State.set('luck', identity.baseStats.luck);
            GT.State.set('identityDifferences', identity.differences || {});
        }

        switchScreen('game-screen');

        var gameScreen = document.getElementById('game-screen');
        if (gameScreen) gameScreen.classList.remove('overlay-open');

        GT.StorySystem.startStory(identityId);
        _startGameLoop();
        GT.EventBus.emit('game:started');
        GT.Logger.info('Engine', 'Game started with identity: ' + identityId);
    }

    var _decayCounter = 0;

    function _startGameLoop() {
        _lastTick = Date.now();
        _gameLoopTimer = setInterval(function() {
            var now = Date.now();
            var delta = now - _lastTick;
            _lastTick = now;

            GT.State.increment('statistics.totalPlayTime', delta);

            _decayCounter++;
            if (_decayCounter >= 60) {
                _decayCounter = 0;
                var fear = GT.State.get('fear');
                if (fear > 0) {
                    GT.State.modifyFear(-1);
                }
                var sanity = GT.State.get('sanity');
                if (sanity < 100) {
                    var fearVal = GT.State.get('fear');
                    if (fearVal < 30) {
                        GT.State.modifySanity(1);
                    }
                }
            }

            if (now % _autoSaveInterval < 1000) {
                GT.Storage.autoSave();
            }

            GT.GhostEventSystem.checkAndTrigger();
            GT.AnimationSystem.update(delta);
        }, 1000);
    }

    function _stopGameLoop() {
        if (_gameLoopTimer) {
            clearInterval(_gameLoopTimer);
            _gameLoopTimer = null;
        }
    }

    function _loadAutoSave() {
        var saveData = GT.Storage.loadAutoSave();
        if (saveData && saveData.state) {
            GT.State.importState(saveData.state);
            switchScreen('game-screen');
            GT.StorySystem.resumeFromNode(GT.State.get('currentNode'));
            _startGameLoop();

            var gameScreen = document.getElementById('game-screen');
            if (gameScreen) gameScreen.classList.remove('overlay-open');
        }
    }

    function _showSettings() {
        var screen = document.getElementById('settings-screen');
        screen.style.display = 'flex';
        screen.classList.add('active');
        _openOverlay('settings-screen');

        document.getElementById('setting-bgm-volume').value = GT.State.get('settings.bgmVolume');
        document.getElementById('bgm-volume-value').textContent = GT.State.get('settings.bgmVolume');
        document.getElementById('setting-sfx-volume').value = GT.State.get('settings.sfxVolume');
        document.getElementById('sfx-volume-value').textContent = GT.State.get('settings.sfxVolume');
        document.getElementById('setting-ambient-volume').value = GT.State.get('settings.ambientVolume');
        document.getElementById('ambient-volume-value').textContent = GT.State.get('settings.ambientVolume');
        document.getElementById('setting-text-speed').value = GT.State.get('settings.textSpeed');
        document.getElementById('text-speed-value').textContent = GT.State.get('settings.textSpeed');
        document.getElementById('setting-auto-speed').value = GT.State.get('settings.autoSpeed');
        document.getElementById('auto-speed-value').textContent = GT.State.get('settings.autoSpeed');
        document.getElementById('btn-horror-effects').textContent = GT.State.get('settings.horrorEffects') ? '开启' : '关闭';
    }

    var _saveMode = 'save';

    function _showSaveScreen() {
        var panel = document.getElementById('side-panel');
        if (panel) panel.style.display = 'none';

        var screen = document.getElementById('save-screen');
        screen.style.display = 'flex';
        screen.classList.add('active');
        _saveMode = 'save';
        _openOverlay('save-screen');
        _renderSaveSlots();

        var tabSave = document.getElementById('tab-save');
        var tabLoad = document.getElementById('tab-load');
        if (tabSave && tabLoad) {
            tabSave.classList.add('active');
            tabLoad.classList.remove('active');
            tabSave.onclick = function() {
                tabSave.classList.add('active');
                tabLoad.classList.remove('active');
                _saveMode = 'save';
                _renderSaveSlots();
            };
            tabLoad.onclick = function() {
                tabLoad.classList.add('active');
                tabSave.classList.remove('active');
                _saveMode = 'load';
                _renderSaveSlots();
            };
        }
    }

    function _renderSaveSlots() {
        var container = document.getElementById('save-slots');
        container.innerHTML = '';

        var isLoadMode = _saveMode === 'load';

        for (var i = 1; i <= GT.Storage.MAX_SAVES; i++) {
            var saveData = GT.Storage.load(i);
            var slot = document.createElement('div');
            slot.className = 'save-slot';

            if (saveData) {
                var date = new Date(saveData.timestamp);
                var protName = saveData.state && saveData.state.protagonist ?
                    saveData.state.protagonist.name || '无名' : '无名';
                var identityId = saveData.state && saveData.state.protagonist ?
                    saveData.state.protagonist.identity : null;
                var identityName = identityId && GT.IdentityData[identityId] ?
                    GT.IdentityData[identityId].name : '未知';
                slot.innerHTML =
                    '<div class="slot-info">' +
                    '<div class="slot-number">存档 ' + i + '</div>' +
                    '<div class="slot-character">' + protName + ' - ' + identityName + '</div>' +
                    '<div class="slot-date">' + date.toLocaleString('zh-CN') + '</div>' +
                    '</div>' +
                    '<div class="slot-actions">' +
                    (isLoadMode ?
                        '<button class="slot-btn load-btn" data-slot="' + i + '">读取</button>' :
                        '<button class="slot-btn load-btn" data-slot="' + i + '">读取</button>' +
                        '<button class="slot-btn save-btn" data-slot="' + i + '">覆盖</button>'
                    ) +
                    '<button class="slot-btn delete-btn" data-slot="' + i + '">删除</button>' +
                    '</div>';
            } else {
                slot.innerHTML =
                    '<div class="slot-info">' +
                    '<div class="slot-number">存档 ' + i + '</div>' +
                    '<div class="slot-empty">' + (isLoadMode ? '空 - 无法读取' : '空') + '</div>' +
                    '</div>' +
                    '<div class="slot-actions">' +
                    (isLoadMode ? '' : '<button class="slot-btn save-btn" data-slot="' + i + '">保存</button>') +
                    '</div>';
            }
            container.appendChild(slot);
        }

        container.querySelectorAll('.save-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var slot = parseInt(this.dataset.slot);
                GT.Storage.save(slot);
                GT.AudioSystem.playSFX('save');
                _renderSaveSlots();
            });
        });

        container.querySelectorAll('.load-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var slot = parseInt(this.dataset.slot);
                var saveData = GT.Storage.load(slot);
                if (saveData && saveData.state) {
                    GT.State.importState(saveData.state);
                    document.getElementById('save-screen').style.display = 'none';
                    document.getElementById('save-screen').classList.remove('active');
                    switchScreen('game-screen');
                    GT.StorySystem.resumeFromNode(GT.State.get('currentNode'));
                    _startGameLoop();
                }
            });
        });

        container.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var slot = parseInt(this.dataset.slot);
                if (confirm('确定要删除存档 ' + slot + ' 吗？')) {
                    GT.Storage.deleteSave(slot);
                    _renderSaveSlots();
                }
            });
        });
    }

    function _showDialogLog() {
        var screen = document.getElementById('dialog-log');
        screen.style.display = 'flex';
        screen.classList.add('active');
        _openOverlay('dialog-log');
        var container = document.getElementById('log-entries');
        container.innerHTML = '';

        var logs = GT.State.get('dialogLog') || [];
        logs.slice(-50).forEach(function(log) {
            var entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML =
                '<span class="log-speaker">' + (log.speaker || '旁白') + '</span>' +
                '<span class="log-text">' + log.text + '</span>';
            container.appendChild(entry);
        });
        container.scrollTop = container.scrollHeight;
    }

    function _showGameMenu() {
        var panel = document.getElementById('side-panel');
        var isVisible = panel.style.display !== 'none';
        if (isVisible) {
            panel.style.display = 'none';
            return;
        }

        document.getElementById('panel-title').textContent = '游戏菜单';
        var content = document.getElementById('panel-content');
        content.innerHTML =
            '<div class="menu-panel">' +
            '<button class="panel-btn" id="panel-save">💾 存档</button>' +
            '<button class="panel-btn" id="panel-load">📂 读档</button>' +
            '<button class="panel-btn" id="panel-settings">⚙ 设置</button>' +
            '<button class="panel-btn" id="panel-log">📜 对话记录</button>' +
            '<button class="panel-btn" id="panel-collection">📖 怪谈图鉴</button>' +
            '<button class="panel-btn" id="panel-achievements">🏆 成就</button>' +
            '<button class="panel-btn danger" id="panel-quit">🚪 返回主菜单</button>' +
            '</div>';
        panel.style.display = 'block';

        document.getElementById('panel-save').addEventListener('click', function() {
            panel.style.display = 'none';
            _showSaveScreen();
        });
        document.getElementById('panel-load').addEventListener('click', function() {
            panel.style.display = 'none';
            _showSaveScreen();
        });
        document.getElementById('panel-settings').addEventListener('click', function() {
            panel.style.display = 'none';
            _showSettings();
        });
        document.getElementById('panel-log').addEventListener('click', function() {
            panel.style.display = 'none';
            _showDialogLog();
        });
        document.getElementById('panel-collection').addEventListener('click', function() {
            panel.style.display = 'none';
            GT.CollectionSystem.showScreen();
        });
        document.getElementById('panel-achievements').addEventListener('click', function() {
            panel.style.display = 'none';
            GT.AchievementSystem.showScreen();
        });
        document.getElementById('panel-quit').addEventListener('click', function() {
            if (confirm('确定要返回主菜单吗？未保存的进度将会丢失。')) {
                _stopGameLoop();
                _isAutoPlaying = false;
                GT.AudioSystem.stopBGM();
                GT.AudioSystem.stopAmbient();
                panel.style.display = 'none';

                document.getElementById('ghost-event-popup').style.display = 'none';
                document.getElementById('ending-popup').style.display = 'none';
                document.getElementById('achievement-popup').style.display = 'none';
                document.getElementById('choices-container').style.display = 'none';

                var dialogueContainer = document.getElementById('dialogue-container');
                if (dialogueContainer) dialogueContainer.style.pointerEvents = 'auto';

                switchScreen('main-menu');
            }
        });
    }

    function updateScene(sceneId) {
        var scene = GT.SceneData[sceneId];
        if (!scene) return;

        var bg = document.getElementById('scene-background');
        bg.style.background = scene.gradient || scene.backgroundColor || '#0a0a0a';

        if (scene.particles) {
            var effects = document.getElementById('scene-effects');
            effects.innerHTML = '';
            scene.particles.forEach(function(p) {
                var particle = document.createElement('div');
                particle.className = 'scene-particle ' + p.type;
                particle.style.cssText = p.style || '';
                effects.appendChild(particle);
            });
        }

        document.getElementById('scene-name').textContent = scene.name || '';
        GT.State.increment('statistics.scenesVisited');
    }

    function updateStatus() {
        var sanity = GT.State.get('sanity');
        var fear = GT.State.get('fear');
        var knowledge = GT.State.get('knowledge');
        var timeOfDay = GT.State.get('timeOfDay');

        var sanityEl = document.getElementById('sanity-value');
        var fearEl = document.getElementById('fear-value');
        var knowledgeEl = document.getElementById('knowledge-value');
        var timeEl = document.getElementById('time-value');

        if (sanityEl) sanityEl.textContent = sanity;
        if (fearEl) fearEl.textContent = fear;
        if (knowledgeEl) knowledgeEl.textContent = knowledge;
        if (timeEl) timeEl.textContent = timeOfDay;
    }

    function showGhostEventPopup(event) {
        var panel = document.getElementById('side-panel');
        if (panel) panel.style.display = 'none';

        var popup = document.getElementById('ghost-event-popup');
        document.getElementById('ghost-event-header').textContent = event.name;
        document.getElementById('ghost-event-text').textContent = event.description || event.text || '';

        var choicesContainer = document.getElementById('ghost-event-choices');
        choicesContainer.innerHTML = '';

        if (event.choices && event.choices.length > 0) {
            event.choices.forEach(function(choice) {
                var btn = document.createElement('button');
                btn.className = 'ghost-event-choice-btn';
                btn.textContent = choice.text;
                btn.addEventListener('click', function() {
                    if (choice.effects) {
                        GT.State.applyEffects(choice.effects);
                    }
                    popup.style.display = 'none';
                    GT.AudioSystem.playSFX('event_close');
                    GT.EventBus.emit('ghost-event:choice-made', choice);
                });
                choicesContainer.appendChild(btn);
            });
        } else {
            var btn = document.createElement('button');
            btn.className = 'ghost-event-choice-btn';
            btn.textContent = '继续';
            btn.addEventListener('click', function() {
                popup.style.display = 'none';
            });
            choicesContainer.appendChild(btn);
        }

        popup.style.display = 'flex';
        GT.AudioSystem.playSFX('ghost_trigger');
        GT.State.increment('statistics.ghostEventsTriggered');
        GT.AnimationSystem.triggerEffect('ghostAppear');
    }

    function showEndingPopup(ending) {
        var panel = document.getElementById('side-panel');
        if (panel) panel.style.display = 'none';

        var popup = document.getElementById('ending-popup');
        document.getElementById('ending-type').textContent = ending.typeLabel || '结局';
        document.getElementById('ending-title').textContent = ending.name;
        document.getElementById('ending-text').textContent = ending.description;

        var statsContainer = document.getElementById('ending-stats');
        statsContainer.innerHTML =
            '<div class="ending-stat">理智最低: ' + GT.State.get('statistics.minSanity') + '</div>' +
            '<div class="ending-stat">恐惧最高: ' + GT.State.get('statistics.maxFear') + '</div>' +
            '<div class="ending-stat">怪谈遭遇: ' + GT.State.get('statistics.ghostEventsTriggered') + '</div>' +
            '<div class="ending-stat">知识收集: ' + GT.State.get('statistics.knowledgeCollected') + '</div>';

        popup.style.display = 'flex';
        GT.AudioSystem.playSFX('ending');
        GT.State.increment('statistics.endingsReached');
    }

    function showAchievementPopup(achievement) {
        var popup = document.getElementById('achievement-popup');
        document.getElementById('achievement-icon').textContent = achievement.icon || '🏆';
        document.getElementById('achievement-name').textContent = achievement.name;
        document.getElementById('achievement-desc').textContent = achievement.description;
        popup.style.display = 'flex';
        popup.classList.add('achievement-unlock');

        GT.AudioSystem.playSFX('achievement');

        setTimeout(function() {
            popup.style.display = 'none';
            popup.classList.remove('achievement-unlock');
        }, 3000);
    }

    function addToDialogLog(speaker, text) {
        var logs = GT.State.get('dialogLog') || [];
        logs.push({ speaker: speaker, text: text, timestamp: Date.now() });
        if (logs.length > 200) {
            logs = logs.slice(-100);
        }
        GT.State.set('dialogLog', logs);
    }

    function _initMenuEffects() {
        var particlesContainer = document.getElementById('menu-particles');
        if (!particlesContainer) return;

        function createParticle() {
            var particle = document.createElement('div');
            particle.className = 'menu-particle fog';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (8 + Math.random() * 12) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.opacity = 0.1 + Math.random() * 0.3;
            particlesContainer.appendChild(particle);

            setTimeout(function() {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 20000);
        }

        for (var i = 0; i < 15; i++) {
            setTimeout(createParticle, i * 400);
        }
        setInterval(createParticle, 1000);
    }

    return {
        init: init,
        switchScreen: switchScreen,
        goBack: goBack,
        startGame: startGame,
        toggleAutoPlay: toggleAutoPlay,
        updateScene: updateScene,
        updateStatus: updateStatus,
        showGhostEventPopup: showGhostEventPopup,
        showEndingPopup: showEndingPopup,
        showAchievementPopup: showAchievementPopup,
        addToDialogLog: addToDialogLog
    };
})();
