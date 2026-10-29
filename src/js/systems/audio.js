var GT = window.GT || {};

GT.AudioSystem = (function() {
    var _bgmAudio = null;
    var _sfxAudios = {};
    var _ambientAudios = {};
    var _audioContext = null;
    var _initialized = false;
    var _maxSfxPool = 5;

    function init() {
        if (_initialized) return;

        try {
            _audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            GT.Logger.warn('AudioSystem', 'Web Audio API not available');
        }

        _bgmAudio = new Audio();
        _bgmAudio.loop = true;
        _bgmAudio.volume = (GT.State.get('settings.bgmVolume') || 60) / 100;

        _initialized = true;
        GT.Logger.info('AudioSystem', 'Audio system initialized');
    }

    function playBGM(trackId) {
        if (!_bgmAudio) return;

        var trackMap = {
            'main_horror_theme': 'src/assets/audio/bgm/main_horror_theme.mp3',
            'investigation': 'src/assets/audio/bgm/investigation.mp3',
            'tension': 'src/assets/audio/bgm/tension.mp3',
            'ghost_encounter': 'src/assets/audio/bgm/ghost_encounter.mp3',
            'safe_zone': 'src/assets/audio/bgm/safe_zone.mp3',
            'ending_bad': 'src/assets/audio/bgm/ending_bad.mp3',
            'ending_good': 'src/assets/audio/bgm/ending_good.mp3',
            'ending_hidden': 'src/assets/audio/bgm/ending_hidden.mp3'
        };

        var src = trackMap[trackId];
        if (!src) {
            GT.Logger.warn('AudioSystem', 'BGM track not found: ' + trackId);
            return;
        }

        if (_bgmAudio.src && _bgmAudio.src.indexOf(src) !== -1) return;

        _bgmAudio.src = src;
        _bgmAudio.play().catch(function() {
            GT.Logger.warn('AudioSystem', 'BGM autoplay blocked');
        });
    }

    function stopBGM() {
        if (_bgmAudio) {
            _bgmAudio.pause();
            _bgmAudio.currentTime = 0;
        }
    }

    function setBGMVolume(volume) {
        if (_bgmAudio) {
            _bgmAudio.volume = Math.max(0, Math.min(1, volume));
        }
    }

    function playSFX(sfxId) {
        var sfxMap = {
            'click': 'src/assets/audio/sfx/click.mp3',
            'save': 'src/assets/audio/sfx/save.mp3',
            'ghost_trigger': 'src/assets/audio/sfx/ghost_trigger.mp3',
            'event_close': 'src/assets/audio/sfx/event_close.mp3',
            'achievement': 'src/assets/audio/sfx/achievement.mp3',
            'ending': 'src/assets/audio/sfx/ending.mp3',
            'horror_sting': 'src/assets/audio/sfx/horror_sting.mp3',
            'heartbeat': 'src/assets/audio/sfx/heartbeat.mp3',
            'door_creak': 'src/assets/audio/sfx/door_creak.mp3',
            'whisper': 'src/assets/audio/sfx/whisper.mp3',
            'footstep': 'src/assets/audio/sfx/footstep.mp3'
        };

        var src = sfxMap[sfxId];
        if (!src) return;

        var volume = (GT.State.get('settings.sfxVolume') || 80) / 100;

        if (!_sfxAudios[sfxId]) {
            _sfxAudios[sfxId] = [];
        }

        var available = null;
        for (var i = 0; i < _sfxAudios[sfxId].length; i++) {
            if (_sfxAudios[sfxId][i].paused || _sfxAudios[sfxId][i].ended) {
                available = _sfxAudios[sfxId][i];
                break;
            }
        }

        if (!available) {
            if (_sfxAudios[sfxId].length >= _maxSfxPool) {
                _sfxAudios[sfxId][0].pause();
                _sfxAudios[sfxId].shift();
            }
            available = new Audio(src);
            _sfxAudios[sfxId].push(available);
        }

        available.volume = volume;
        available.currentTime = 0;
        available.play().catch(function() {});
    }

    function playAmbient(ambientId) {
        var ambientMap = {
            'night_city': 'src/assets/audio/ambient/night_city.mp3',
            'rain': 'src/assets/audio/ambient/rain.mp3',
            'wind': 'src/assets/audio/ambient/wind.mp3',
            'basement': 'src/assets/audio/ambient/basement.mp3',
            'forest': 'src/assets/audio/ambient/forest.mp3',
            'hospital': 'src/assets/audio/ambient/hospital.mp3',
            'school': 'src/assets/audio/ambient/school.mp3'
        };

        var src = ambientMap[ambientId];
        if (!src) return;

        if (_ambientAudios[ambientId]) return;

        var audio = new Audio(src);
        audio.loop = true;
        audio.volume = (GT.State.get('settings.ambientVolume') || 50) / 100;
        audio.play().catch(function() {});
        _ambientAudios[ambientId] = audio;
    }

    function stopAmbient(ambientId) {
        if (ambientId) {
            if (_ambientAudios[ambientId]) {
                _ambientAudios[ambientId].pause();
                delete _ambientAudios[ambientId];
            }
        } else {
            for (var key in _ambientAudios) {
                if (_ambientAudios.hasOwnProperty(key)) {
                    _ambientAudios[key].pause();
                }
            }
            _ambientAudios = {};
        }
    }

    function setAmbientVolume(volume) {
        for (var key in _ambientAudios) {
            if (_ambientAudios.hasOwnProperty(key)) {
                _ambientAudios[key].volume = Math.max(0, Math.min(1, volume));
            }
        }
    }

    function play3DSound(sfxId, x, y, z) {
        if (!_audioContext) {
            playSFX(sfxId);
            return;
        }

        var panner = _audioContext.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 100;
        panner.rolloffFactor = 1;
        panner.setPosition(x || 0, y || 0, z || 0);

        var gainNode = _audioContext.createGain();
        gainNode.gain.value = (GT.State.get('settings.sfxVolume') || 80) / 100;

        panner.connect(gainNode);
        gainNode.connect(_audioContext.destination);

        GT.Logger.info('AudioSystem', '3D sound played: ' + sfxId, { x: x, y: y, z: z });
    }

    return {
        init: init,
        playBGM: playBGM,
        stopBGM: stopBGM,
        setBGMVolume: setBGMVolume,
        playSFX: playSFX,
        playAmbient: playAmbient,
        stopAmbient: stopAmbient,
        setAmbientVolume: setAmbientVolume,
        play3DSound: play3DSound
    };
})();
