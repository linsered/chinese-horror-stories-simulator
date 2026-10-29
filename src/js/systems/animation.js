var GT = window.GT || {};

GT.AnimationSystem = (function() {
    var _activeAnimations = [];
    var _effectQueue = [];
    var _initialized = false;
    var _lastFrameTime = 0;
    var _targetFPS = 60;
    var _frameInterval = 1000 / _targetFPS;
    var _animationFrameId = null;

    function init() {
        if (_initialized) return;
        _lastFrameTime = performance.now();
        _initialized = true;
        GT.Logger.info('AnimationSystem', 'Animation system initialized');
    }

    function update(delta) {
        var now = performance.now();
        if (now - _lastFrameTime < _frameInterval) return;
        _lastFrameTime = now;

        _activeAnimations = _activeAnimations.filter(function(anim) {
            if (anim.cancelled) return false;
            anim.elapsed += delta;
            var progress = Math.min(anim.elapsed / anim.duration, 1);
            var easedProgress = _ease(anim.easing, progress);
            anim.update(easedProgress, progress);
            if (progress >= 1) {
                if (anim.onComplete) anim.onComplete();
                return false;
            }
            return true;
        });

        _processEffectQueue();
    }

    function _ease(type, t) {
        switch (type) {
            case 'linear': return t;
            case 'easeIn': return t * t * t;
            case 'easeOut': return 1 - Math.pow(1 - t, 3);
            case 'easeInOut': return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            case 'easeInQuad': return t * t;
            case 'easeOutQuad': return 1 - (1 - t) * (1 - t);
            case 'easeOutBounce':
                if (t < 1 / 2.75) return 7.5625 * t * t;
                if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
                if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            default: return t;
        }
    }

    function animate(options) {
        var anim = {
            id: 'anim_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            target: options.target,
            property: options.property,
            from: options.from,
            to: options.to,
            duration: options.duration || 1000,
            easing: options.easing || 'easeInOut',
            elapsed: 0,
            update: options.update || function() {},
            onComplete: options.onComplete || null,
            cancelled: false
        };
        _activeAnimations.push(anim);
        return anim.id;
    }

    function cancel(animationId) {
        _activeAnimations.forEach(function(anim) {
            if (anim.id === animationId) {
                anim.cancelled = true;
            }
        });
    }

    function cancelAll() {
        _activeAnimations.forEach(function(anim) {
            anim.cancelled = true;
        });
        _activeAnimations = [];
    }

    function triggerEffect(effectName) {
        if (!GT.State.get('settings.horrorEffects')) return;

        var effectMap = {
            'ghostAppear': { type: 'screen', className: 'horror-flash', duration: 500 },
            'jumpScare': { type: 'screen', className: 'jump-scare', duration: 300 },
            'screenShake': { type: 'screen', className: 'screen-shake', duration: 600 },
            'glitch': { type: 'screen', className: 'glitch-effect', duration: 800 },
            'fogDense': { type: 'scene', className: 'fog-dense', duration: 3000 },
            'bloodDrip': { type: 'screen', className: 'blood-drip', duration: 2000 },
            'staticNoise': { type: 'screen', className: 'static-noise', duration: 1500 },
            'heartbeat': { type: 'screen', className: 'heartbeat-pulse', duration: 2000 },
            'whisper': { type: 'screen', className: 'whisper-text', duration: 3000 },
            'darkness': { type: 'scene', className: 'darkness-encroach', duration: 5000 }
        };

        var effect = effectMap[effectName];
        if (!effect) return;

        _effectQueue.push(effect);
    }

    function _processEffectQueue() {
        if (_effectQueue.length === 0) return;

        var effect = _effectQueue.shift();
        var container;

        if (effect.type === 'screen') {
            container = document.getElementById('game-container');
        } else if (effect.type === 'scene') {
            container = document.getElementById('scene-container');
        }

        if (!container) return;

        var el = document.createElement('div');
        el.className = 'horror-effect ' + effect.className;
        container.appendChild(el);

        setTimeout(function() {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }, effect.duration);
    }

    function fadeIn(element, duration, callback) {
        duration = duration || 500;
        element.style.opacity = '0';
        element.style.display = '';
        animate({
            target: element,
            duration: duration,
            easing: 'easeOut',
            update: function(eased) {
                element.style.opacity = eased;
            },
            onComplete: function() {
                element.style.opacity = '1';
                if (callback) callback();
            }
        });
    }

    function fadeOut(element, duration, callback) {
        duration = duration || 500;
        animate({
            target: element,
            duration: duration,
            easing: 'easeIn',
            update: function(eased) {
                element.style.opacity = 1 - eased;
            },
            onComplete: function() {
                element.style.opacity = '0';
                element.style.display = 'none';
                if (callback) callback();
            }
        });
    }

    function shake(element, intensity, duration) {
        intensity = intensity || 10;
        duration = duration || 600;
        var originalTransform = element.style.transform || '';

        animate({
            target: element,
            duration: duration,
            easing: 'easeOut',
            update: function(eased) {
                var offset = intensity * (1 - eased);
                var x = (Math.random() - 0.5) * 2 * offset;
                var y = (Math.random() - 0.5) * 2 * offset;
                element.style.transform = originalTransform + ' translate(' + x + 'px, ' + y + 'px)';
            },
            onComplete: function() {
                element.style.transform = originalTransform;
            }
        });
    }

    return {
        init: init,
        update: update,
        animate: animate,
        cancel: cancel,
        cancelAll: cancelAll,
        triggerEffect: triggerEffect,
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        shake: shake
    };
})();
