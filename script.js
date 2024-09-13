const app = (() => {
    const appState = JSON.parse(localStorage.getItem('appState')) || {
        activeTab: 'tab1',  // Default to Tab 1 if nothing is saved
        tabs: {}
    };

    const saveState = () => {
        localStorage.setItem('appState', JSON.stringify(appState));
    };

    const loadState = () => {
        document.querySelectorAll('.tab-content').forEach((tabContent) => {
            const tabId = tabContent.id;
            if (appState.tabs[tabId]) {
                const state = appState.tabs[tabId];
                tabContent.querySelectorAll('.tile').forEach((tile, index) => {
                    const checkboxes = tile.querySelectorAll('input[type="checkbox"]');
                    
                    // Restore checkboxes
                    checkboxes.forEach((checkbox, idx) => {
                        checkbox.checked = state[index].checkboxes[idx];
                    });
                });
            }
        });
    };

    const addEventListeners = () => {
        // Handle tab switching
        document.querySelectorAll('.tab-button').forEach((button) => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;

                // Hide all tabs and remove active state from buttons
                document.querySelectorAll('.tab-content').forEach((tab) => {
                    tab.classList.remove('active');
                });
                document.querySelectorAll('.tab-button').forEach((btn) => {
                    btn.classList.remove('active');
                });

                // Show the clicked tab and set active class on the button
                document.getElementById(tabId).classList.add('active');
                button.classList.add('active');

                appState.activeTab = tabId;  // Save active tab
                saveState();
            });
        });

        // Handle checkbox state changes
        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                const tabContent = checkbox.closest('.tab-content');
                const tabId = tabContent.id;

                if (!appState.tabs[tabId]) {
                    appState.tabs[tabId] = [];
                }

                tabContent.querySelectorAll('.tile').forEach((tile, index) => {
                    const checkboxes = tile.querySelectorAll('input[type="checkbox"]');

                    if (!appState.tabs[tabId][index]) {
                        appState.tabs[tabId][index] = {
                            checkboxes: [false, false, false]
                        };
                    }

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
        const lastActiveTab = appState.activeTab || 'tab1';  // Fallback to tab1
        document.getElementById(lastActiveTab).classList.add('active');  // Open last active tab
        document.querySelector(`.tab-button[data-tab="${lastActiveTab}"]`).classList.add('active');  // Set button to active
        addEventListeners();
    };

    return { init };
})();

window.addEventListener('load', app.init);
