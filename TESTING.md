# REBASE PWA - Testing Guide

## Manual Testing Checklist

### 1. Core Functionality

#### Calendar Navigation
- [ ] Click on different days in the 7-day strip
- [ ] Verify selected day highlights in blue
- [ ] Click left/right arrows to navigate weeks
- [ ] Verify month/year updates correctly

#### Weight Input
- [ ] Enter weight value (e.g., 103.5)
- [ ] Verify value persists after page refresh
- [ ] Switch to different day and back
- [ ] Verify weight is day-specific, not global
- [ ] Test with decimal values (102.8)

#### Add Entry via FAB
- [ ] Click the blue + button
- [ ] Modal appears with textarea
- [ ] Type a meal entry (e.g., "3 Eggs, Coffee")
- [ ] Click Save button
- [ ] Entry appears in the feed below
- [ ] Click Cancel to close without saving

#### Edit Entry
- [ ] Click pencil icon on an entry
- [ ] Textarea becomes editable
- [ ] Modify the text
- [ ] Click checkmark to save
- [ ] Changes persist

#### Delete Entry
- [ ] Click trash icon on an entry
- [ ] Entry is removed from the feed
- [ ] Refresh page, entry is still gone

#### Day Completion
- [ ] Click "Complete Day" button
- [ ] Processing animation appears (1.2s)
- [ ] Summary card appears with wins
- [ ] Button changes to show "Day Complete"
- [ ] Summary includes weight logged and meal count

### 2. Responsive Design

#### Mobile (375px width)
- [ ] Header is visible and readable
- [ ] Calendar strip fits on screen
- [ ] Day buttons are touch-friendly (44px minimum)
- [ ] Weight input is properly sized
- [ ] FAB is accessible in bottom-right
- [ ] Modal fills screen properly with padding
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling

#### Tablet (768px width)
- [ ] All elements scale appropriately
- [ ] Spacing increases with `sm:` breakpoints
- [ ] Layout remains centered and organized

#### Desktop (1440px+ width)
- [ ] Calendar strip is properly centered
- [ ] Content area has max-width constraint
- [ ] Spacing uses desktop values
- [ ] Modal is centered with backdrop

### 3. Data Persistence

#### localStorage
- [ ] Open DevTools > Application > Local Storage
- [ ] Find `rebase-store` key
- [ ] Data is JSON with entries and weights
- [ ] Refresh page, data persists
- [ ] Close app entirely, data remains

#### Multiple Instances
- [ ] Open app in two tabs
- [ ] Add entry in Tab 1
- [ ] Refresh Tab 2
- [ ] Verify entry appears in Tab 2
- [ ] Edit in Tab 2, verify in Tab 1 after refresh

#### Data Integrity
- [ ] Add multiple entries across days
- [ ] Verify each day has correct entries
- [ ] Verify weights are day-specific
- [ ] Export data (DevTools > Application > Local Storage > Copy)

### 4. Offline Functionality

#### Service Worker Registration
- [ ] DevTools > Application > Service Workers
- [ ] Verify `sw.js` is registered and active
- [ ] Status shows "activated and running"

#### Offline Mode
- [ ] DevTools > Application > Service Workers
- [ ] Check "Offline" checkbox
- [ ] Refresh page
- [ ] App should load from cache
- [ ] All stored data should be visible
- [ ] Add new entry (queued for sync later)
- [ ] Uncheck "Offline"
- [ ] Entry should sync (if backend available)

#### Cache Inspection
- [ ] DevTools > Application > Cache Storage
- [ ] Find `rebase-v1` cache
- [ ] Verify HTML, CSS, JS files are cached
- [ ] Images and fonts are cached

### 5. PWA Installation (Mobile)

#### iOS (Safari)
- [ ] Open app in Safari on iPhone
- [ ] Tap "Share" button
- [ ] Scroll and tap "Add to Home Screen"
- [ ] Choose name and confirm
- [ ] App appears on home screen
- [ ] Tap to launch
- [ ] App opens in fullscreen (no Safari UI)

#### Android (Chrome)
- [ ] Open app in Chrome on Android
- [ ] Tap three-dot menu
- [ ] Look for "Install app" or "Add to Home Screen"
- [ ] Confirm installation
- [ ] App icon appears on home screen
- [ ] Tap to launch in standalone mode

#### Desktop (Chrome)
- [ ] Install icon appears in address bar
- [ ] Click to install
- [ ] App launches in separate window
- [ ] Desktop shortcut created
- [ ] Can be uninstalled from chrome://apps

### 6. Lighthouse Audit

Run in DevTools:
```
DevTools > Lighthouse > PWA (Desktop/Mobile) > Generate report
```

