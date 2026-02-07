# REBASE - Commands & Scripts Reference

## 📦 NPM Scripts

All these commands are available in your `package.json`:

### Development

```bash
npm run dev
```
Starts the development server at http://localhost:5173/
- Hot Module Reload (HMR) enabled
- Watch for file changes
- Instant feedback during development
- Press `h + enter` in terminal for help

**Usage**: Use this while developing and testing features locally.

### Production Build

```bash
npm run build
```
Creates optimized production build in `dist/` folder
- TypeScript compilation (`tsc -b`)
- Vite production bundling
- Asset optimization
- CSS minification
- JavaScript minification
- Takes ~1-2 seconds

**Usage**: Run before deploying to production. Always test with `npm run preview` first.

### Preview Production Build

```bash
npm run preview
```
Serves the `dist/` folder locally for testing
- Simulates production environment
- Tests optimized bundle
- Verify no build errors
- Check performance metrics

**Usage**: Always run after `npm run build` to verify before deployment.

### Linting (Optional)

```bash
npm run lint
```
Runs ESLint to check code quality
- Finds unused variables
- Detects TypeScript errors
- Reports style issues

**Usage**: Good practice before committing code. Can be integrated into CI/CD.

## 🔧 Direct Commands

### Install Dependencies

```bash
npm install
```
Installs all packages from `package.json`
- Creates `node_modules/` folder
- Generates `package-lock.json`
- Downloads ~170 packages

**Usage**: Run this once after cloning the project.

### Update Dependencies

```bash
npm update
```
Updates packages to latest compatible versions
- Follows semantic versioning
- Updates `package-lock.json`
- Doesn't break compatibility

**Usage**: Periodically to get patches and minor updates.

### Check for Security Issues

```bash
npm audit
```
Scans dependencies for known vulnerabilities
- Lists severity levels
- Shows fix recommendations

**Usage**: Run before deployment, address high/critical issues.

Fix vulnerabilities:
```bash
npm audit fix
npm audit fix --force  # May break compatibility
```

### Clear Cache

```bash
npm cache clean --force
rm -rf node_modules
npm install
```
Clears all npm cache and reinstalls dependencies
- Fixes "phantom" dependency issues
- Solves "works on my machine" problems

**Usage**: Last resort when something won't install properly.

## 🌐 Deployment Commands

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```
One-command deployment to Vercel
- Automatic HTTPS
- Global CDN
- Zero-config

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
Deploy built app to Netlify
- Drag-and-drop alternative
- Git integration available

### Build for Docker

```bash
docker build -t rebase:latest .
docker run -p 3000:3000 rebase:latest
```
Build and run in Docker container
- Consistent environment
- Easy scaling

## 📊 Analysis Commands

### Check Bundle Size

```bash
npm run build -- --stats
```
Shows detailed bundle breakdown
- Which modules contribute most
- Optimization opportunities

Or use online tool:
```bash
# After building, upload dist/assets/ to https://bundlephobia.com/
```

### Run Lighthouse Audit

```bash
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```
Professional performance audit
- Generates detailed report
- Shows performance issues
- Provides solutions

## 🧪 Testing Commands (Setup)

### Initialize Testing

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```
Install testing dependencies

Create `vite.config.ts` test config:
```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
}
```

Run tests:
```bash
npm test
npm test -- --coverage  # With coverage report
```

## 📱 Mobile Testing Commands

### Test on Device via Tunnel

```bash
npm install -g ngrok
npm run dev  # In one terminal

# In another terminal:
ngrok http 5173
```
Share local app with mobile device
- Creates public HTTPS URL
- Test PWA installation
- Works with offline
- Session expires after disconnect

### Preview on Mobile Emulator

Chrome DevTools:
1. F12 → Device Toolbar (Ctrl+Shift+M)
2. Choose device (iPhone 12, Pixel 5, etc.)
3. Test responsive behavior
4. Simulate offline

## 🔍 Debugging Commands

### Open DevTools

```bash
# In Chrome
Cmd+Option+I (Mac)
Ctrl+Shift+I (Windows/Linux)

# For specific tabs:
Cmd+Option+U (Mac) - View source
Cmd+Option+J (Mac) - Console
Cmd+Option+C (Mac) - Inspector
```

