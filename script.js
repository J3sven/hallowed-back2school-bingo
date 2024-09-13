const app = (() => {
    const appState = JSON.parse(localStorage.getItem('appState')) || {
        activeTab: 'tab1',
        tabs: {}
    };

    const saveState = () => localStorage.setItem('appState', JSON.stringify(appState));

    const loadState = () => {
        document.querySelectorAll('.tab-content').forEach(tabContent => {
            const state = appState.tabs[tabContent.id];
            if (state) {
                tabContent.querySelectorAll('.tile').forEach((tile, index) => {
                    tile.querySelectorAll('input[type="checkbox"]').forEach((checkbox, idx) => {
                        checkbox.checked = state[index].checkboxes[idx];
                    });
                });
            }
        });
    };

    const addEventListeners = () => {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
                button.classList.add('active');
                appState.activeTab = tabId;
                saveState();
            });
        });

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const tabContent = checkbox.closest('.tab-content');
                const tabId = tabContent.id;
                if (!appState.tabs[tabId]) appState.tabs[tabId] = [];
                tabContent.querySelectorAll('.tile').forEach((tile, index) => {
                    const checkboxes = tile.querySelectorAll('input[type="checkbox"]');
                    if (!appState.tabs[tabId][index]) appState.tabs[tabId][index] = { checkboxes: [false, false, false] };
                    checkboxes.forEach((checkbox, idx) => {
                        appState.tabs[tabId][index].checkboxes[idx] = checkbox.checked;
                    });
                });
                saveState();
            });
        });
    };

    const init = () => {
        loadState();
        const lastActiveTab = appState.activeTab || 'tab1';
        document.getElementById(lastActiveTab).classList.add('active');
        document.querySelector(`.tab-button[data-tab="${lastActiveTab}"]`).classList.add('active');
        addEventListeners();
    };

    return { init };
})();

window.addEventListener('load', app.init);
