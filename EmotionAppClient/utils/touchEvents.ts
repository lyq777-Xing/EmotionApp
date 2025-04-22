/**
 * Utility to fix passive event listener issues in React Native Web
 * 
 * The issue is that React Native Web uses passive event listeners by default,
 * which prevents preventDefault() from working properly. This causes the warning:
 * "Unable to preventDefault inside passive event listener due to target being treated as passive"
 * 
 * This utility adds non-passive event listeners for touch events to fix this issue.
 */

export function fixTouchEventPassive() {
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    // Only run this in web environments
    const options = {
      passive: false,
    };
    
    // Add non-passive event listeners for touchstart and touchmove
    document.addEventListener('touchstart', () => {}, options);
    document.addEventListener('touchmove', () => {}, options);
    
    // Clean up these listeners when they're no longer needed
    return () => {
      document.removeEventListener('touchstart', () => {}, options);
      document.removeEventListener('touchmove', () => {}, options);
    };
  }
  
  return () => {}; // Return empty cleanup function for non-web environments
}