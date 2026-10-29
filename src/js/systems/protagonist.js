var GT = window.GT || {};

GT.ProtagonistSystem = (function() {
    var _selectedGender = null;
    var _eventsBound = false;

    function showCreateScreen() {
        _resetForm();
        GT.Engine.switchScreen('protagonist-create');
        if (!_eventsBound) {
            _bindCreateFormEvents();
            _eventsBound = true;
        }
    }

    function _resetForm() {
        _selectedGender = null;
        var nameInput = document.getElementById('protagonist-name');
        if (nameInput) nameInput.value = '';
        var genderBtns = document.querySelectorAll('.gender-btn');
        genderBtns.forEach(function(b) { b.classList.remove('selected'); });
        var preview = document.getElementById('protagonist-preview');
        if (preview) preview.innerHTML = '';
    }

    function _bindCreateFormEvents() {
        var genderBtns = document.querySelectorAll('.gender-btn');
        genderBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                genderBtns.forEach(function(b) { b.classList.remove('selected'); });
                this.classList.add('selected');
                _selectedGender = this.dataset.gender;
                _updatePreview();
            });
        });

        var nameInput = document.getElementById('protagonist-name');
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                _updatePreview();
            });
        }
    }

    function _updatePreview() {
        var name = document.getElementById('protagonist-name').value || '无名';
        var gender = _selectedGender || '未选择';
        var genderLabel = gender === 'male' ? '男' : gender === 'female' ? '女' : '未选择';

        var preview = document.getElementById('protagonist-preview');
        if (!preview) return;
        preview.innerHTML =
            '<div class="preview-card">' +
            '<div class="preview-icon">' + (_selectedGender === 'male' ? '👤' : _selectedGender === 'female' ? '👩' : '❓') + '</div>' +
            '<div class="preview-name">' + name + '</div>' +
            '<div class="preview-gender">' + genderLabel + '</div>' +
            '<div class="preview-desc">一个普通人，即将踏入未知的恐怖之中...</div>' +
            '</div>';
    }

    function confirmCreation() {
        var name = document.getElementById('protagonist-name').value.trim();
        if (!name) {
            GT.Modal.showAlert('请输入你的姓名');
            return;
        }
        if (!_selectedGender) {
            GT.Modal.showAlert('请选择你的性别');
            return;
        }

        GT.State.set('protagonist.name', name);
        GT.State.set('protagonist.gender', _selectedGender);

        GT.AudioSystem.playSFX('click');
        GT.IdentitySystem.showSelectScreen();
    }

    function showInfo() {
        var panel = document.getElementById('side-panel');
        if (!panel) return;
        document.getElementById('panel-title').textContent = '角色信息';
        var content = document.getElementById('panel-content');
        if (!content) return;

        var protagonist = GT.State.get('protagonist');
        var identity = GT.IdentityData[protagonist.identity];
        var genderLabel = protagonist.gender === 'male' ? '男' : '女';

        content.innerHTML =
            '<div class="protagonist-info-panel">' +
            '<div class="info-row"><span class="info-label">姓名</span><span class="info-value">' + (protagonist.name || '无名') + '</span></div>' +
            '<div class="info-row"><span class="info-label">性别</span><span class="info-value">' + genderLabel + '</span></div>' +
            '<div class="info-row"><span class="info-label">身份</span><span class="info-value">' + (identity ? identity.name : '未知') + '</span></div>' +
            '<div class="info-separator"></div>' +
            '<div class="info-row"><span class="info-label">理智</span><span class="info-value">' + GT.State.get('sanity') + '/100</span></div>' +
            '<div class="info-row"><span class="info-label">恐惧</span><span class="info-value">' + GT.State.get('fear') + '/100</span></div>' +
            '<div class="info-row"><span class="info-label">认知</span><span class="info-value">' + GT.State.get('knowledge') + '</span></div>' +
            '<div class="info-separator"></div>' +
            '<div class="info-row"><span class="info-label">勇气</span><span class="info-value">' + GT.State.get('courage') + '</span></div>' +
            '<div class="info-row"><span class="info-label">感知</span><span class="info-value">' + GT.State.get('perception') + '</span></div>' +
            '<div class="info-row"><span class="info-label">运气</span><span class="info-value">' + GT.State.get('luck') + '</span></div>' +
            '<div class="info-separator"></div>' +
            '<div class="info-row"><span class="info-label">叙事深度</span><span class="info-value">' + GT.NarrativeSystem.getLayerDescription() + '</span></div>' +
            '</div>';
        panel.style.display = 'block';
    }

    return {
        showCreateScreen: showCreateScreen,
        confirmCreation: confirmCreation,
        showInfo: showInfo
    };
})();
