var GT = window.GT || {};

GT.EndingArchiveSystem = (function() {
    function init() {}

    function showScreen() {
        var panel = document.getElementById('side-panel');
        if (panel) panel.style.display = 'none';

        var screen = document.getElementById('ending-archive-screen');
        screen.style.display = 'flex';
        screen.classList.add('active');

        var gameScreen = document.getElementById('game-screen');
        if (gameScreen && gameScreen.classList.contains('active')) {
            gameScreen.classList.add('overlay-open');
        }

        _renderEndingArchive();
    }

    function _renderEndingArchive() {
        var tree = document.getElementById('ending-tree');
        var list = document.getElementById('ending-list');
        var unlocked = GT.State.get('unlockedEndings') || [];

        tree.innerHTML =
            '<div class="tree-legend">' +
            '<span class="legend-item short-bad">短线坏结局</span>' +
            '<span class="legend-item short-neutral">短线中性结局</span>' +
            '<span class="legend-item long-bad">长线坏结局</span>' +
            '<span class="legend-item long-neutral">长线中性结局</span>' +
            '<span class="legend-item long-good">长线好结局</span>' +
            '<span class="legend-item hidden">隐藏结局</span>' +
            '<span class="legend-item true-ending">真结局</span>' +
            '</div>' +
            '<div class="tree-stats">已解锁: ' + unlocked.length + ' / ' + Object.keys(GT.EndingData || {}).length + '</div>';

        list.innerHTML = '';

        var typeOrder = ['short_bad', 'short_neutral', 'long_bad', 'long_neutral', 'long_good', 'hidden', 'true'];
        var typeLabels = {
            short_bad: '短线坏结局',
            short_neutral: '短线中性结局',
            long_bad: '长线坏结局',
            long_neutral: '长线中性结局',
            long_good: '长线好结局',
            hidden: '隐藏结局',
            true: '真结局'
        };

        typeOrder.forEach(function(type) {
            var typeEndings = GT.EndingSystem.getEndingsByType(type);
            if (typeEndings.length === 0) return;

            var section = document.createElement('div');
            section.className = 'ending-section type-' + type;
            section.innerHTML = '<h3 class="section-title">' + typeLabels[type] + '</h3>';

            typeEndings.forEach(function(ending) {
                var isUnlocked = unlocked.indexOf(ending.id) !== -1;
                var card = document.createElement('div');
                card.className = 'ending-card' + (isUnlocked ? ' unlocked' : ' locked');
                card.innerHTML =
                    '<div class="ending-icon">' + (isUnlocked ? (ending.data.icon || '📜') : '🔒') + '</div>' +
                    '<div class="ending-name">' + (isUnlocked ? ending.data.name : '???') + '</div>' +
                    '<div class="ending-condition">' + (isUnlocked ? ending.data.unlockHint : ending.data.condition || '条件未知') + '</div>';

                if (isUnlocked) {
                    card.addEventListener('click', function() {
                        _showEndingDetail(ending.id, ending.data);
                    });
                }
                section.appendChild(card);
            });

            list.appendChild(section);
        });
    }

    function _showEndingDetail(endingId, endingData) {
        var panel = document.getElementById('side-panel');
        document.getElementById('panel-title').textContent = '结局详情';
        var content = document.getElementById('panel-content');
        content.innerHTML =
            '<div class="ending-detail">' +
            '<div class="ending-detail-icon">' + (endingData.icon || '📜') + '</div>' +
            '<h3>' + endingData.name + '</h3>' +
            '<div class="ending-detail-type">' + endingData.type + '</div>' +
            '<div class="ending-detail-desc">' + endingData.description + '</div>' +
            '<div class="ending-detail-hint">达成条件: ' + (endingData.unlockHint || '未知') + '</div>' +
            '</div>';
        panel.style.display = 'block';
    }

    return {
        init: init,
        showScreen: showScreen
    };
})();
