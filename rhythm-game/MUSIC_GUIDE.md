# 🎵 How to Add Your Music

## Quick Start

1. **Add your audio file** to `assets/music/`
   - Supported formats: MP3, WAV, OGG
   - Example: `assets/music/mybeat.mp3`

2. **Create a chart** in `main.js`:

```javascript
// Create new song chart
const myAwesomeSong = createSongChart(
    "My Awesome Song",  // Song name
    140,                // BPM (beats per minute)
    "assets/music/mybeat.mp3"  // Audio file path
);

// Add notes
addNote(myAwesomeSong, 1.0, 'ArrowLeft');   // At 1 second
addNote(myAwesomeSong, 1.5, 'ArrowDown');   // At 1.5 seconds
addNote(myAwesomeSong, 2.0, 'ArrowUp');     // At 2 seconds
addNote(myAwesomeSong, 2.5, 'ArrowRight');  // At 2.5 seconds

// Add to song selection
songs['myawesomesong'] = myAwesomeSong;
```

3. **Update the song picker** in `index.html`:

```html
<select id="song-picker">
    <option value="song1">Sample Song</option>
    <option value="myawesomesong">My Awesome Song</option>
</select>
```

## Finding Beat Timing

### Method 1: Use Audacity (Free!)

1. Open your song in Audacity
2. Click **Analyze** → **Beat Finder**
3. Export beat labels
4. Convert labels to note times

### Method 2: Tap Along

```javascript
// Add this to test timing
let tapTimes = [];
window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        tapTimes.push(game.audio.currentTime);
        console.log('Tap at:', game.audio.currentTime);
    }
});
```

Play your song and tap spacebar on each beat. Check the console for timing!

### Method 3: Calculate from BPM

```javascript
// If your song is exactly 128 BPM:
const bpm = 128;
const beatDuration = 60 / bpm; // 0.46875 seconds per beat

// First beat at 1 second, then every 0.46875 seconds:
addNote(chart, 1.0, 'ArrowLeft');
addNote(chart, 1.0 + beatDuration, 'ArrowDown');
addNote(chart, 1.0 + beatDuration * 2, 'ArrowUp');
// etc...
```

## Chart Creation Tips

### Start Simple
```javascript
// One note per beat
const simple = createSongChart("Easy Song", 120, "easy.mp3");
for (let i = 0; i < 16; i++) {
    const time = 1.0 + (i * 0.5); // One note every 0.5 seconds
    const keys = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'];
    addNote(simple, time, keys[i % 4]);
}
```

### Build Complexity
```javascript
// Faster sections
addNote(chart, 5.0, 'ArrowLeft');
addNote(chart, 5.25, 'ArrowDown');   // Faster!
addNote(chart, 5.5, 'ArrowUp');
addNote(chart, 5.75, 'ArrowRight');

// Double hits
addNote(chart, 6.0, 'ArrowLeft');
addNote(chart, 6.1, 'ArrowLeft');    // Quick double!
```

### PaRappa-Style Patterns
```javascript
// "Teacher" pattern
addNote(chart, 8.0, 'ArrowLeft');
addNote(chart, 8.5, 'ArrowDown');
addNote(chart, 9.0, 'ArrowRight');

// 1 second pause...

// "Student" response (player repeats)
addNote(chart, 10.0, 'ArrowLeft');
addNote(chart, 10.5, 'ArrowDown');
addNote(chart, 11.0, 'ArrowRight');
```

## Advanced: Automatic Chart Generation

```javascript
/**
 * Generate notes automatically from BPM
 */
function generateChartFromBPM(name, bpm, audioUrl, duration, pattern) {
    const chart = createSongChart(name, bpm, audioUrl);
    const beatDuration = 60 / bpm;
    const keys = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'];

    let currentTime = 1.0; // Start at 1 second
    let patternIndex = 0;

    while (currentTime < duration) {
        // Use pattern (e.g., [1, 1, 2, 1] = single, single, double, single)
        const notesPerBeat = pattern[patternIndex % pattern.length];

        for (let i = 0; i < notesPerBeat; i++) {
            addNote(chart, currentTime, keys[Math.floor(Math.random() * 4)]);
            currentTime += beatDuration / notesPerBeat;
        }

        patternIndex++;
    }

    return chart;
}

// Usage:
const autoChart = generateChartFromBPM(
    "Auto Song",
    140,
    "assets/music/auto.mp3",
    30,  // 30 seconds long
    [1, 1, 2, 1, 1, 2, 4, 1]  // Pattern: varies from 1-4 notes per beat
);
```

## Testing Your Chart

1. **Play through it yourself** - Is it fun?
2. **Check timing** - Do notes line up with the music?
3. **Adjust difficulty** - Too easy? Too hard?
4. **Test patterns** - Are they memorable and rhythmic?

## Common Issues

### Notes feel off-sync
- Adjust the `offset` in `RhythmEngine.js`
- Your audio file might have silence at the start

### Too difficult
- Spread notes further apart
- Reduce BPM in the chart (not the actual song BPM)

### Too easy
- Add more complex patterns
- Use faster note sequences
- Add double/triple hits

## Example: Full Song Chart

```javascript
const fullSong = createSongChart("Epic Beat", 128, "assets/music/epic.mp3");

// Intro (sparse)
addNote(fullSong, 1.0, 'ArrowLeft');
addNote(fullSong, 2.0, 'ArrowDown');
addNote(fullSong, 3.0, 'ArrowUp');
addNote(fullSong, 4.0, 'ArrowRight');

// Build up (getting faster)
addNote(fullSong, 5.0, 'ArrowLeft');
addNote(fullSong, 5.5, 'ArrowRight');
addNote(fullSong, 6.0, 'ArrowDown');
addNote(fullSong, 6.5, 'ArrowUp');

// Drop (fast and complex)
const dropStart = 8.0;
const dropPattern = [
    'ArrowLeft', 'ArrowLeft', 'ArrowDown', 'ArrowUp',
    'ArrowRight', 'ArrowRight', 'ArrowUp', 'ArrowDown'
];

dropPattern.forEach((key, i) => {
    addNote(fullSong, dropStart + (i * 0.25), key);
});

songs['epic'] = fullSong;
```

---

🎵 **Happy charting!** Remember: the best charts are playable, memorable, and FUN!