### Debug in VS Code

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
```

Then press F5 in VS Code to debug.

### Check for Errors

```bash
# TypeScript compile check
npx tsc --noEmit

# Build without optimization (faster, shows errors)
npm run build 2>&1 | head -20
```

## 📝 Environment Variables

Create `.env` file:
```
VITE_APP_NAME=REBASE
VITE_API_URL=https://api.example.com
VITE_DEBUG=false
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🔗 Useful Shortcuts

### Terminal Quick Commands

```bash
# Go to project directory
cd "Metabolisam tracker"

# Quick shortcuts (add to .zshrc)
alias rebase-dev="cd ~/path/to/project && npm run dev"
alias rebase-build="cd ~/path/to/project && npm run build"
alias rebase-deploy="cd ~/path/to/project && npm run build && vercel"
```

### Browser Shortcuts

```javascript
// In DevTools console:

// Check Zustand store
localStorage.getItem('rebase-store') |> JSON.parse

// Add test data
localStorage.setItem('rebase-store', JSON.stringify({
  selectedDate: '2026-02-07',
  daysData: { /* ... */ }
}))

// Clear all data
localStorage.clear()

// Check Service Worker
navigator.serviceWorker.getRegistrations()

// Check if PWA installable
console.log(window.matchMedia('(display-mode: standalone)').matches)
```

## 🚨 Troubleshooting Commands

### Fix Permissions (if needed)

```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/path/to/project
```

### Hard Reset

```bash
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
npm run build
```

### Clear All Caches

```bash
# Browser cache
# DevTools > Application > Clear site data

# npm cache
npm cache clean --force

# Vite cache
rm -rf .vite

# Build cache
rm -rf dist
```

### Test Service Worker

```bash
# In browser console:
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
  regs.forEach(reg => reg.unregister());
})

# Re-register:
navigator.serviceWorker.register('/sw.js')
```

## 📊 System Requirements Check

```bash
# Check Node version (should be 16+)
node --version

# Check npm version (should be 8+)
npm --version

# Check git
git --version

# Check available disk space
df -h  # Mac/Linux
wmic logicaldisk get size,freespace  # Windows
```

## 📚 Common Workflows

### Start Fresh Development Session

```bash
cd "Metabolisam tracker"
npm run dev
# Then open http://localhost:5173 in browser
```

### Build and Test Locally

```bash
npm run build
npm run preview
# Open http://localhost:4173 in browser
# Test all features
```

### Prepare for Deployment

```bash
npm audit
npm run build
npm run preview
# Run Lighthouse audit
lighthouse http://localhost:4173 --view
# If all good:
npm run build && vercel
```

### Debug an Issue

```bash
# 1. Check console for errors
npm run dev  # Watch terminal output

# 2. Open DevTools
# Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows)

# 3. Check localStorage
# DevTools > Application > Storage > Local Storage

# 4. Check Service Worker
# DevTools > Application > Service Workers

# 5. Check Network
# DevTools > Network > check for failed requests
```

### Add New Package

```bash
npm install package-name
# For dev dependencies only:
npm install --save-dev package-name

# Then import and use in code:
import { something } from 'package-name'
```

## 🎯 Recommended Development Setup

```bash
# 1. Install global tools
npm install -g vercel
npm install -g ngrok
npm install -g lighthouse

# 2. Clone/setup project
cd "Metabolisam tracker"
npm install

# 3. Create VS Code settings
# Create .vscode/settings.json:
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}

# 4. Start development
npm run dev

# 5. Open in browser
open http://localhost:5173
```

## 📋 Daily Commands Cheatsheet

```bash
# Start work
npm run dev

# Make changes and test (automatic reload)

# Before committing
npm run lint
npm run build

# Deploy
npm run build && vercel

# Check for issues
npm audit
lighthouse http://localhost:5173

# Clean up
npm audit fix
npm cache clean --force
```

## ✅ Command Verification

Test that everything works:
```bash
npm run build 2>&1 | grep -i error
echo "Build status: $?"  # Should be 0 (success)

npm run preview &
sleep 2
curl http://localhost:4173 | head -20
# Should show HTML content
```

---

**Need Help?**
- Check README.md for full documentation
- Run `npm run dev` and use DevTools to debug
- Check DEPLOYMENT.md for production commands
- See TESTING.md for test setup

**Version**: 1.0.0  
**Last Updated**: February 7, 2026
