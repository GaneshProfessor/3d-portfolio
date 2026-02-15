# 3D Portfolio - Isometric Room Style

A beautiful 3D portfolio inspired by Rachel Wei's design, featuring an isometric room with interactive project displays.

## Features ✨

- **Isometric 3D Room** - Cozy bedroom/workspace environment
- **Interactive Objects** - Click on monitor, frames, and hologram to view projects
- **Navigation Menu** - Easy access to different sections
- **Music Player** - Ambient music controls (UI only, add your audio file)
- **Warm Lighting** - Cozy atmosphere with multiple light sources
- **Detailed Furniture** - Desk, bed, bookshelf, chair, plants, and decorations

## How to Run 🚀

```bash
npm run dev
```

Open the URL shown in terminal (usually `http://localhost:5173`)

## Customize Your Portfolio 🎨

### 1. Change Your Name
Edit `index.html` line 18:
```html
<h1 class="portfolio-name">Your Name</h1>
```

### 2. Update Projects
Edit `src/ProjectsData.js` - Replace with your actual projects:
```javascript
project1: {
    title: "Your Project Name",
    description: "What you built...",
    skills: ["React", "Node.js"],
    link: "https://github.com/yourname/project"
}
```

### 3. Change Colors
Edit `src/Room.js` to change room colors:
- Floor: Line 15 `color: 0xd4a574`
- Walls: Line 26 `color: 0xe8d5b7`
- Furniture: Various lines with `color: 0x...`

### 4. Add More Furniture
In `src/Room.js`, add new methods in `createFurniture()` or `createDecorations()`

### 5. Add Real Music
1. Create a `public/music` folder in your project
2. Add your music file (e.g., `lofi-beats.mp3`) to that folder
3. In `main.js`, find the `setupMusicPlayer()` method and uncomment this line:
```javascript
this.audio.src = '/music/lofi-beats.mp3';
```
4. Replace `lofi-beats.mp3` with your actual filename

**Where to get free music:**
- [Pixabay Music](https://pixabay.com/music/) - Free, no attribution required
- [Free Music Archive](https://freemusicarchive.org/) - Various licenses
- [YouTube Audio Library](https://www.youtube.com/audiolibrary) - Free music

**Important:** Use `.mp3` format for best browser compatibility!

## Project Structure 📁

```
├── main.js              # Main app logic, camera, interactions
├── src/
│   ├── Room.js          # 3D room creation and furniture
│   └── ProjectsData.js  # Your project information
├── style.css            # UI styling
├── index.html           # Entry point
└── package.json         # Dependencies
```

## Tips 💡

- **Add more projects**: Create more display objects in `Room.js` and add entries in `ProjectsData.js`
- **Adjust camera**: Change position in `main.js` line 42
- **More decorations**: Use basic shapes (boxes, spheres, cylinders) to create objects
- **Lighting**: Adjust colors and intensity in `setupLights()` method

## Next Steps 🎯

1. Replace "Your Name" with your actual name
2. Update all 4 projects with your real work
3. Add your own color scheme
4. Add more decorative objects
5. (Optional) Add background music file
6. Deploy to Vercel, Netlify, or GitHub Pages

Enjoy building your portfolio! 🎉
