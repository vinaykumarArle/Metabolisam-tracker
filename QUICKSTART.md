# REBASE - Quick Start Guide

## 🎉 Welcome to REBASE!

You've successfully built a high-fidelity, mobile-first metabolic journal PWA. This guide will help you get started in under 5 minutes.

## 📱 Accessing the App

### Development Mode
The app is currently running at: **http://localhost:5173/**

Open this URL in your browser to see the live application.

### What You'll See
- **Header**: REBASE title with downward arrow icon
- **Calendar Strip**: 7-day weekly view with day selection
- **Weight Input**: Large "Morning Weight" field in kg
- **Entry Area**: Vertical feed for meal/note entries
- **Floating Button**: Blue + button in bottom right

## 🚀 First Steps

### Step 1: Log Your Weight (2 min)
1. Open the app at http://localhost:5173/
2. The current day is highlighted in blue
3. Click the "Morning Weight" input field
4. Enter your weight (e.g., **103** for 103kg)
5. Press Enter or click outside the field
6. Your weight is automatically saved

### Step 2: Add Your First Meal Entry (2 min)
1. Click the blue **+** button in the bottom right
2. A modal dialog appears
3. Type your meal: "3 Eggs, Coffee, Chicken Salad"
4. Click the **Save** button
5. Your entry appears in the feed below
6. Timestamp shows when it was logged

### Step 3: Manage Your Entries (1 min)
1. Look at your entry card in the feed
2. **Edit**: Click the pencil icon to modify
3. **Delete**: Click the trash icon to remove
4. **Navigate**: Click different days to see other entries

### Step 4: Complete Your Day (1 min)
1. Click the **"Complete Day"** button
2. Watch the processing animation (1.2 seconds)
3. A summary card appears with wins
4. The day is marked as complete

## 🎯 Key Features Overview

### Calendar Navigation
- Circles show each day (M, T, W, T, F, S, S)
- Click any day to view/edit its data
- Use ← → arrows to jump between weeks
- Current day highlights in blue

### Weight Tracking
- Per-day weight logging (not global)
- Large, easy-to-read input field
- Supports decimal values (e.g., 102.8kg)
- Displayed prominently at top of each day

### Meal/Note Entries
- Free-form text input
- Timestamp automatically recorded
- Examples:
  - "3 Eggs, Coffee, 2 Toast"
  - "Chicken Salad with Olive Oil"
  - "Water: 2L, Green Tea"
  - "Fasting Window: 16h"
- Edit or delete anytime

### Day Completion
- Summarizes your logged data
- Highlights key wins
- Makes day read-only (visual lock)
- Can be repeated for consistency

### Dark Mode UI
- Easy on the eyes (slate-950 background)
- High contrast text
- Modern, minimal design
- No blinding white screens

### Offline Support
- Works without internet
- All data stored locally
- Service Worker handles caching
- Seamless offline experience

## 💾 Data Management

### Where Your Data Lives
- Browser's localStorage
- Same device only (not synced across devices)
- Persists even after closing the app

### Data Structure
```json
{
  "2026-02-07": {
    "weight": 103,
    "entries": [
      {
        "id": "2026-02-07-12345",
        "content": "3 Eggs, Coffee",
        "timestamp": 1707327600000
      }
    ]
  }
}
```

### Export Your Data
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to "Application" tab
3. Find "Local Storage" > "http://localhost:5173"
4. Copy the value of key `rebase-store`
5. Save to a file for backup

## 🌐 PWA Features (Mobile)

### Install to Home Screen

#### iPhone (Safari)
1. Open http://localhost:5173 in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Enter a name and tap "Add"
5. App icon appears on your home screen
6. Tap to launch as a native-like app

#### Android (Chrome)
1. Open http://localhost:5173 in Chrome
2. Tap three-dot menu (top right)
3. Tap "Install app" or "Add to Home Screen"
4. Confirm the installation
5. App icon appears on home screen

### Offline Usage
1. Open the app once (to cache files)
2. Go airplane mode (or disable WiFi)
3. Reopen the app
4. Everything works from cache
5. New entries are saved locally
6. Sync when online again

## 🎨 Design Highlights

### Color Palette
- **Background**: Dark slate (`#0F172A`)
- **Cards**: Medium slate (`#1E293B`)
- **Primary**: Blue accent (`#3B82F6`)
- **Text**: Light slate (`#F1F5F9`)
- **Borders**: Dark slate (`#1E293B`)

### Typography
- **Font**: Inter, Geist (clean sans-serif)
- **Weight Display**: 4xl-5xl, bold
- **Body Text**: Small-medium, secondary color
- **Timestamps**: Extra small, tertiary color

### Spacing
- Minimal gaps (8-12px)
- Comfortable padding (12-24px)
- Rounded corners (12px on cards)
- Full-width on mobile, centered on desktop

