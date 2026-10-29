var GT = window.GT || {};

GT.Loader = (function() {
    var _resources = {};
    var _loadingQueue = [];
    var _loadedCount = 0;
    var _totalCount = 0;
    var _onProgress = null;
    var _onComplete = null;
    var _onError = null;

    function registerResource(id, type, src) {
        _resources[id] = {
            id: id,
            type: type,
            src: src,
            loaded: false,
            data: null,
            error: null
        };
        _loadingQueue.push(id);
        _totalCount++;
    }

    function registerBatch(resources) {
        resources.forEach(function(res) {
            registerResource(res.id, res.type, res.src);
        });
    }

    function loadAll(onProgress, onComplete, onError) {
        _onProgress = onProgress;
        _onComplete = onComplete;
        _onError = onError;
        _loadedCount = 0;

        if (_loadingQueue.length === 0) {
            if (_onComplete) _onComplete();
            return;
        }

        var queue = _loadingQueue.slice();
        _loadingQueue = [];

        queue.forEach(function(id) {
            var resource = _resources[id];
            switch (resource.type) {
                case 'image':
                    _loadImage(resource);
                    break;
                case 'audio':
                    _loadAudio(resource);
                    break;
                case 'json':
                    _loadJSON(resource);
                    break;
                case 'font':
                    _loadFont(resource);
                    break;
                default:
                    resource.loaded = true;
                    _onResourceLoaded(resource);
            }
        });
    }

    function _loadImage(resource) {
        var img = new Image();
        img.onload = function() {
            resource.data = img;
            resource.loaded = true;
            _onResourceLoaded(resource);
        };
        img.onerror = function() {
            resource.error = 'Failed to load image: ' + resource.src;
            resource.loaded = true;
            resource.data = _createPlaceholderImage();
            _onResourceLoaded(resource);
        };
        img.src = resource.src;
    }

    function _loadAudio(resource) {
        var audio = new Audio();
        audio.preload = 'auto';
        audio.oncanplaythrough = function() {
            resource.data = audio;
            resource.loaded = true;
            _onResourceLoaded(resource);
        };
        audio.onerror = function() {
            resource.error = 'Failed to load audio: ' + resource.src;
            resource.loaded = true;
            resource.data = null;
            _onResourceLoaded(resource);
        };
        audio.src = resource.src;
    }

    function _loadJSON(resource) {
        // 容器禁止一切网络请求（fetch / XMLHttpRequest），静态数据已随包打包为 JS 模块
        // JSON 资源无法运行时加载，按错误资源处理并继续加载流程
        resource.error = 'Runtime JSON loading is not supported in offline container: ' + resource.src;
        resource.data = null;
        _onResourceLoaded(resource);
    }

    function _loadFont(resource) {
        if (document.fonts && document.fonts.load) {
            document.fonts.load('16px ' + resource.id).then(function() {
                resource.data = true;
                resource.loaded = true;
                _onResourceLoaded(resource);
            }).catch(function() {
                resource.data = true;
                resource.loaded = true;
                _onResourceLoaded(resource);
            });
        } else {
            setTimeout(function() {
                resource.data = true;
                resource.loaded = true;
                _onResourceLoaded(resource);
            }, 100);
        }
    }

    function _onResourceLoaded(resource) {
        _loadedCount++;
        var progress = _totalCount > 0 ? _loadedCount / _totalCount : 1;

        if (_onProgress) {
            _onProgress(progress, _loadedCount, _totalCount, resource);
        }

        if (resource.error && _onError) {
            _onError(resource);
        }

        if (_loadedCount >= _totalCount && _onComplete) {
            _onComplete();
        }
    }

    function _createPlaceholderImage() {
        var canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 300;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, 200, 300);
        ctx.fillStyle = '#8b0000';
        ctx.font = '14px serif';
        ctx.textAlign = 'center';
        ctx.fillText('加载失败', 100, 155);
        return canvas;
    }

    function get(id) {
        return _resources[id] ? _resources[id].data : null;
    }

    function isLoaded(id) {
        return _resources[id] ? _resources[id].loaded : false;
    }

    function getProgress() {
        return _totalCount > 0 ? _loadedCount / _totalCount : 0;
    }

    function reset() {
        _resources = {};
        _loadingQueue = [];
        _loadedCount = 0;
        _totalCount = 0;
    }

    return {
        registerResource: registerResource,
        registerBatch: registerBatch,
        loadAll: loadAll,
        get: get,
        isLoaded: isLoaded,
        getProgress: getProgress,
        reset: reset
    };
})();
