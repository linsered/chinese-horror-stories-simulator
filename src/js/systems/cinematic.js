var GT = window.GT || {};

GT.CinematicSystem = (function() {
    var _initialized = false;
    var _activeCharacters = {};
    var _letterboxActive = false;
    var _vignetteActive = false;
    var _tintActive = null;

    function init() {
        if (_initialized) return;
        _initialized = true;
        _createOverlayElements();
        GT.Logger.info('CinematicSystem', 'Cinematic system initialized');
    }

    function _createOverlayElements() {
        var container = document.getElementById('game-screen');
        if (!container) return;

        var letterTop = document.createElement('div');
        letterTop.className = 'cinematic-letterbox-top';
        letterTop.id = 'cinematic-letterbox-top';
        container.appendChild(letterTop);

        var letterBottom = document.createElement('div');
        letterBottom.className = 'cinematic-letterbox-bottom';
        letterBottom.id = 'cinematic-letterbox-bottom';
        container.appendChild(letterBottom);

        var vignette = document.createElement('div');
        vignette.className = 'cinematic-vignette';
        vignette.id = 'cinematic-vignette';
        document.body.appendChild(vignette);

        var tint = document.createElement('div');
        tint.className = 'cinematic-tint';
        tint.id = 'cinematic-tint';
        document.body.appendChild(tint);

        var flashEl = document.createElement('div');
        flashEl.className = 'bg-flash-overlay';
        flashEl.id = 'bg-flash-overlay';
        var sceneBg = document.getElementById('scene-background');
        if (sceneBg) sceneBg.parentNode.insertBefore(flashEl, sceneBg.nextSibling);
    }

    function processDirectives(directives) {
        if (!directives) return;
        if (!Array.isArray(directives)) directives = [directives];

        var delay = 0;
        directives.forEach(function(dir) {
            var d = dir.delay || 0;
            setTimeout(function() { _executeDirective(dir); }, delay + d);
            if (!dir.noWait && !dir.parallel) delay += (dir.duration || 600);
        });
    }

    function _executeDirective(dir) {
        switch (dir.type) {
            case 'character': _dirCharacter(dir); break;
            case 'removeCharacter': _dirRemoveCharacter(dir); break;
            case 'clearCharacters': clearAllCharacters(); break;
            case 'letterbox': toggleLetterbox(dir.active !== false); break;
            case 'vignette': toggleVignette(dir.active !== false); break;
            case 'tint': setTint(dir.color || 'red', dir.active !== false); break;
            case 'flash': flashScreen(dir.color || 'white'); break;
            case 'shake': shakeScene(dir.intensity || 8, dir.duration || 500); break;
            case 'effect': triggerEffect(dir.name); break;
            case 'bgTransition': bgTransition(dir.gradient || '#000', dir.duration || 1000); break;
            case 'pause': /* handled by story system */ break;
            case 'audio':
                if (GT.AudioSystem && dir.sfx) GT.AudioSystem.playSFX(dir.sfx);
                if (GT.AudioSystem && dir.bgm) GT.AudioSystem.playBGM(dir.bgm);
                break;
            default: break;
        }
    }

    function showCharacter(id, options) {
        options = options || {};
        var charContainer = document.getElementById('scene-characters');
        if (!charContainer) return;

        var el = document.getElementById('char-' + id);
        if (!el) {
            el = document.createElement('div');
            el.id = 'char-' + id;
            el.className = 'character-portrait';
            charContainer.appendChild(el);
        }
        el.style.display = '';
        el.className = 'character-portrait';

        var position = options.position || 'center';
        el.classList.add('character-portrait-' + position);

        if (options.image) {
            el.innerHTML = '<div style="width:' + (options.width || 280) + 'px;height:' + (options.height || 400) + 'px;background:' +
                (options.image.indexOf('linear-gradient') >= 0 ? options.image : '#' + (options.image || '333') ) +
                ';border-radius:8px;box-shadow:inset 0 0 30px rgba(0,0,0,0.5);"></div>';
        } else if (options.emoji) {
            el.innerHTML = '<div style="font-size:120px;text-align:center;line-height:1;">' + options.emoji + '</div>';
        } else if (options.text) {
            el.innerHTML = '<div style="font-size:18px;color:rgba(255,255,255,0.7);text-align:center;padding:20px;writing-mode:vertical-rl;text-orientation:upright;">' + options.text + '</div>';
        } else {
            el.innerHTML = '<div style="width:200px;height:300px;background:rgba(20,10,15,0.9);border-radius:12px;border:1px solid rgba(139,0,0,0.3);display:flex;align-items:center;justify-content:center;"><span style="font-size:80px;opacity:0.3;">?</span></div>';
        }

        if (options.scale) el.style.transform = 'scale(' + options.scale + ')';
        if (options.opacity !== undefined) el.style.opacity = options.opacity;

        var animClass = null;
        switch (options.enter) {
            case 'slideLeft': animClass = 'char-anim-slide-left'; break;
            case 'slideRight': animClass = 'char-anim-slide-right'; break;
            case 'fadeIn': animClass = 'char-anim-fade-in'; break;
            case 'glitch': animClass = 'char-anim-glitch'; break;
            default: break;
        }
        if (animClass) {
            el.classList.add(animClass);
            setTimeout(function() { el.classList.remove(animClass); }, 800);
        }

        if (options.state === 'dimmed') el.classList.add('dimmed');
        else if (options.state === 'highlighted') el.classList.add('highlighted');

        if (options.float) el.classList.add('char-anim-float');
        if (options.shake) { el.classList.add('char-anim-shake'); setTimeout(function() { el.classList.remove('char-anim-shake'); }, 500); }
        if (options.pulseRed) el.classList.add('char-anim-pulse-red');

        _activeCharacters[id] = el;
        return el;
    }

    function _dirCharacter(dir) {
        showCharacter(dir.id || 'unknown', {
            image: dir.image,
            emoji: dir.emoji,
            text: dir.text,
            position: dir.position || 'center',
            enter: dir.enter || 'fadeIn',
            state: dir.state,
            scale: dir.scale,
            opacity: dir.opacity,
            width: dir.width,
            height: dir.height,
            float: dir.float,
            shake: dir.shake,
            pulseRed: dir.pulseRed
        });
    }

    function removeCharacter(id, exitStyle) {
        var el = _activeCharacters[id];
        if (!el) return;
        var animClass = null;
        switch (exitStyle) {
            case 'fade': animClass = 'char-anim-fade-in'; el.style.opacity = '0'; break;
            case 'slideLeft': animClass = 'char-anim-slide-left'; break;
            case 'slideRight': animClass = 'char-anim-slide-right'; break;
            case 'glitch': animClass = 'char-anim-glitch'; break;
            default: el.style.opacity = '0'; el.style.transform = 'scale(0.9)'; break;
        }
        if (animClass) el.classList.add(animClass);
        setTimeout(function() {
            if (el.parentNode) el.parentNode.removeChild(el);
            delete _activeCharacters[id];
        }, exitStyle ? 600 : 400);
    }

    function _dirRemoveCharacter(dir) {
        removeCharacter(dir.id, dir.exit || 'fade');
    }

    function clearAllCharacters(exitStyle) {
        Object.keys(_activeCharacters).forEach(function(id) {
            removeCharacter(id, exitStyle || 'fade');
        });
    }

    function toggleLetterbox(active) {
        active = (active === undefined) ? !_letterboxActive : !!active;
        _letterboxActive = active;
        var container = document.getElementById('game-screen');
        if (container) {
            if (active) container.classList.add('cinematic-letterbox-active');
            else container.classList.remove('cinematic-letterbox-active');
        }
    }

    function toggleVignette(active) {
        active = (active === undefined) ? !_vignetteActive : !!active;
        _vignetteActive = active;
        var el = document.getElementById('cinematic-vignette');
        if (el) {
            if (active) el.classList.add('cinematic-vignette-active');
            else el.classList.remove('cinematic-vignette-active');
        }
    }

    function setTint(color, active) {
        active = (active === undefined) ? true : !!active;
        var el = document.getElementById('cinematic-tint');
        if (!el) return;
        el.className = 'cinematic-tint' + (active ? ' cinematic-tint-' + color : '');
        _tintActive = active ? color : null;
    }

    function flashScreen(color) {
        var el = document.getElementById('bg-flash-overlay');
        if (!el) return;
        el.className = 'bg-flash-overlay bg-flash-' + (color || 'white');
        el.style.opacity = '1';
        setTimeout(function() { el.style.opacity = '0'; }, 250);
    }

    function shakeScene(intensity, duration) {
        var scene = document.getElementById('scene-container');
        if (scene && GT.AnimationSystem) {
            GT.AnimationSystem.shake(scene, intensity || 8, duration || 500);
        }
    }

    function triggerEffect(name) {
        if (GT.AnimationSystem) GT.AnimationSystem.triggerEffect(name);
    }

    function bgTransition(gradient, duration) {
        var bg = document.getElementById('scene-background');
        if (bg) {
            bg.style.transition = 'background ' + (duration / 1000) + 's ease';
            bg.style.background = gradient;
            setTimeout(function() { bg.style.transition = 'background 1s ease'; }, duration + 100);
        }
    }

    function playSequence(sequence) {
        if (!sequence || !sequence.length) return;
        var idx = 0;
        function step() {
            if (idx >= sequence.length) return;
            var item = sequence[idx++];
            if (item.type === 'wait') {
                setTimeout(step, item.duration || 500);
            } else if (item.type === 'parallel') {
                if (item.actions) item.actions.forEach(function(a) { _executeDirective(a); });
                step();
            } else {
                _executeDirective(item);
                if (item.waitAfter) {
                    setTimeout(step, item.waitAfter);
                } else {
                    step();
                }
            }
        }
        step();
    }

    function reset() {
        clearAllCharacters('fade');
        toggleLetterbox(false);
        toggleVignette(false);
        setTint('', false);
        var tintEl = document.getElementById('cinematic-tint');
        if (tintEl) tintEl.className = 'cinematic-tint';
    }

    return {
        init: init,
        processDirectives: processDirectives,
        showCharacter: showCharacter,
        removeCharacter: removeCharacter,
        clearAllCharacters: clearAllCharacters,
        toggleLetterbox: toggleLetterbox,
        toggleVignette: toggleVignette,
        setTint: setTint,
        flashScreen: flashScreen,
        shakeScene: shakeScene,
        triggerEffect: triggerEffect,
        bgTransition: bgTransition,
        playSequence: playSequence,
        reset: reset
    };
})();
