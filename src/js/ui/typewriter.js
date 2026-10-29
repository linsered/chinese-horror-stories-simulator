var GT = window.GT || {};

GT.Typewriter = (function() {
    var _timer = null;
    var _isTyping = false;
    var _currentElement = null;
    var _fullText = '';
    var _pendingCallback = null;

    function type(element, text, callback) {
        if (_timer) {
            clearInterval(_timer);
            _timer = null;
        }

        _isTyping = true;
        _currentElement = element;
        _fullText = text;
        _pendingCallback = callback || null;

        var speed = GT.State.get('settings.textSpeed');
        var delay = [80, 50, 30, 20, 10][speed - 1] || 30;

        element.textContent = '';
        var indicator = document.getElementById('dialogue-indicator');
        if (indicator) indicator.style.display = 'none';

        var index = 0;
        _timer = setInterval(function() {
            if (index < text.length) {
                element.textContent += text[index];
                index++;

                if (index % 3 === 0 && GT.State.get('settings.horrorEffects')) {
                    var fear = GT.State.get('fear');
                    if (fear > 50 && Math.random() < 0.1) {
                        GT.AnimationSystem.triggerEffect('glitch');
                    }
                }
            } else {
                _complete();
            }
        }, delay);
    }

    function _complete() {
        if (_timer) {
            clearInterval(_timer);
            _timer = null;
        }

        _isTyping = false;
        _currentElement = null;
        _fullText = '';

        var indicator = document.getElementById('dialogue-indicator');
        if (indicator) indicator.style.display = 'block';

        var cb = _pendingCallback;
        _pendingCallback = null;
        if (cb) cb();
    }

    function finish() {
        if (!_isTyping) return;

        if (_currentElement && _fullText) {
            _currentElement.textContent = _fullText;
        }

        _complete();
    }

    function isTyping() {
        return _isTyping;
    }

    function skip() {
        finish();
    }

    function stop() {
        if (_timer) {
            clearInterval(_timer);
            _timer = null;
        }
        _isTyping = false;
        _currentElement = null;
        _fullText = '';
        _pendingCallback = null;
    }

    return {
        type: type,
        finish: finish,
        isTyping: isTyping,
        skip: skip,
        stop: stop
    };
})();
