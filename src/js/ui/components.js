var GT = window.GT || {};

GT.Components = (function() {
    function createButton(options) {
        var btn = document.createElement('button');
        btn.className = 'menu-btn' + (options.className ? ' ' + options.className : '');
        btn.textContent = options.text || '';
        if (options.id) btn.id = options.id;
        if (options.disabled) btn.disabled = true;
        if (options.onClick) btn.addEventListener('click', options.onClick);
        return btn;
    }

    function createProgressBar(options) {
        var container = document.createElement('div');
        container.className = 'progress-bar-container';
        var bar = document.createElement('div');
        bar.className = 'progress-bar-fill';
        bar.style.width = (options.value || 0) + '%';
        if (options.color) bar.style.backgroundColor = options.color;
        container.appendChild(bar);

        if (options.showLabel) {
            var label = document.createElement('span');
            label.className = 'progress-label';
            label.textContent = (options.value || 0) + '%';
            container.appendChild(label);
        }

        return container;
    }

    function createCard(options) {
        var card = document.createElement('div');
        card.className = 'card' + (options.className ? ' ' + options.className : '');
        if (options.id) card.dataset.id = options.id;

        if (options.icon) {
            var icon = document.createElement('div');
            icon.className = 'card-icon';
            icon.textContent = options.icon;
            card.appendChild(icon);
        }

        if (options.title) {
            var title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = options.title;
            card.appendChild(title);
        }

        if (options.subtitle) {
            var subtitle = document.createElement('div');
            subtitle.className = 'card-subtitle';
            subtitle.textContent = options.subtitle;
            card.appendChild(subtitle);
        }

        if (options.onClick) {
            card.addEventListener('click', options.onClick);
            card.style.cursor = 'pointer';
        }

        return card;
    }

    function createStatBar(options) {
        var container = document.createElement('div');
        container.className = 'stat-bar';

        var label = document.createElement('span');
        label.className = 'stat-label';
        label.textContent = options.label || '';
        container.appendChild(label);

        var barContainer = document.createElement('div');
        barContainer.className = 'stat-bar-track';
        var fill = document.createElement('div');
        fill.className = 'stat-bar-fill';
        fill.style.width = Math.max(0, Math.min(100, options.value || 0)) + '%';
        if (options.color) fill.style.backgroundColor = options.color;
        barContainer.appendChild(fill);
        container.appendChild(barContainer);

        var value = document.createElement('span');
        value.className = 'stat-value';
        value.textContent = (options.value || 0) + (options.max ? '/' + options.max : '');
        container.appendChild(value);

        return container;
    }

    function createTabBar(tabs, onTabChange) {
        var tabBar = document.createElement('div');
        tabBar.className = 'tab-bar';

        tabs.forEach(function(tab, index) {
            var btn = document.createElement('button');
            btn.className = 'tab-btn' + (index === 0 ? ' active' : '');
            btn.textContent = tab.label;
            btn.dataset.tab = tab.id;
            btn.addEventListener('click', function() {
                tabBar.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                if (onTabChange) onTabChange(tab.id);
            });
            tabBar.appendChild(btn);
        });

        return tabBar;
    }

    function createFilterBar(filters, onFilterChange) {
        var filterBar = document.createElement('div');
        filterBar.className = 'filter-bar';

        filters.forEach(function(filter, index) {
            var btn = document.createElement('button');
            btn.className = 'filter-btn' + (index === 0 ? ' active' : '');
            btn.textContent = filter.label;
            btn.dataset.filter = filter.id;
            btn.addEventListener('click', function() {
                filterBar.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                if (onFilterChange) onFilterChange(filter.id);
            });
            filterBar.appendChild(btn);
        });

        return filterBar;
    }

    return {
        createButton: createButton,
        createProgressBar: createProgressBar,
        createCard: createCard,
        createStatBar: createStatBar,
        createTabBar: createTabBar,
        createFilterBar: createFilterBar
    };
})();
