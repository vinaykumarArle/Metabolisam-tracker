import React from 'react';

/**
 * REBASE - Metabolic Journal PWA
 * 
 * Quick Start Guide
 * ==================
 * 
 * 1. SELECT A DATE
 *    Use the horizontal 7-day calendar strip at the top.
 *    The selected day has a blue circular highlight.
 * 
 * 2. LOG WEIGHT
 *    Enter your morning weight in the prominent input field.
 *    This is tracked per day in kg.
 * 
 * 3. ADD MEALS/NOTES
 *    - Click the blue + button in the bottom right
 *    - Enter your meal/note (e.g., "3 Eggs, Coffee, Chicken Salad")
 *    - Click Save
 * 
 * 4. MANAGE ENTRIES
 *    - Click the pencil icon to edit
 *    - Click the trash icon to delete
 * 
 * 5. COMPLETE DAY
 *    Click "Complete Day" to:
 *    - Generate a summary with key wins
 *    - Lock the day (no further edits)
 * 
 * ==================
 * 
 * DATA PERSISTENCE
 * All data is saved to browser localStorage automatically.
 * Even if you close the app, your data is preserved.
 * 
 * OFFLINE SUPPORT
 * The app works offline. When you reconnect, the Service Worker
 * will sync the latest cached version.
 * 
 * PWA INSTALLATION
 * On mobile, click "Add to Home Screen" to install as a native-like app.
 * On desktop, click the install icon in the address bar.
 */

export const QUICK_START_GUIDE = `
REBASE - Metabolic Journal PWA

GETTING STARTED
===============

Step 1: Select a Date
  • Use the 7-day calendar at the top
  • Today is highlighted in blue by default
  • Swipe left/right on mobile to see different weeks

Step 2: Log Your Morning Weight
  • Tap the large input field at the top
  • Enter your weight in kilograms (e.g., 103)
  • Your weight is saved immediately

Step 3: Add Meal/Note Entries
  • Tap the blue "+" button at the bottom right
  • Type your meal or note
  • Examples:
    - "3 Eggs, Coffee"
    - "Chicken Salad with Olive Oil"
    - "Water: 2L"
  • Tap "Save" when done

Step 4: Manage Your Entries
  • Each entry shows the time it was added
  • To edit: tap the pencil icon
  • To delete: tap the trash icon
  • Changes are saved automatically

Step 5: Complete Your Day
  • When satisfied with your logging
  • Tap the "Complete Day" button
  • The app generates a summary with wins
  • The day is then locked for final review

FEATURES
========

Dark Mode UI
  • Easy on the eyes, especially at night
  • Modern slate color palette
  • High contrast for readability

Responsive Design
  • Mobile-first approach
  • Works perfectly on phones, tablets, and desktops
  • Touch-optimized buttons and inputs

Offline Support
  • Works without internet connection
  • All data stored locally in your browser
  • No servers, no cloud sync required

PWA Capabilities
  • Install to home screen (mobile)
  • Works offline
  • Smooth animations and transitions
  • Fast loading times

Data Export Tip
  • Your data is stored in browser localStorage
  • You can export via browser DevTools
  • Format: JSON under key "rebase-store"

TIPS & TRICKS
=============

• Calendar Navigation: Click month/year header to jump weeks
• Quick Entry: Use keyboard shortcuts in textarea
• Mobile: Use "Add to Home Screen" for app-like experience
• Consistency: Logging daily helps break weight plateaus
• Detail: Be specific with meals for better tracking

TROUBLESHOOTING
===============

Data Not Saving?
  • Check browser localStorage (usually enabled by default)
  • Try refreshing the page
  • Clear browser cache and reload

Can't Install as App?
  • Use a mobile browser (Chrome, Safari, Edge)
  • Your browser must support PWA install
  • Some browsers may show in menu instead of address bar

Offline Not Working?
  • Service Worker registration might be disabled
  • Check browser settings: Settings > Privacy & Security
  • Try adding to home screen first (enables service worker)

===

Questions? Check README.md for full documentation.
`;

// Example data structure for reference
export const EXAMPLE_DAY_DATA = {
  date: '2026-02-07',
  weight: 102.8,
  entries: [
    {
      id: '2026-02-07-1',
      date: '2026-02-07',
      content: '3 Eggs, Coffee (Black)',
      timestamp: 1707327600000,
    },
    {
      id: '2026-02-07-2',
      date: '2026-02-07',
      content: 'Chicken Salad with Olive Oil Dressing',
      timestamp: 1707335400000,
    },
    {
      id: '2026-02-07-3',
      date: '2026-02-07',
      content: 'Water: 2L, Green Tea',
      timestamp: 1707343200000,
    },
  ],
  isDayComplete: false,
  daySummary: undefined,
};

export const GuideComponent: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 rounded-xl text-slate-300 text-sm space-y-4">
      <h2 className="text-lg font-bold text-slate-50">Getting Started</h2>
      <pre className="whitespace-pre-wrap text-xs font-mono overflow-x-auto">
        {QUICK_START_GUIDE}
      </pre>
    </div>
  );
};
