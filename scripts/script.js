document.addEventListener('DOMContentLoaded', () => {
    const visitorElement = document.getElementById('visitor-count');
    const timeElement = document.getElementById('time-spent');
    const clickElement = document.getElementById('click-count');
    const activityLog = document.getElementById('activity-log');
    const syncStatusElement = document.getElementById('sync-status');

    let visitorId = localStorage.getItem('site_visitor_id');

    if (!visitorId) {
        visitorId = createVisitorId();
        localStorage.setItem('site_visitor_id', visitorId);
    }

    function createVisitorId() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return `user_${window.crypto.randomUUID()}`;
        }

        return `user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    }

    function updateSyncStatus(message, isError = false) {
        if (!syncStatusElement) {
            return;
        }

        syncStatusElement.textContent = message;
        syncStatusElement.classList.toggle('error', isError);
    }

    async function analyticsRequest(path, options = {}) {
        const response = await fetch(`/api/analytics${path}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`Analytics request failed with ${response.status}`);
        }

        return response.json();
    }

    function renderSnapshot(snapshot) {
        visitorElement.textContent = snapshot.uniqueVisitors;
        clickElement.textContent = snapshot.totalLinkClicks;
        renderActivity(snapshot.recentActivity || []);
        updateSyncStatus(`Server synced at ${new Date(snapshot.updatedAt).toLocaleTimeString()}`);
    }

    function renderActivity(activityItems) {
        activityLog.replaceChildren();

        if (activityItems.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'No shared analytics events yet.';
            activityLog.append(emptyItem);
            return;
        }

        activityItems.forEach((activity) => {
            const li = document.createElement('li');
            li.textContent = `[${new Date(activity.timestamp).toLocaleTimeString()}] ${activity.message}`;
            activityLog.append(li);
        });
    }

    async function syncSnapshot() {
        try {
            const snapshot = await analyticsRequest('');
            renderSnapshot(snapshot);
        } catch (error) {
            updateSyncStatus('Analytics server unavailable', true);
            console.error(error);
        }
    }

    async function registerVisit() {
        try {
            const snapshot = await analyticsRequest('/visit', {
                method: 'POST',
                body: JSON.stringify({ visitorId })
            });
            renderSnapshot(snapshot);
        } catch (error) {
            updateSyncStatus('Analytics server unavailable', true);
            console.error(error);
        }
    }

    // Time spent is still per-session, while visitor and click totals are shared.
    let secondsSpent = 0;
    setInterval(() => {
        secondsSpent++;
        const minutes = Math.floor(secondsSpent / 60);
        const seconds = secondsSpent % 60;
        timeElement.textContent = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }, 1000);

    document.addEventListener('click', async (event) => {
        const link = event.target.closest('a');

        if (!link) {
            return;
        }

        event.preventDefault();

        try {
            const snapshot = await analyticsRequest('/click', {
                method: 'POST',
                body: JSON.stringify({
                    visitorId,
                    linkText: link.textContent.trim(),
                    linkHref: link.getAttribute('href')
                })
            });
            renderSnapshot(snapshot);
        } catch (error) {
            updateSyncStatus('Could not record click on server', true);
            console.error(error);
        }
    });

    registerVisit();
    setInterval(syncSnapshot, 5000);
});