## 🔧 Customization

### Change the App Name
Edit `index.html`:
```html
<title>REBASE - Metabolic Journal</title>
```

### Change Primary Color
Edit `src/components/*.tsx`:
```typescript
className="bg-blue-600" // Change to another color
```

Or update `tailwind.config.js`:
```javascript
colors: {
  primary: "#YOUR_COLOR_HERE"
}
```

### Change Icon
Create `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Your custom icon -->
</svg>
```

## 📚 Full Documentation

For detailed information, see:
- **README.md** - Project overview and architecture
- **DEPLOYMENT.md** - How to deploy to production
- **TESTING.md** - Testing checklist and procedures
- **ROADMAP.md** - Future features and enhancement ideas

## 🚢 Deploying to Production

### Quick Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Build for Production
```bash
npm run build
npm run preview
```

This creates optimized files in the `dist/` folder.

## 🐛 Troubleshooting

### App Won't Load
- Clear browser cache (Cmd+Shift+Delete on Mac, Ctrl+Shift+Delete on Windows)
- Check console for errors (DevTools > Console)
- Try incognito/private mode
- Ensure JavaScript is enabled

### Data Not Saving
- Check localStorage is enabled (DevTools > Application)
- Verify you're not in incognito mode (localStorage doesn't persist)
- Try a different browser
- Clear localStorage and refresh

### Service Worker Not Registering
- Must be HTTPS (local dev uses http which sometimes works)
- Try accessing via ngrok: `ngrok http 5173`
- Check DevTools > Application > Service Workers
- Verify no syntax errors in `public/sw.js`

### Calendar Not Responding
- Check browser console for JavaScript errors
- Try refreshing the page
- Ensure date library (date-fns) is loaded
- Check that Zustand store is initialized

### Modal Backdrop Not Visible
- Check that CSS is loaded (DevTools > Network)
- Verify Tailwind classes are being applied
- Check z-index values in modal component
- Clear browser cache

## 💬 Common Questions

**Q: Can I use this on multiple devices?**
A: Currently, data is stored locally per device. Backend integration (Phase 4) will enable cloud sync.

**Q: Can I export my data?**
A: Yes! See "Export Your Data" section above. Future versions will have one-click export.

**Q: How often should I log entries?**
A: That's up to you! Some users log 3 meals/day, others log snacks too. The app adapts to your style.

**Q: What if I miss a day?**
A: No problem! You can still go back and log for previous days using the calendar.

**Q: Can I share my progress?**
A: Currently, data is private. Phase 2 will add sharing features.

**Q: Is my data secure?**
A: Yes! Everything stays on your device. No data is sent to servers (unless you enable backend sync later).

## 📈 Tips for Success

1. **Log Consistently**: The more consistent you are, the better your insights
2. **Be Specific**: "Chicken Salad" vs just "Salad" gives better data
3. **Include Drinks**: Water, coffee, tea all matter for tracking
4. **Use Comments**: Add notes like "Fasting" or "Cheat Day" for context
5. **Review Weekly**: Look at your progress each week
6. **Complete Days**: Mark days as complete for a clean summary

## 🎯 Example Day Entry

### Morning (07:00)
1. Log weight: **102.8 kg**
2. Add entry: "3 Eggs, Black Coffee, 2 Toast"

### Lunch (12:30)
3. Add entry: "Grilled Chicken Salad, Olive Oil, Water"

### Snack (15:00)
4. Add entry: "Apple, Almonds, Green Tea"

### Dinner (18:30)
5. Add entry: "Salmon, Broccoli, Brown Rice"

### Evening (21:00)
6. Click "Complete Day"
7. Review summary: "Weight Logged, 4 meals tracked, No late carbs"

## 🚀 Next Steps

1. **Explore the app** for 5-10 minutes
2. **Log test data** for 3-4 days to see it in action
3. **Try mobile install** if on a phone
4. **Read DEPLOYMENT.md** when ready to go live
5. **Check ROADMAP.md** for upcoming features

## 📞 Need Help?

1. Check **README.md** for architecture details
2. Review **TESTING.md** for troubleshooting
3. Look at **component files** for implementation details
4. Check browser DevTools for error messages
5. Read code comments in `src/` folder

## 🎉 You're All Set!

Your REBASE metabolic journal PWA is ready to go. Start tracking, stay consistent, and break that weight plateau!

**Happy tracking!** 💪

---

**Quick Links:**
- 🌐 App: http://localhost:5173/
- 📖 README: See README.md
- 🚢 Deploy: See DEPLOYMENT.md
- ✅ Testing: See TESTING.md
- 🗺️ Future: See ROADMAP.md

**Version**: 1.0.0  
**Built**: February 7, 2026  
**Status**: ✅ Production Ready
