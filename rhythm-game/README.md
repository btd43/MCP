# 🎵 Fewture Beats - Rhythm Game

A PaRappa the Rapper-style rhythm game with play-to-earn mechanics using Fewture Tokens!

## 🎮 How to Play

1. Open `index.html` in your web browser
2. Press **Start Game**
3. Use **Arrow Keys** (←↓↑→) to hit the notes as they reach the target line
4. Earn points and **Fewture Tokens** based on your timing!

## ⏱️ Timing System

- **PERFECT** (±50ms): 100 points, 10 tokens 💰
- **GREAT** (±100ms): 75 points, 7 tokens
- **GOOD** (±150ms): 50 points, 5 tokens
- **MISS** (±200ms): 0 points, 0 tokens

## 📁 Project Structure

```
rhythm-game/
├── index.html          # Main game page
├── css/
│   └── style.css       # Game styling
├── js/
│   ├── RhythmEngine.js # Timing and scoring logic
│   ├── Note.js         # Note objects
│   ├── Game.js         # Main game controller
│   └── main.js         # Entry point
└── assets/
    ├── music/          # Put your music files here!
    └── images/         # Game images/sprites
```

## 🎵 Adding Your Own Music

### Method 1: Using the Helper Functions

```javascript
// In main.js, create a new song chart
const mySong = createSongChart("Cool Beat", 140, "assets/music/coolbeat.mp3");

// Add notes (time in seconds, arrow key)
addNote(mySong, 1.0, 'ArrowLeft');
addNote(mySong, 1.5, 'ArrowDown');
addNote(mySong, 2.0, 'ArrowUp');
addNote(mySong, 2.5, 'ArrowRight');

// Add it to the song list
songs['coolbeat'] = mySong;
```

### Method 2: Manual Chart Creation

```javascript
const customSong = {
    name: "My Awesome Track",
    bpm: 128,
    audioUrl: "assets/music/track.mp3",
    notes: [
        { time: 1000, key: 'ArrowLeft' },   // 1 second
        { time: 1500, key: 'ArrowDown' },   // 1.5 seconds
        { time: 2000, key: 'ArrowUp' },     // 2 seconds
        // ... more notes
    ]
};
```

## 💰 Fewture Tokens

Currently, tokens are tracked in-game only. The crypto integration will be added in a future update!

### Planned Features:
- [ ] Web3 wallet connection (MetaMask)
- [ ] Smart contract for token distribution
- [ ] On-chain leaderboard
- [ ] NFT rewards for high scores

## 🎨 Customization

### Change Colors

Edit `css/style.css` to customize:
- Note colors
- Background gradients
- UI elements

### Adjust Difficulty

In `js/RhythmEngine.js`, modify:
- `timingWindows` - Make timing more/less strict
- `scoreValues` - Change point values
- `tokenRewards` - Adjust token earnings

### Change Note Speed

In `js/Note.js`, modify the `speed` property (default: 200 pixels/second)

## 🔧 Technical Details

- Pure vanilla JavaScript (no frameworks!)
- HTML5 Canvas for rendering
- Web Audio API for music playback
- Responsive timing system
- Frame-independent animation

## 🚀 Next Steps

1. **Add your music files** to `assets/music/`
2. **Create note charts** for your songs
3. **Test and tune** timing windows
4. **Add visual effects** (particle systems, etc.)
5. **Integrate Web3** for real token rewards

## 📝 Tips for Creating Charts

1. Use your music editing software to find beat positions
2. Start simple - one note per beat
3. Test frequently to ensure good playability
4. Build up complexity gradually
5. Leave space for "call and response" sections

## 🎓 Call-and-Response Mode (Coming Soon!)

Like PaRappa, this mode will:
- Show a pattern (teacher)
- Wait for you to repeat it (student)
- Grade your accuracy
- Progress through difficulty levels

---

Made with 💜 for rhythm game fans!

**Happy jamming!** 🎸🎹🎤