Check:
- [ ] Web app manifest is present
- [ ] Service worker registration succeeds
- [ ] Icons are properly sized and maskable
- [ ] Viewport meta tag is present
- [ ] HTTPS is used
- [ ] Installability score 90+
- [ ] Overall PWA score 90+

Expected scores:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100
- PWA: 100

### 7. Browser Compatibility

Test on:
- [ ] Chrome/Chromium 90+ (desktop)
- [ ] Firefox 88+ (desktop)
- [ ] Safari 14.1+ (desktop & iOS)
- [ ] Edge 90+ (desktop)
- [ ] Chrome Android 90+
- [ ] Samsung Internet 15+

### 8. Performance

#### Bundle Size
- [ ] Build: `npm run build`
- [ ] Check dist/ folder
- [ ] JS files gzipped < 100KB
- [ ] CSS files gzipped < 20KB
- [ ] Total < 150KB

#### Page Load
- [ ] First visit: < 2s load time
- [ ] Subsequent visits: < 500ms (cached)
- [ ] No jank or stuttering during interactions

#### Memory Usage
- [ ] DevTools > Performance > Record
- [ ] Use app for 5 minutes
- [ ] Memory should not grow unbounded
- [ ] No memory leaks visible

### 9. Accessibility

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Order makes sense
- [ ] Focus is visible
- [ ] Can submit forms with Enter key

#### Screen Reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- [ ] All buttons have proper labels
- [ ] Inputs have associated labels
- [ ] Semantic HTML is used
- [ ] No ARIA errors

#### Color Contrast
- [ ] Text has sufficient contrast (WCAG AA)
- [ ] Links are distinguishable
- [ ] DevTools > Lighthouse > Accessibility

### 10. Security

#### HTTPS Only
- [ ] App requires HTTPS (check address bar)
- [ ] No mixed content warnings
- [ ] Service Worker won't register over HTTP

#### localStorage Security
- [ ] No sensitive passwords stored
- [ ] All data is local (no external sync)
- [ ] No XSS vulnerabilities
- [ ] No injection attacks possible

#### CSP Headers (if configured)
- [ ] Check in DevTools > Network
- [ ] Content-Security-Policy header present
- [ ] Only safe origins allowed

## Automated Testing (Future)

```bash
npm install --save-dev vitest @testing-library/react
npm test
```

Test structure:
```
src/
├── components/
│   ├── __tests__/
│   │   ├── DayCalendarStrip.test.tsx
│   │   ├── WeightInput.test.tsx
│   │   ├── EntryModal.test.tsx
│   │   └── JournalCard.test.tsx
├── store/
│   ├── __tests__/
│   │   └── metabolicStore.test.ts
```

## Performance Profiling

### React DevTools Profiler
1. Install React DevTools extension
2. Open DevTools > Profiler
3. Record interaction
4. Identify slow renders
5. Optimize using memo/useMemo

### Chrome DevTools Performance
1. DevTools > Performance
2. Click Record
3. Perform actions
4. Stop recording
5. Analyze flame charts and bottlenecks

## Bug Report Template

```markdown
## Bug Report

**Title**: [Concise description]

**Environment**:
- Browser: Chrome/Firefox/Safari
- OS: Windows/macOS/iOS/Android
- App Version: 1.0.0

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Screenshots**: [If applicable]

**Error Console**:
Any errors in DevTools console

**Severity**: Critical/High/Medium/Low
```

## Testing Scenarios

### Scenario 1: First-Time User
1. Install app fresh
2. Add weight
3. Add 3 meal entries
4. Complete day
5. Switch to previous day
6. Add entry to previous day
7. Complete previous day
8. Verify data integrity

### Scenario 2: Offline User
1. Start online, add data
2. Go offline (airplane mode)
3. Try to add entry
4. Verify entry is saved locally
5. Complete day
6. Go online
7. Verify sync happens

### Scenario 3: Power User
1. Navigate weeks quickly
2. Add entries rapidly
3. Edit multiple entries
4. Delete and re-add entries
5. Complete multiple days
6. Verify all data persists

### Scenario 4: Data Integrity
1. Log 7 days of data
2. Clear browser cache
3. Reopen app
4. Verify all 7 days intact
5. Close browser completely
6. Open in incognito/private
7. Open in different device
8. Each should only show own data

## Regression Testing

After updates, verify:
- [ ] All entries from previous test pass
- [ ] No new console errors
- [ ] Performance not degraded
- [ ] Offline still works
- [ ] Data migration successful (if applicable)

## Sign-Off Checklist

Before production release:
- [ ] All manual tests pass
- [ ] Lighthouse audit scores 90+
- [ ] Mobile installation works
- [ ] Offline mode works
- [ ] Cross-browser testing complete
- [ ] Performance acceptable
- [ ] Security review passed
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped

---

**Testing Status**: ✅ Ready for Production

Last Updated: February 7, 2026
