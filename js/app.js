// === No-Login System: Device ID Setup ===

// Check if Device ID exists in localStorage
let deviceId = localStorage.getItem('cpb_device_id');

if (!deviceId) {
    // Generate a new unique Device ID
    deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('cpb_device_id', deviceId);
    console.log("New Device ID created:", deviceId);
} else {
    console.log("Existing Device ID found:", deviceId);
}

// You can use this deviceId later for tracking exam progress
