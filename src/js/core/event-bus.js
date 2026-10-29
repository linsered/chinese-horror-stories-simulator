var GT = window.GT || {};

GT.EventBus = (function() {
    var _events = {};
    var _onceEvents = {};
    var _eventHistory = [];
    var _maxHistory = 200;

    function on(event, callback, context) {
        if (!_events[event]) {
            _events[event] = [];
        }
        _events[event].push({
            callback: callback,
            context: context || null
        });
        return function() {
            off(event, callback);
        };
    }

    function once(event, callback, context) {
        var wrappedCallback = function() {
            off(event, wrappedCallback);
            callback.apply(context || null, arguments);
        };
        wrappedCallback._originalCallback = callback;
        return on(event, wrappedCallback, context);
    }

    function off(event, callback) {
        if (!_events[event]) return;

        if (!callback) {
            delete _events[event];
            return;
        }

        _events[event] = _events[event].filter(function(listener) {
            if (listener.callback._originalCallback) {
                return listener.callback._originalCallback !== callback;
            }
            return listener.callback !== callback;
        });

        if (_events[event].length === 0) {
            delete _events[event];
        }
    }

    function emit(event) {
        var args = Array.prototype.slice.call(arguments, 1);

        _eventHistory.push({
            event: event,
            args: args,
            timestamp: Date.now()
        });
        if (_eventHistory.length > _maxHistory) {
            _eventHistory = _eventHistory.slice(-Math.floor(_maxHistory / 2));
        }

        var listeners = _events[event];
        if (!listeners || listeners.length === 0) return;

        listeners.slice().forEach(function(listener) {
            try {
                listener.callback.apply(listener.context, args);
            } catch (e) {
                GT.Logger.error('EventBus', 'Error in event handler: ' + event, e);
            }
        });
    }

    function getListeners(event) {
        return _events[event] ? _events[event].slice() : [];
    }

    function clear() {
        _events = {};
    }

    function getHistory(count) {
        count = count || 50;
        return _eventHistory.slice(-count);
    }

    return {
        on: on,
        once: once,
        off: off,
        emit: emit,
        getListeners: getListeners,
        clear: clear,
        getHistory: getHistory
    };
})();
