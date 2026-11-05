// Utility functions for password protection
// These can be called from browser console if needed

export const clearSiteAccess = () => {
  localStorage.removeItem('site_access_granted');
  window.location.reload();
};

export const checkAccessExpiry = () => {
  const stored = localStorage.getItem('site_access_granted');
  if (stored) {
    try {
      const { timestamp } = JSON.parse(stored);
      const expiryTime = timestamp + (24 * 60 * 60 * 1000); // 24 hours
      const now = Date.now();
      const hoursLeft = Math.max(0, Math.round((expiryTime - now) / (1000 * 60 * 60)));
      
      console.log(`Access expires in ${hoursLeft} hours`);
      console.log(`Expiry time: ${new Date(expiryTime)}`);
      
      return {
        isValid: now < expiryTime,
        hoursLeft,
        expiryDate: new Date(expiryTime)
      };
    } catch (e) {
      console.log('Invalid access data stored');
      return { isValid: false, hoursLeft: 0 };
    }
  } else {
    console.log('No access data found');
    return { isValid: false, hoursLeft: 0 };
  }
};

// Make these available globally for console access
if (typeof window !== 'undefined') {
  (window as any).clearSiteAccess = clearSiteAccess;
  (window as any).checkAccessExpiry = checkAccessExpiry;
}