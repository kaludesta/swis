// Format seconds to readable time
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Get today's date
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Check if user is logged in
chrome.runtime.sendMessage({ action: 'getUserInfo' }, (userInfo) => {
  const statusDiv = document.getElementById('status');
  
  if (userInfo && userInfo.userId) {
    // User is logged in
    statusDiv.innerHTML = `
      <div style="background: #dcfce7; border: 1px solid #86efac; padding: 8px; border-radius: 4px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 12px; color: #166534;">
          ✓ Tracking active for ${userInfo.userName || 'your account'}
        </p>
      </div>
    `;
  } else {
    // User not logged in
    statusDiv.innerHTML = `
      <div style="background: #fef3c7; border: 1px solid #fcd34d; padding: 8px; border-radius: 4px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 12px; color: #92400e;">
          ⚠ Not connected. Please login to the dashboard.
        </p>
      </div>
    `;
  }
});

// Load and display time data
chrome.runtime.sendMessage({ action: 'getTimeData' }, (response) => {
  const timeData = response.timeData;
  const today = getToday();
  
  // Filter today's data
  const todayData = Object.values(timeData).filter(item => item.date === today);
  
  if (todayData.length === 0) {
    document.getElementById('stats').innerHTML = '<div class="empty">No activity tracked today</div>';
    document.getElementById('total').textContent = 'Total: 0m';
    return;
  }
  
  // Sort by time spent
  todayData.sort((a, b) => b.timeSpent - a.timeSpent);
  
  // Calculate total time
  const totalSeconds = todayData.reduce((sum, item) => sum + item.timeSpent, 0);
  document.getElementById('total').textContent = `Total: ${formatTime(totalSeconds)}`;
  
  // Display sites
  const statsHtml = todayData.map(item => `
    <div class="site-item">
      <div class="site-name" title="${item.domain}">${item.domain}</div>
      <div class="site-time">${formatTime(item.timeSpent)}</div>
    </div>
  `).join('');
  
  document.getElementById('stats').innerHTML = statsHtml;
});

// Sync button handler
document.getElementById('syncBtn').addEventListener('click', () => {
  const btn = document.getElementById('syncBtn');
  btn.disabled = true;
  btn.textContent = 'Syncing...';
  
  chrome.runtime.sendMessage({ action: 'syncAll' }, (response) => {
    if (response && response.success) {
      btn.textContent = `✓ Synced ${response.count} records!`;
      setTimeout(() => {
        btn.textContent = 'Sync All to Server';
        btn.disabled = false;
      }, 2000);
    } else {
      btn.textContent = '✗ Sync failed';
      setTimeout(() => {
        btn.textContent = 'Sync All to Server';
        btn.disabled = false;
      }, 2000);
    }
  });
});

// Clear button handler
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all local tracking data? This cannot be undone.')) {
    chrome.storage.local.clear(() => {
      document.getElementById('successMsg').style.display = 'block';
      document.getElementById('stats').innerHTML = '<div class="empty">No activity tracked today</div>';
      document.getElementById('total').textContent = 'Total: 0m';
      
      setTimeout(() => {
        document.getElementById('successMsg').style.display = 'none';
      }, 3000);
    });
  }
});

