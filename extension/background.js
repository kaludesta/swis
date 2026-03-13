// Track active tab and time spent
let currentTab = null;
let startTime = null;
let timeData = {}; // Tracks accumulated time locally
let syncedTime = {}; // Tracks what's been synced to server

// API endpoint for your dashboard
const API_URL = 'http://localhost:3000/api';
const DASHBOARD_URL = 'http://localhost:5173';

// Load existing data from storage
chrome.storage.local.get(['timeData', 'syncedTime'], (result) => {
  if (result.timeData) {
    timeData = result.timeData;
  }
  if (result.syncedTime) {
    syncedTime = result.syncedTime;
  }
});

// Auto-detect login from dashboard
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith(DASHBOARD_URL)) {
    // Check if user is logged in by injecting a script
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        return { userId, userName };
      }
    }).then((results) => {
      if (results && results[0] && results[0].result) {
        const { userId, userName } = results[0].result;
        if (userId) {
          // User is logged in, save to extension storage
          chrome.storage.local.set({ userId, userName }, () => {
            console.log('✅ Extension auto-configured for user:', userName);
            // Show notification
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'icons/icon48.png',
              title: 'Time Tracker Active',
              message: `Tracking enabled for ${userName || 'your account'}`,
              priority: 2
            });
          });
        }
      }
    }).catch(err => {
      console.log('Could not check login status:', err);
    });
  }
  
  // Continue with normal tracking
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.windows.get(tab.windowId, (window) => {
      if (window.focused) {
        saveTimeSpent();
        startTracking(tab);
      }
    });
  }
});

// Get domain from URL
function getDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

// Get today's date in YYYY-MM-DD format
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Save time spent on current tab
function saveTimeSpent() {
  if (currentTab && startTime) {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000); // in seconds
    
    const domain = getDomain(currentTab.url);
    if (domain) {
      const today = getToday();
      const key = `${domain}_${today}`;
      
      if (!timeData[key]) {
        timeData[key] = {
          domain,
          url: currentTab.url,
          title: currentTab.title,
          timeSpent: 0,
          date: today
        };
      }
      
      timeData[key].timeSpent += timeSpent;
      timeData[key].url = currentTab.url;
      timeData[key].title = currentTab.title;
      
      // Save to chrome storage
      chrome.storage.local.set({ timeData });
      
      // Sync to server if user is logged in (even if timeSpent is 0)
      syncToServer(timeData[key]);
    }
  }
}

