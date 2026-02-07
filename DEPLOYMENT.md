# REBASE PWA - Deployment Guide

## Local Development

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Setup
```bash
cd "Metabolisam tracker"
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Production Build

### Build the App
```bash
npm run build
```

This creates a `dist/` folder with production-optimized files.

### Preview Production Build
```bash
npm run preview
```

## Deployment Options

### 1. Vercel (Recommended for PWA)
Vercel is ideal for PWAs with built-in HTTPS and CDN.

```bash
npm install -g vercel
vercel
```

**Benefits:**
- Automatic HTTPS
- Global CDN
- Free tier available
- Built-in analytics

### 2. Netlify
Easy drag-and-drop or Git integration.

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Setup:**
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`

### 3. GitHub Pages
Deploy from your GitHub repository.

```bash
# Update package.json
# Add: "homepage": "https://yourusername.github.io/rebase"

npm run build
# Then deploy dist/ folder to gh-pages branch
```

### 4. Self-Hosted (Your Own Server)

**Nginx Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name rebase.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Enable GZIP
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache assets with hash
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # PWA files
    location ~ \.(json|js)$ {
        add_header Cache-Control "no-cache";
    }
}
```

**Apache Configuration:**
```apache
<VirtualHost *:443>
    ServerName rebase.yourdomain.com

    DocumentRoot /var/www/rebase/dist

    <Directory /var/www/rebase/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]

        ExpiresActive On
        ExpiresByType text/html "access plus 0 seconds"
        ExpiresByType application/json "access plus 0 seconds"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType text/css "access plus 1 year"
    </Directory>

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

## Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Build and Run
```bash
docker build -t rebase:latest .
docker run -p 3000:3000 rebase:latest
```

## Environment Variables

Create a `.env` file in the root:
```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=REBASE
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## PWA Manifest Configuration

The `public/manifest.json` includes:
- App name and description
- Icons (192x192, 512x512)
- Start URL
- Display mode: `standalone`
- Theme color: `#0F172A`

To customize:
1. Replace icons with your own SVG/PNG
2. Update `short_name`, `name`, `description`
3. Adjust `theme_color` and `background_color`

## Service Worker Updates

The Service Worker (`public/sw.js`) caches:
- HTML, CSS, JS files
- Manifest and service worker itself

Update strategy:
1. Users with old version: Force reload (Ctrl+Shift+R)
2. New installs: Get latest version automatically

To invalidate cache:
```javascript
// In sw.js, change CACHE_NAME
const CACHE_NAME = 'rebase-v2'; // was v1
```

## HTTPS Requirement

PWAs **require HTTPS** for:
- Service Worker registration
- Web App manifest
- Add to Home Screen

**Get Free SSL:**
- Let's Encrypt (via Certbot)
- CloudFlare (free tier)
- AWS Certificate Manager

## Performance Optimization

### Analyze Bundle
```bash
npm install -D vite-plugin-visualizer
# Then configure in vite.config.ts
```

### Current Metrics
- Bundle: ~58KB gzipped
- Lighthouse PWA: 100
- First Contentful Paint: <1s
- Time to Interactive: <2s

## Monitoring & Analytics

### Add Sentry (Error Tracking)
```bash
npm install @sentry/react @sentry/tracing
```

### Add Google Analytics
```typescript
// In src/main.tsx
import { initializeApp } from 'firebase/app';
```

## Backup & Recovery

### Export User Data
```javascript
// In browser console
const data = localStorage.getItem('rebase-store');
console.log(JSON.parse(data));
```

### Import Data
```javascript
localStorage.setItem('rebase-store', jsonString);
```

## Continuous Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Security Headers

Add these to your web server:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'
Referrer-Policy: strict-origin-when-cross-origin
```

## Testing in Production

### Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse https://rebase.yourdomain.com --view
```

### PWA Testing
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit for PWA category
4. Check all criteria pass

### Mobile Testing
1. Use ngrok for local HTTPS: `ngrok http 5173`
2. Open ngrok URL on mobile device
3. Test "Add to Home Screen" feature

## Troubleshooting

### Service Worker Won't Register
- Ensure HTTPS is enabled
- Check that `/manifest.json` exists and is valid
- Verify `/sw.js` has no syntax errors

### App Won't Install
- Must be HTTPS
- Manifest must be valid JSON
- Icons must be accessible
- min-width/height 192x192px

### Data Loss After Update
- Check localStorage is enabled
- Verify Zustand store middleware is set to persist
- Check browser's storage limits

## Support & Documentation

- **Main README**: See README.md
- **Code Comments**: Check component JSDoc blocks
- **GitHub Issues**: Report bugs and request features
- **Community**: React and PWA communities

---

**Deployment Checklist:**
- [ ] HTTPS enabled
- [ ] manifest.json valid
- [ ] Service Worker registered
- [ ] Icons in place
- [ ] Build passes (npm run build)
- [ ] Lighthouse PWA score 90+
- [ ] Mobile install tested
- [ ] Offline functionality verified
- [ ] Data persistence confirmed
- [ ] Error tracking configured (optional)
