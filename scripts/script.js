document.addEventListener('DOMContentLoaded', () => { 
    // 1. Visitor Tracking (Using localStorage) 
    let visitorId = localStorage.getItem('site_visitor_id'); 
    let totalVisitors = parseInt(localStorage.getItem('site_total_visitors') || '0', 10); 
 
    if (!visitorId) { 
        visitorId = 'user_' + Math.random().toString(36).substring(2, 9); 
        localStorage.setItem('site_visitor_id', visitorId); 
        totalVisitors += 1; 
        localStorage.setItem('site_total_visitors', totalVisitors); 
    } 
    document.getElementById('visitor-count').textContent = totalVisitors; 
 
    // 2. Time Spent Tracking 
    let secondsSpent = 0; 
    const timeElement = document.getElementById('time-spent'); 
     
    setInterval(() => { 
        secondsSpent++; 
        const minutes = Math.floor(secondsSpent / 60); 
        const seconds = secondsSpent % 60; 
        timeElement.textContent = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`; 
    }, 1000); 
 
    // 3. Mouse Clicks on Links Tracking 
    let clickCount = parseInt(localStorage.getItem('site_click_count') || '0', 10); 
    const clickElement = document.getElementById('click-count'); 
    clickElement.textContent = clickCount; 
 
    const activityLog = document.getElementById('activity-log'); 
 
    function logActivity(message) { 
        const li = document.createElement('li'); 
        li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`; 
        activityLog.prepend(li); 
    } 
 
    logActivity(`Visitor session initialized (${visitorId})`); 
 
    document.addEventListener('click', (event) => { 
        const link = event.target.closest('a'); 
        if (link) { 
            event.preventDefault(); // Prevent page jump for demo links 
            clickCount++; 
            localStorage.setItem('site_click_count', clickCount); 
            clickElement.textContent = clickCount; 
 
            const linkText = link.textContent.trim(); 
            const linkHref = link.getAttribute('href'); 
            logActivity(`Clicked link: "${linkText}" (${linkHref})`); 
        } 
    }); 
});