// Sync data to server
async function syncToServer(data) {
  try {
    const { userId } = await chrome.storage.local.get(['userId']);
    
    if (userId) {
      const key = `${data.domain}_${data.date}`;
      
      // Calculate only the NEW time since last sync
      const lastSynced = syncedTime[key] || 0;
      const newTimeSpent = data.timeSpent - lastSynced;
      
      // Only sync if there's new time to report
      if (newTimeSpent > 0) {
        const response = await fetch(`${API_URL}/tracking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: parseInt(userId),
            domain: data.domain,
            url: data.url,
            title: data.title,
            time_spent: newTimeSpent, // Only send NEW time
            visit_date: data.date
          })
        });
        
        if (response.ok) {
          // Update synced time tracker
          syncedTime[key] = data.timeSpent;
          chrome.storage.local.set({ syncedTime });
          console.log('✅ Synced to server:', data.domain, '+' + newTimeSpent + 's (total: ' + data.timeSpent + 's)');
        } else {
          console.error('❌ Sync failed:', response.status, response.statusText);
        }
      }
    } else {
      console.log('⚠️ No userId found - user not logged in');
    }
  } catch (error) {
    console.error('❌ Failed to sync to server:', error);
  }
}

// Start tracking new tab
function startTracking(tab) {
  if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
    currentTab = tab;
    startTime = Date.now();
    
    // Initialize tracking data if needed (but don't sync 0 seconds)
    const domain = getDomain(tab.url);
    if (domain) {
      const today = getToday();
      const key = `${domain}_${today}`;
      
      if (!timeData[key]) {
        timeData[key] = {
          domain,
          url: tab.url,
          title: tab.title,
          timeSpent: 0,
          date: today
        };
        
        // Save to chrome storage
        chrome.storage.local.set({ timeData });
        console.log('📍 Started tracking:', domain);
      }
    }
  }
}

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  const window = await chrome.windows.get(tab.windowId);
  
  if (window.focused) {
    saveTimeSpent();
    startTracking(tab);
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus
    saveTimeSpent();
    currentTab = null;
    startTime = null;
  } else {
    // Browser gained focus
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab) {
      startTracking(tab);
    }
  }
});

// Save data periodically (every 10 seconds for more frequent updates)
setInterval(async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (tab) {
    saveTimeSpent();
    if (currentTab && startTime) {
      startTime = Date.now(); // Reset start time to continue tracking
    }
  } else {
    // No active tab in focused window, pause tracking
    saveTimeSpent();
    currentTab = null;
    startTime = null;
  }
}, 10000);

// Sync all accumulated data to server every 30 seconds
setInterval(async () => {
  const { userId } = await chrome.storage.local.get(['userId']);
  if (userId && Object.keys(timeData).length > 0) {
    console.log('🔄 Auto-syncing all data to server...');
    for (const key in timeData) {
      await syncToServer(timeData[key]);
    }
    console.log('✅ Auto-sync complete');
  }
}, 30000);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTimeData') {
    sendResponse({ timeData });
  } else if (request.action === 'setUserId') {
    chrome.storage.local.set({ userId: request.userId });
    sendResponse({ success: true });
  } else if (request.action === 'getUserInfo') {
    chrome.storage.local.get(['userId', 'userName'], (result) => {
      sendResponse(result);
    });
    return true;
  } else if (request.action === 'syncAll') {
    // Sync all local data to server
    chrome.storage.local.get(['userId', 'timeData'], async (result) => {
      if (result.userId && result.timeData) {
        console.log('🔄 Syncing all local data to server...');
        let synced = 0;
        for (const key in result.timeData) {
          await syncToServer(result.timeData[key]);
          synced++;
        }
        console.log(`✅ Synced ${synced} records to server`);
        sendResponse({ success: true, count: synced });
      } else {
        sendResponse({ success: false, error: 'No data or user not logged in' });
      }
    });
    return true;
  }
  return true;
});

// Check if user is already logged in on extension startup
chrome.runtime.onStartup.addListener(async () => {
  const { userId, userName, timeData: storedData, syncedTime: storedSynced } = await chrome.storage.local.get(['userId', 'userName', 'timeData', 'syncedTime']);
  
  if (storedSynced) {
    syncedTime = storedSynced;
  }
  
  if (userId) {
    console.log('✅ Extension loaded - Tracking active for:', userName);
    
    // Sync any unsaved data from previous session
    if (storedData && Object.keys(storedData).length > 0) {
      console.log('🔄 Syncing data from previous session...');
      let synced = 0;
      for (const key in storedData) {
        await syncToServer(storedData[key]);
        synced++;
      }
      console.log(`✅ Synced ${synced} records from previous session`);
    }
  } else {
    console.log('ℹ️ Extension loaded - Please login to dashboard to enable tracking');
  }
});

// Sync all data before extension is suspended (Chrome may suspend inactive service workers)
chrome.runtime.onSuspend.addListener(async () => {
  console.log('⚠️ Extension suspending - syncing all data...');
  saveTimeSpent(); // Save current tab data
  
  const { userId } = await chrome.storage.local.get(['userId']);
  if (userId && Object.keys(timeData).length > 0) {
    for (const key in timeData) {
      await syncToServer(timeData[key]);
    }
    console.log('✅ All data synced before suspend');
  }
});

console.log('🚀 Academic Time Tracker extension loaded');
