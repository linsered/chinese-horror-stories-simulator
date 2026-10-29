var GT = window.GT || {};

GT.Logger = (function() {
    var _LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, SILENT: 4 };
    var _currentLevel = _LOG_LEVELS.INFO;
    var _logHistory = [];
    var _maxHistory = 500;
    var _enableConsole = true;

    function _formatTime() {
        var d = new Date();
        return d.getHours().toString().padStart(2, '0') + ':' +
            d.getMinutes().toString().padStart(2, '0') + ':' +
            d.getSeconds().toString().padStart(2, '0') + '.' +
            d.getMilliseconds().toString().padStart(3, '0');
    }

    function _log(level, module, message, data) {
        if (level < _currentLevel) return;

        var entry = {
            timestamp: Date.now(),
            time: _formatTime(),
            level: level,
            levelName: Object.keys(_LOG_LEVELS).find(function(k) { return _LOG_LEVELS[k] === level; }),
            module: module || 'Core',
            message: message,
            data: data || null
        };

        _logHistory.push(entry);
        if (_logHistory.length > _maxHistory) {
            _logHistory = _logHistory.slice(-Math.floor(_maxHistory / 2));
        }

        if (_enableConsole) {
            var prefix = '[' + entry.time + '][' + entry.levelName + '][' + entry.module + ']';
            switch (level) {
                case _LOG_LEVELS.DEBUG:
                    console.debug(prefix, message, data || '');
                    break;
                case _LOG_LEVELS.INFO:
                    console.info(prefix, message, data || '');
                    break;
                case _LOG_LEVELS.WARN:
                    console.warn(prefix, message, data || '');
                    break;
                case _LOG_LEVELS.ERROR:
                    console.error(prefix, message, data || '');
                    break;
            }
        }
    }

    function debug(module, message, data) { _log(_LOG_LEVELS.DEBUG, module, message, data); }
    function info(module, message, data) { _log(_LOG_LEVELS.INFO, module, message, data); }
    function warn(module, message, data) { _log(_LOG_LEVELS.WARN, module, message, data); }
    function error(module, message, data) { _log(_LOG_LEVELS.ERROR, module, message, data); }

    function setLevel(level) {
        if (_LOG_LEVELS[level] !== undefined) {
            _currentLevel = _LOG_LEVELS[level];
        }
    }

    function getHistory(count) {
        count = count || 50;
        return _logHistory.slice(-count);
    }

    function clearHistory() {
        _logHistory = [];
    }

    function enableConsole(enabled) {
        _enableConsole = !!enabled;
    }

    return {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR',
        SILENT: 'SILENT',
        debug: debug,
        info: info,
        warn: warn,
        error: error,
        setLevel: setLevel,
        getHistory: getHistory,
        clearHistory: clearHistory,
        enableConsole: enableConsole
    };
})();
