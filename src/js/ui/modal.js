var GT = window.GT || {};

GT.Modal = (function() {
    var _currentModal = null;

    function showAlert(message, callback) {
        _closeExisting();

        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'modal-overlay';

        var modal = document.createElement('div');
        modal.className = 'modal-content alert-modal';
        modal.innerHTML =
            '<div class="modal-message">' + message + '</div>' +
            '<button class="modal-btn" id="modal-confirm">确定</button>';

        overlay.appendChild(modal);
        document.getElementById('game-container').appendChild(overlay);
        _currentModal = overlay;

        document.getElementById('modal-confirm').addEventListener('click', function() {
            _closeExisting();
            if (callback) callback();
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                _closeExisting();
                if (callback) callback();
            }
        });
    }

    function showConfirm(message, onConfirm, onCancel) {
        _closeExisting();

        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'modal-overlay';

        var modal = document.createElement('div');
        modal.className = 'modal-content confirm-modal';
        modal.innerHTML =
            '<div class="modal-message">' + message + '</div>' +
            '<div class="modal-buttons">' +
            '<button class="modal-btn cancel-btn" id="modal-cancel">取消</button>' +
            '<button class="modal-btn confirm-btn" id="modal-confirm">确认</button>' +
            '</div>';

        overlay.appendChild(modal);
        document.getElementById('game-container').appendChild(overlay);
        _currentModal = overlay;

        document.getElementById('modal-confirm').addEventListener('click', function() {
            _closeExisting();
            if (onConfirm) onConfirm();
        });

        document.getElementById('modal-cancel').addEventListener('click', function() {
            _closeExisting();
            if (onCancel) onCancel();
        });
    }

    function showCustom(content, options) {
        _closeExisting();

        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'modal-overlay';

        var modal = document.createElement('div');
        modal.className = 'modal-content custom-modal';
        modal.innerHTML = content;

        overlay.appendChild(modal);
        document.getElementById('game-container').appendChild(overlay);
        _currentModal = overlay;

        if (options && options.onClose) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    _closeExisting();
                    options.onClose();
                }
            });
        }

        return modal;
    }

    function close() {
        _closeExisting();
    }

    function _closeExisting() {
        if (_currentModal) {
            if (_currentModal.parentNode) {
                _currentModal.parentNode.removeChild(_currentModal);
            }
            _currentModal = null;
        }
    }

    return {
        showAlert: showAlert,
        showConfirm: showConfirm,
        showCustom: showCustom,
        close: close
    };
})();
