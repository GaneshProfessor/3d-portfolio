# Quick Start Guide 🚀

## Run Your Portfolio

```bash
npm run dev
```

Then open the URL shown (usually `http://localhost:5173`)

## What You'll See

1. **Loading screen** - Fades in after 1.5 seconds
2. **3D Room** - Floating on a platform with reflection
3. **Navigation menu** - Top right corner
4. **Music player** - Top left corner (UI only until you add music)
5. **Interactive objects** - Hover and click the glowing items

## Try These Things

### 1. Rotate the Camera
- Click and drag anywhere to rotate around the room
- Scroll to zoom in/out
- You can view from any angle, even from below!

### 2. Hover Over Interactive Objects
- **Monitor** (blue screen on desk)
- **Picture frames** (purple and blue on wall)
- **Hologram** (cyan floating object)

Watch them scale up and float!

### 3. Click Interactive Objects
A panel will appear showing:
- Project title
- Description
- Skills used
- Link to project

### 4. Explore the Room
Look for:
- Laptop on desk
- Coffee mug
- Stacked books
- Nightstand with lamp
- Cushions on bed
- Plants (floor and hanging)
- Wall posters
- Window with glass panes
- Bookshelf with colorful books

## Customize It

### Change Your Name
Edit `index.html` line 18:
```html
<h1 class="portfolio-name">Your Name</h1>
```

### Add Your Projects
Edit `src/ProjectsData.js` - Replace all 4 projects with your real work

### Add Music
1. Put an `.mp3` file in `public/music/`
2. Edit `main.js` line ~92
3. Uncomment: `this.audio.src = '/music/your-file.mp3'`

See `MUSIC_SETUP.md` for details!

### Change Colors
Edit `src/Room.js` - Look for `color: 0x...` values

## Files You Should Edit

1. **index.html** - Your name
2. **src/ProjectsData.js** - Your projects
3. **main.js** - Music file path (optional)

## Files You Can Ignore

- `vite.config.js` - Build configuration
- `package.json` - Dependencies
- `package-lock.json` - Dependency lock file
- `.gitignore` - Git ignore rules

## Need Help?

Check these files:
- `README.md` - Full documentation
- `WHATS_NEW.md` - All new features explained
- `MUSIC_SETUP.md` - How to add music
- `public/music/README.md` - Music folder guide

## Common Issues

**Objects not hovering?**
- Make sure you're hovering over the glowing interactive objects
- Try zooming in closer

**Music not playing?**
- You need to add a music file first (see MUSIC_SETUP.md)
- Click the page first (browsers require user interaction)

**Room looks dark?**
- This is normal - it's a cozy room with warm lighting
- Try rotating to see different angles

**Performance issues?**
- Close other browser tabs
- Lower your browser zoom level
- Check if hardware acceleration is enabled

## What's Next?

1. ✅ Run the portfolio
2. ✅ Explore the room
3. ✅ Test interactions
4. 📝 Add your name
5. 📝 Add your projects
6. 🎵 Add music (optional)
7. 🎨 Customize colors
8. 🚀 Deploy online!

## Deploy Your Portfolio

When ready to share:

### Option 1: Vercel (Recommended)
```bash
npm run build
# Upload the 'dist' folder to Vercel
```

### Option 2: Netlify
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Option 3: GitHub Pages
1. Build: `npm run build`
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in repo settings

Enjoy your 3D portfolio! 🎉
