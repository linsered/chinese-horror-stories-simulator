var GT = window.GT || {};

GT.IdentitySystem = (function() {
    var _selectedIdentity = null;

    function showSelectScreen() {
        _selectedIdentity = null;
        GT.Engine.switchScreen('identity-select');
        _renderIdentityGrid();
        var detail = document.getElementById('identity-detail');
        if (detail) detail.style.display = 'none';
    }

    function _renderIdentityGrid() {
        var grid = document.getElementById('identity-grid');
        if (!grid) return;
        grid.innerHTML = '';
        grid.style.display = '';

        for (var id in GT.IdentityData) {
            if (!GT.IdentityData.hasOwnProperty(id)) continue;
            var identity = GT.IdentityData[id];
            var card = document.createElement('div');
            card.className = 'identity-card';
            card.dataset.id = id;
            card.innerHTML =
                '<div class="identity-icon">' + identity.icon + '</div>' +
                '<div class="identity-name">' + identity.name + '</div>' +
                '<div class="identity-title">' + identity.title + '</div>';
            card.addEventListener('click', function() {
                _selectIdentity(this.dataset.id);
            });
            grid.appendChild(card);
        }
    }

    function _selectIdentity(identityId) {
        _selectedIdentity = identityId;
        var identity = GT.IdentityData[identityId];
        if (!identity) return;

        var grid = document.getElementById('identity-grid');
        if (grid) grid.style.display = 'none';

        var detail = document.getElementById('identity-detail');
        if (!detail) return;
        detail.style.display = 'block';

        var iconEl = document.getElementById('detail-icon');
        if (iconEl) iconEl.textContent = identity.icon;

        var nameEl = document.getElementById('detail-name');
        if (nameEl) nameEl.textContent = identity.name;

        var titleEl = document.getElementById('detail-title');
        if (titleEl) titleEl.textContent = identity.title;

        var bgEl = document.getElementById('detail-background');
        if (bgEl) bgEl.textContent = identity.background;

        var abilitiesContainer = document.getElementById('detail-abilities');
        if (abilitiesContainer) {
            abilitiesContainer.innerHTML =
                '<div class="ability-item"><span>勇气</span><span>' + identity.baseStats.courage + '</span></div>' +
                '<div class="ability-item"><span>感知</span><span>' + identity.baseStats.perception + '</span></div>' +
                '<div class="ability-item"><span>运气</span><span>' + identity.baseStats.luck + '</span></div>';
        }

        var hintContainer = document.getElementById('detail-story-hint');
        if (hintContainer) {
            hintContainer.innerHTML =
                '<div class="story-hint-title">专属剧情提示</div>' +
                '<div class="story-hint-text">' + identity.storyHint + '</div>';
        }

        document.querySelectorAll('.identity-card').forEach(function(card) {
            card.classList.toggle('selected', card.dataset.id === identityId);
        });

        GT.AudioSystem.playSFX('click');
    }

    function confirmSelection() {
        if (!_selectedIdentity) {
            GT.Modal.showAlert('请选择一个身份');
            return;
        }

        GT.State.set('protagonist.identity', _selectedIdentity);
        GT.AudioSystem.playSFX('click');
        GT.Engine.startGame(_selectedIdentity);
    }

    function getSelectedIdentity() {
        return _selectedIdentity;
    }

    function getIdentityDifferences(identityId) {
        var identity = GT.IdentityData[identityId];
        return identity ? identity.differences || {} : {};
    }

    return {
        showSelectScreen: showSelectScreen,
        confirmSelection: confirmSelection,
        getSelectedIdentity: getSelectedIdentity,
        getIdentityDifferences: getIdentityDifferences
    };
})();
