var GT = window.GT || {};

GT.ErrorHandler = (function() {
    var _errorCallbacks = [];
    var _errorHistory = [];
    var _maxHistory = 100;

    function init() {
        window.onerror = function(message, source, lineno, colno, error) {
            handleError({
                type: 'runtime',
                message: message,
                source: source,
                line: lineno,
                column: colno,
                stack: error ? error.stack : null
            });
            return true;
        };

        window.addEventListener('unhandledrejection', function(event) {
            handleError({
                type: 'promise',
                message: event.reason ? event.reason.message || String(event.reason) : 'Unknown promise rejection',
                stack: event.reason ? event.reason.stack : null
            });
        });
    }

    function handleError(errorInfo) {
        var entry = {
            timestamp: Date.now(),
            type: errorInfo.type || 'unknown',
            message: errorInfo.message || 'Unknown error',
            source: errorInfo.source || null,
            line: errorInfo.line || null,
            column: errorInfo.column || null,
            stack: errorInfo.stack || null,
            context: errorInfo.context || null
        };

        _errorHistory.push(entry);
        if (_errorHistory.length > _maxHistory) {
            _errorHistory = _errorHistory.slice(-Math.floor(_maxHistory / 2));
        }

        GT.Logger.error('ErrorHandler', entry.message, entry);

        _errorCallbacks.forEach(function(callback) {
            try {
                callback(entry);
            } catch (e) {
                GT.Logger.error('ErrorHandler', 'Error callback failed', e);
            }
        });
    }

    function tryCatch(fn, context, fallback) {
        try {
            return fn.call(context);
        } catch (e) {
            handleError({
                type: 'tryCatch',
                message: e.message,
                stack: e.stack,
                context: context ? context.constructor.name : 'anonymous'
            });
            if (typeof fallback === 'function') {
                return fallback(e);
            }
            return null;
        }
    }

    function wrapAsync(fn) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return Promise.resolve()
                .then(function() { return fn.apply(null, args); })
                .catch(function(e) {
                    handleError({
                        type: 'async',
                        message: e.message,
                        stack: e.stack
                    });
                    throw e;
                });
        };
    }

    function onError(callback) {
        if (typeof callback === 'function') {
            _errorCallbacks.push(callback);
        }
        return function() {
            var idx = _errorCallbacks.indexOf(callback);
            if (idx > -1) _errorCallbacks.splice(idx, 1);
        };
    }

    function getHistory(count) {
        count = count || 20;
        return _errorHistory.slice(-count);
    }

    function clearHistory() {
        _errorHistory = [];
    }

    return {
        init: init,
        handleError: handleError,
        tryCatch: tryCatch,
        wrapAsync: wrapAsync,
        onError: onError,
        getHistory: getHistory,
        clearHistory: clearHistory
    };
})();
