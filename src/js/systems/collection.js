var GT = window.GT || {};

GT.CollectionSystem = (function() {
    var _currentFilter = 'all';

    function init() {}

    function collectGhost(ghostData) {
        var collected = GT.State.get('collectedGhosts') || [];
        if (collected.indexOf(ghostData.id) === -1) {
            collected.push(ghostData.id);
            GT.State.set('collectedGhosts', collected);
            GT.Storage.saveCollectionData(collected);
            GT.State.increment('statistics.ghostsCollected');
            GT.EventBus.emit('collection:ghost-collected', ghostData.id);
        }
    }

    function showScreen() {
        var panel = document.getElementById('side-panel');
        if (panel) panel.style.display = 'none';

        var screen = document.getElementById('collection-screen');
        screen.style.display = 'flex';
        screen.classList.add('active');

        var gameScreen = document.getElementById('game-screen');
        if (gameScreen && gameScreen.classList.contains('active')) {
            gameScreen.classList.add('overlay-open');
        }

        _renderCollection();
    }

    function _renderCollection() {
        var stats = document.getElementById('collection-stats');
        var collected = GT.State.get('collectedGhosts') || [];
        var totalGhosts = _getTotalGhostCount();
        stats.innerHTML =
            '<div class="collection-stat">已收集: ' + collected.length + ' / ' + totalGhosts + '</div>' +
            '<div class="collection-progress-bar"><div class="collection-progress-fill" style="width: ' +
            (totalGhosts > 0 ? (collected.length / totalGhosts * 100) : 0) + '%"></div></div>';

        var filterContainer = document.getElementById('collection-filter');
        filterContainer.innerHTML =
            '<button class="filter-btn active" data-filter="all">全部</button>' +
            '<button class="filter-btn" data-filter="urban_legend">都市传说</button>' +
            '<button class="filter-btn" data-filter="campus">校园怪谈</button>' +
            '<button class="filter-btn" data-filter="network">网络怪谈</button>' +
            '<button class="filter-btn" data-filter="true_crime">真实案件</button>' +
            '<button class="filter-btn" data-filter="folklore">民间传说</button>';

        filterContainer.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterContainer.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                _currentFilter = this.dataset.filter;
                _renderCollectionGrid();
            });
        });

        _renderCollectionGrid();
    }

    function _renderCollectionGrid() {
        var grid = document.getElementById('collection-grid');
        grid.innerHTML = '';
        var collected = GT.State.get('collectedGhosts') || [];

        var allGhosts = _getAllGhosts();
        var filtered = _currentFilter === 'all' ? allGhosts :
            allGhosts.filter(function(g) { return g.category === _currentFilter; });

        filtered.forEach(function(ghost) {
            var isCollected = collected.indexOf(ghost.id) !== -1;
            var card = document.createElement('div');
            card.className = 'collection-card' + (isCollected ? ' collected' : ' locked');
            card.dataset.id = ghost.id;
            card.innerHTML =
                '<div class="card-icon">' + (isCollected ? ghost.icon : '❓') + '</div>' +
                '<div class="card-name">' + (isCollected ? ghost.name : '???') + '</div>' +
                '<div class="card-category">' + _getCategoryLabel(ghost.category) + '</div>';

            if (isCollected) {
                card.addEventListener('click', function() {
                    _showGhostDetail(ghost);
                });
            }
            grid.appendChild(card);
        });
    }

    function _showGhostDetail(ghost) {
        var detail = document.getElementById('collection-detail');
        detail.style.display = 'flex';
        detail.innerHTML =
            '<div class="collection-detail-inner">' +
            '<div class="detail-close" id="detail-close">✕</div>' +
            '<div class="detail-icon-large">' + ghost.icon + '</div>' +
            '<h3 class="detail-title">' + ghost.name + '</h3>' +
            '<div class="detail-category">' + _getCategoryLabel(ghost.category) + '</div>' +
            '<div class="detail-description">' + ghost.description + '</div>' +
            '<div class="detail-background-info">' + (ghost.backgroundInfo || '') + '</div>' +
            '<div class="detail-related-cases">' + (ghost.relatedCases || '') + '</div>' +
            '<div class="detail-perspective">' + (ghost.multiPerspective || '') + '</div>' +
            '</div>';

        document.getElementById('detail-close').addEventListener('click', function(e) {
            e.stopPropagation();
            detail.style.display = 'none';
        });

        detail.addEventListener('click', function(e) {
            if (e.target === detail) {
                detail.style.display = 'none';
            }
        });
    }

    function _getAllGhosts() {
        var ghosts = [];
        var dataSources = [
            { data: GT.UrbanLegendsData, category: 'urban_legend' },
            { data: GT.CampusHorrorData, category: 'campus' },
            { data: GT.NetworkHorrorData, category: 'network' },
            { data: GT.TrueCrimesData, category: 'true_crime' },
            { data: GT.FolkloreData, category: 'folklore' }
        ];

        dataSources.forEach(function(source) {
            if (source.data) {
                for (var key in source.data) {
                    if (source.data.hasOwnProperty(key)) {
                        var ghost = source.data[key];
                        ghost.category = ghost.category || source.category;
                        ghosts.push(ghost);
                    }
                }
            }
        });

        return ghosts;
    }

    function _getTotalGhostCount() {
        return _getAllGhosts().length;
    }

    function _getCategoryLabel(category) {
        var labels = {
            urban_legend: '都市传说',
            campus: '校园怪谈',
            network: '网络怪谈',
            true_crime: '真实案件',
            folklore: '民间传说'
        };
        return labels[category] || category;
    }

    function getCollectedCount() {
        return (GT.State.get('collectedGhosts') || []).length;
    }

    return {
        init: init,
        collectGhost: collectGhost,
        showScreen: showScreen,
        getCollectedCount: getCollectedCount
    };
})();
