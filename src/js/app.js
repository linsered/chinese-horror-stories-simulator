var GT = window.GT || {};

(function() {
    'use strict';

    function init() {
        GT.Logger.info('App', 'Application starting...');
        GT.Engine.init();
        GT.Logger.info('App', 'Application initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
