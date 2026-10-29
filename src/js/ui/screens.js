var GT = window.GT || {};

GT.Screens = (function() {
    var _screenTransitions = {
        'loading->main-menu': 'fade',
        'main-menu->protagonist-create': 'slide-left',
        'protagonist-create->identity-select': 'slide-left',
        'identity-select->game-screen': 'fade-through-black'
    };

    function getTransition(fromScreen, toScreen) {
        var key = fromScreen + '->' + toScreen;
        return _screenTransitions[key] || 'fade';
    }

    function addTransition(fromScreen, toScreen, type) {
        _screenTransitions[fromScreen + '->' + toScreen] = type;
    }

    function applyTransition(fromEl, toEl, type, callback) {
        switch (type) {
            case 'fade':
                GT.AnimationSystem.fadeOut(fromEl, 300, function() {
                    GT.AnimationSystem.fadeIn(toEl, 300, callback);
                });
                break;
            case 'slide-left':
                fromEl.style.transform = 'translateX(0)';
                toEl.style.transform = 'translateX(100%)';
                toEl.style.display = '';
                GT.AnimationSystem.animate({
                    duration: 400,
                    easing: 'easeOut',
                    update: function(eased) {
                        fromEl.style.transform = 'translateX(' + (-eased * 100) + '%)';
                        toEl.style.transform = 'translateX(' + ((1 - eased) * 100) + '%)';
                    },
                    onComplete: function() {
                        fromEl.style.transform = '';
                        toEl.style.transform = '';
                        if (callback) callback();
                    }
                });
                break;
            case 'fade-through-black':
                var overlay = document.createElement('div');
                overlay.className = 'screen-transition-overlay';
                document.getElementById('game-container').appendChild(overlay);
                GT.AnimationSystem.fadeIn(overlay, 300, function() {
                    fromEl.classList.remove('active');
                    toEl.classList.add('active');
                    setTimeout(function() {
                        GT.AnimationSystem.fadeOut(overlay, 300, function() {
                            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                            if (callback) callback();
                        });
                    }, 200);
                });
                break;
            default:
                fromEl.classList.remove('active');
                toEl.classList.add('active');
                if (callback) callback();
        }
    }

    return {
        getTransition: getTransition,
        addTransition: addTransition,
        applyTransition: applyTransition
    };
})();
