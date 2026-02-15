# How to Add Background Music 🎵

## Step 1: Create Music Folder

Create a folder structure:
```
3D Portfolio/
├── public/
│   └── music/
│       └── your-music-file.mp3
```

## Step 2: Add Your Music File

1. Download a free music file (see sources below)
2. Make sure it's in `.mp3` format
3. Place it in the `public/music/` folder
4. Name it something simple like `lofi-beats.mp3` or `ambient.mp3`

## Step 3: Enable Music in Code

Open `main.js` and find the `setupMusicPlayer()` method (around line 90).

Uncomment this line:
```javascript
this.audio.src = '/music/lofi-beats.mp3';
```

Change `lofi-beats.mp3` to match your filename.

## Step 4: Test It

1. Run `npm run dev`
2. Click the play button in the top-left music player
3. Your music should play!

## Free Music Sources 🎼

### 1. Pixabay Music (Recommended)
- URL: https://pixabay.com/music/
- License: Free, no attribution required
- Great for: Lofi, ambient, chill beats

### 2. Free Music Archive
- URL: https://freemusicarchive.org/
- License: Various (check each track)
- Great for: Wide variety of genres

### 3. YouTube Audio Library
- URL: https://www.youtube.com/audiolibrary
- License: Free (some require attribution)
- Great for: High-quality tracks

### 4. Incompetech
- URL: https://incompetech.com/music/
- License: Free with attribution
- Great for: Background music

## Tips 💡

- **File size**: Keep music files under 5MB for faster loading
- **Format**: Use `.mp3` for best browser compatibility
- **Volume**: The default volume is set to 50% (0.5)
- **Loop**: Music will automatically loop when it ends
- **Multiple tracks**: You can create a playlist by adding multiple files

## Troubleshooting 🔧

**Music not playing?**
- Check browser console for errors (F12)
- Make sure the file path is correct
- Try clicking the page first (browsers require user interaction to play audio)
- Check if the file is actually in the `public/music/` folder

**Music too loud/quiet?**
- Use the volume slider in the music player
- Or change the default volume in code: `this.audio.volume = 0.3;` (30%)

**Want to change the track name displayed?**
Edit `index.html` lines 23-24:
```html
<div class="track-name">Your Song Name</div>
<div class="artist-name">Artist Name</div>
```

Enjoy your musical portfolio! 🎉
