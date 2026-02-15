# Music Folder 🎵

Place your music files here!

## Supported Formats:
- `.mp3` (Recommended - best browser support)
- `.wav` (High quality but large file size)
- `.ogg` (Good quality but may not work on Safari/iPhone)

## Recommended:
Use `.mp3` format for maximum compatibility across all browsers and devices.

## File Size:
Keep files under 5MB for faster loading. You can compress audio files using:
- Audacity (free software)
- Online converters like CloudConvert
- FFmpeg command line tool

## Example:
```
public/music/
├── lofi-beats.mp3
├── ambient-chill.mp3
└── README.md (this file)
```

## After Adding Music:
1. Edit `main.js` line ~92
2. Uncomment: `this.audio.src = '/music/your-file.mp3'`
3. Replace `your-file.mp3` with your actual filename

See `MUSIC_SETUP.md` in the root folder for detailed instructions!
