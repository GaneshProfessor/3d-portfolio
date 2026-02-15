# Portfolio Testing Checklist

## Before Deployment - Test on All Devices

### Desktop Testing (Windows/Mac/Linux)
- [ ] Chrome - Test all interactions
- [ ] Firefox - Test all interactions  
- [ ] Safari (Mac) - Test all interactions
- [ ] Edge - Test all interactions

**What to Test:**
1. 3D scene loads properly
2. Camera controls work smoothly (drag to rotate)
3. All menu items clickable (about me, projects, work experience, education, contact)
4. Monitor click opens resume
5. All modals open/close properly
6. ESC key closes modals
7. Click outside modal closes it
8. Music player works (play/pause, volume)
9. Email icons work (both header and contact card)
10. All social links work
11. Education barcode clicks open certificates
12. Project folders open with animation
13. No performance issues (smooth 60fps)

### Mobile Testing (Android)
- [ ] Chrome Mobile
- [ ] Samsung Internet
- [ ] Firefox Mobile

**What to Test:**
1. Touch controls work (pinch to zoom, swipe to rotate)
2. All buttons are large enough to tap (44px minimum)
3. Modals are readable and scrollable
4. Email icon opens Gmail app or mailto
5. WhatsApp link works
6. Performance is acceptable (may be 30fps on older phones)
7. No horizontal scrolling issues
8. Text is readable without zooming

### iOS Testing (iPhone/iPad)
- [ ] Safari iOS
- [ ] Chrome iOS

**What to Test:**
1. Touch controls work smoothly
2. Email icon works (tries Mail app)
3. All gestures work (pinch, swipe)
4. No layout breaking
5. Performance is smooth
6. Audio works (iOS has restrictions)

---

## Known Issues to Fix Before Deployment

### 1. Mobile Performance Issues
**Problem:** Three.js with reflections is heavy for mobile devices

**Solutions:**
- Reduce shadow quality on mobile
- Disable reflections on mobile
- Lower pixel ratio on mobile
- Simplify geometry on mobile

### 2. Touch Controls
**Problem:** Hover effects don't work on touch devices

**Solution:** Add touch event listeners for mobile interactions

### 3. iOS Audio Restrictions
**Problem:** iOS requires user interaction before playing audio

**Solution:** Already handled - play button requires click

### 4. Small Screen Layout
**Problem:** Some modals might be too large on small phones

**Solution:** Add more responsive breakpoints (320px, 480px)

---

## Performance Optimizations Needed

### For Mobile Devices:
```javascript
// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // Reduce quality
    this.renderer.setPixelRatio(1);
    this.renderer.shadowMap.enabled = false;
    // Disable reflections
    // Simplify scene
}
```

### For Low-End Devices:
- Reduce shadow map size
- Disable post-processing effects
- Lower texture quality
- Reduce polygon count

---

## Testing Steps

1. **Start Local Server:**
   ```bash
   npm run dev
   ```

2. **Test on Desktop:**
   - Open in all browsers
   - Test all features
   - Check console for errors

3. **Test on Mobile (Same Network):**
   - Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Access from phone: `http://YOUR_IP:5173`
   - Test all touch interactions

4. **Test on iOS:**
   - Same as mobile testing
   - Pay special attention to Safari-specific issues

5. **Performance Testing:**
   - Open DevTools → Performance tab
   - Record while interacting
   - Check FPS (should be 60fps on desktop, 30fps+ on mobile)

---

## Issues Found (Fill this out during testing)

### Desktop Issues:
- [ ] Issue 1: _______________
- [ ] Issue 2: _______________

### Mobile Issues:
- [ ] Issue 1: _______________
- [ ] Issue 2: _______________

### iOS Issues:
- [ ] Issue 1: _______________
- [ ] Issue 2: _______________

---

## After Testing - Before Deployment

- [ ] All critical issues fixed
- [ ] Performance acceptable on all devices
- [ ] No console errors
- [ ] All links work
- [ ] All images load
- [ ] Music file included (if using)
- [ ] README updated
- [ ] Git committed and pushed

---

## Deployment Checklist

- [ ] Test on local network with mobile devices
- [ ] Fix any issues found
- [ ] Build for production: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Deploy to Vercel/Netlify/Render
- [ ] Test live URL on all devices
- [ ] Share with friends for feedback
