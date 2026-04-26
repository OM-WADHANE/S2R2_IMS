(function () {
    var STORAGE_KEY = 's2r2-sidebar-collapsed';

    function applyCollapsed(collapsed) {
        document.body.classList.toggle('sidebar-collapsed', collapsed);
        var btn = document.getElementById('sidebarCollapse');
        if (btn) {
            btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            btn.setAttribute(
                'aria-label',
                collapsed ? 'Expand navigation' : 'Collapse navigation'
            );
            btn.setAttribute('title', collapsed ? 'Expand menu' : 'Collapse menu');
        }
    }

    function init() {
        if (window.matchMedia('(min-width: 768px)').matches) {
            applyCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
        }

        var collapseBtn = document.getElementById('sidebarCollapse');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', function () {
                var next = !document.body.classList.contains('sidebar-collapsed');
                applyCollapsed(next);
                localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
            });
        }

        window.addEventListener('resize', function () {
            if (!window.matchMedia('(min-width: 768px)').matches) {
                document.body.classList.remove('sidebar-collapsed');
            } else {
                applyCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
