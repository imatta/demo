const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 80);
const DATA_FILE = process.env.ANALYTICS_FILE || '/data/analytics.json';
const MAX_ACTIVITY_ITEMS = 25;

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8'
};

const staticRoutes = {
    '/': path.join(__dirname, 'html', 'index.html'),
    '/index.html': path.join(__dirname, 'html', 'index.html'),
    '/style.css': path.join(__dirname, 'css', 'style.css'),
    '/script.js': path.join(__dirname, 'scripts', 'script.js')
};

let analyticsState = loadState();

function defaultState() {
    return {
        visitors: {},
        totalLinkClicks: 0,
        recentActivity: []
    };
}

function loadState() {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        return {
            visitors: data.visitors && typeof data.visitors === 'object' ? data.visitors : {},
            totalLinkClicks: Number.isInteger(data.totalLinkClicks) ? data.totalLinkClicks : 0,
            recentActivity: Array.isArray(data.recentActivity) ? data.recentActivity.slice(0, MAX_ACTIVITY_ITEMS) : []
        };
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.warn(`Could not read analytics data, starting fresh: ${error.message}`);
        }
        return defaultState();
    }
}

function saveState() {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(analyticsState, null, 2));
}

function snapshot() {
    return {
        uniqueVisitors: Object.keys(analyticsState.visitors).length,
        totalLinkClicks: analyticsState.totalLinkClicks,
        recentActivity: analyticsState.recentActivity,
        updatedAt: new Date().toISOString()
    };
}

function addActivity(message) {
    analyticsState.recentActivity.unshift({
        timestamp: new Date().toISOString(),
        message
    });
    analyticsState.recentActivity = analyticsState.recentActivity.slice(0, MAX_ACTIVITY_ITEMS);
}

function normalizeString(value, maxLength) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.trim().slice(0, maxLength);
}

function displayVisitor(visitorId) {
    return visitorId.slice(0, 12);
}

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk;
            if (body.length > 10000) {
                reject(new Error('Request body too large'));
                request.destroy();
            }
        });

        request.on('end', () => {
            if (!body) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(new Error('Invalid JSON body'));
            }
        });

        request.on('error', reject);
    });
}

async function handleApi(request, response) {
    if (request.method === 'GET' && request.url === '/api/analytics') {
        sendJson(response, 200, snapshot());
        return;
    }

    if (request.method === 'POST' && request.url === '/api/analytics/visit') {
        const body = await readJsonBody(request);
        const visitorId = normalizeString(body.visitorId, 128);

        if (!visitorId) {
            sendJson(response, 400, { error: 'visitorId is required' });
            return;
        }

        if (!analyticsState.visitors[visitorId]) {
            analyticsState.visitors[visitorId] = new Date().toISOString();
            addActivity(`New unique visitor recorded (${displayVisitor(visitorId)})`);
            saveState();
        }

        sendJson(response, 200, snapshot());
        return;
    }

    if (request.method === 'POST' && request.url === '/api/analytics/click') {
        const body = await readJsonBody(request);
        const linkText = normalizeString(body.linkText, 120) || 'Untitled link';
        const linkHref = normalizeString(body.linkHref, 200) || '#';

        analyticsState.totalLinkClicks += 1;
        addActivity(`Clicked link: "${linkText}" (${linkHref})`);
        saveState();
        sendJson(response, 200, snapshot());
        return;
    }

    sendJson(response, 404, { error: 'Not found' });
}

function serveStatic(request, response) {
    const pathname = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;
    const filePath = staticRoutes[pathname];

    if (!filePath) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Unable to load page asset');
            return;
        }

        response.writeHead(200, {
            'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
            'Cache-Control': 'no-cache'
        });
        response.end(content);
    });
}

const server = http.createServer(async (request, response) => {
    try {
        const pathname = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;

        if (pathname.startsWith('/api/analytics')) {
            request.url = pathname;
            await handleApi(request, response);
            return;
        }

        serveStatic(request, response);
    } catch (error) {
        console.error(error);
        sendJson(response, 500, { error: 'Internal server error' });
    }
});

server.listen(PORT, () => {
    console.log(`Analytics server listening on port ${PORT}`);
});
