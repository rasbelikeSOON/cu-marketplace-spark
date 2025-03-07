
// Import constants but don't instantiate OneSignal directly here
// Instead we'll initialize it in a separate function that's called after the app loads

export const ONESIGNAL_APP_ID = "YOUR_ONESIGNAL_APP_ID"; // This should be moved to an environment variable

export const notificationService = {
  /**
   * Initialize OneSignal
   */
  init: () => {
    if (typeof window === 'undefined' || !(window as any).OneSignal) {
      console.warn('OneSignal not available');
      return;
    }
    
    const OneSignal = (window as any).OneSignal;
    
    OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: true,
      },
    });
  },
  
  /**
   * Request notification permission
   */
  requestPermission: async () => {
    if (typeof window === 'undefined' || !(window as any).OneSignal) {
      console.warn('OneSignal not available');
      return false;
    }
    
    try {
      const OneSignal = (window as any).OneSignal;
      const permission = await OneSignal.getNotificationPermission();
      
      if (permission !== 'granted') {
        await OneSignal.showNativePrompt();
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },
  
  /**
   * Set user ID for OneSignal (for targeted notifications)
   */
  setUserId: (userId: string) => {
    if (typeof window === 'undefined' || !(window as any).OneSignal) {
      console.warn('OneSignal not available');
      return;
    }
    
    const OneSignal = (window as any).OneSignal;
    OneSignal.setExternalUserId(userId);
  },
  
  /**
   * Set user tags (for segmented notifications)
   */
  setUserTags: (tags: Record<string, string>) => {
    if (typeof window === 'undefined' || !(window as any).OneSignal) {
      console.warn('OneSignal not available');
      return;
    }
    
    const OneSignal = (window as any).OneSignal;
    OneSignal.sendTags(tags);
  }
};
