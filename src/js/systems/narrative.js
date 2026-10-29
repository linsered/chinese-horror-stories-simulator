var GT = window.GT || {};

GT.NarrativeSystem = (function() {
    var ICEBERG_LAYERS = {
        SURFACE: 'surface',
        SHALLOW: 'shallow',
        MIDDLE: 'middle',
        DEEP: 'deep',
        ABYSS: 'abyss'
    };

    var _currentLayer = ICEBERG_LAYERS.SURFACE;
    var _discoveredClues = [];
    var _narrativeFlags = {};

    function getLayer() {
        return _currentLayer;
    }

    function setLayer(layer) {
        if (ICEBERG_LAYERS[layer.toUpperCase()] !== undefined) {
            var oldLayer = _currentLayer;
            _currentLayer = ICEBERG_LAYERS[layer.toUpperCase()];
            GT.EventBus.emit('narrative:layer-changed', _currentLayer, oldLayer);
            GT.Logger.info('Narrative', 'Layer changed to: ' + _currentLayer);
        }
    }

    function descendLayer() {
        var layers = Object.values(ICEBERG_LAYERS);
        var currentIndex = layers.indexOf(_currentLayer);
        if (currentIndex < layers.length - 1) {
            setLayer(layers[currentIndex + 1]);
        }
    }

    function addClue(clueId, clueData) {
        if (_discoveredClues.indexOf(clueId) === -1) {
            _discoveredClues.push(clueId);
            GT.EventBus.emit('narrative:clue-discovered', clueId, clueData);
            GT.State.modifyKnowledge(1);
            GT.Logger.info('Narrative', 'Clue discovered: ' + clueId);
        }
    }

    function hasClue(clueId) {
        return _discoveredClues.indexOf(clueId) !== -1;
    }

    function getDiscoveredClues() {
        return _discoveredClues.slice();
    }

    function setFlag(key, value) {
        _narrativeFlags[key] = value;
    }

    function getFlag(key) {
        return _narrativeFlags[key] || false;
    }

    function getIcebergProgress() {
        var layers = Object.values(ICEBERG_LAYERS);
        var currentIndex = layers.indexOf(_currentLayer);
        return (currentIndex + 1) / layers.length;
    }

    function getLayerDescription(layer) {
        var descriptions = {
            surface: '水面之上 - 你所看到的一切看似平常',
            shallow: '浅水区 - 隐约感到不对劲的细节',
            middle: '中层水域 - 真相开始浮出水面',
            deep: '深渊边缘 - 恐怖的真相逐渐清晰',
            abyss: '无底深渊 - 你已无法回头'
        };
        return descriptions[layer || _currentLayer] || '';
    }

    function getLayerFearModifier() {
        var modifiers = {
            surface: 0,
            shallow: 5,
            middle: 10,
            deep: 20,
            abyss: 35
        };
        return modifiers[_currentLayer] || 0;
    }

    function getLayerSanityDrain() {
        var drain = {
            surface: 0,
            shallow: 1,
            middle: 2,
            deep: 4,
            abyss: 8
        };
        return drain[_currentLayer] || 0;
    }

    function exportNarrativeState() {
        return {
            currentLayer: _currentLayer,
            discoveredClues: _discoveredClues.slice(),
            narrativeFlags: JSON.parse(JSON.stringify(_narrativeFlags))
        };
    }

    function importNarrativeState(state) {
        _currentLayer = state.currentLayer || ICEBERG_LAYERS.SURFACE;
        _discoveredClues = state.discoveredClues || [];
        _narrativeFlags = state.narrativeFlags || {};
    }

    function reset() {
        _currentLayer = ICEBERG_LAYERS.SURFACE;
        _discoveredClues = [];
        _narrativeFlags = {};
    }

    return {
        LAYERS: ICEBERG_LAYERS,
        getLayer: getLayer,
        setLayer: setLayer,
        descendLayer: descendLayer,
        addClue: addClue,
        hasClue: hasClue,
        getDiscoveredClues: getDiscoveredClues,
        setFlag: setFlag,
        getFlag: getFlag,
        getIcebergProgress: getIcebergProgress,
        getLayerDescription: getLayerDescription,
        getLayerFearModifier: getLayerFearModifier,
        getLayerSanityDrain: getLayerSanityDrain,
        exportNarrativeState: exportNarrativeState,
        importNarrativeState: importNarrativeState,
        reset: reset
    };
})();
