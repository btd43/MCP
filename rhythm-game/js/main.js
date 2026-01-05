/**
 * Main entry point
 */

// Sample song data (you'll replace this with your actual music)
const sampleSong = {
    name: "Sample Beat",
    bpm: 128,
    audioUrl: "assets/music/sample.mp3", // You'll add your music here
    notes: [
        // Intro pattern - simple alternating arrows
        { time: 1000, key: 'ArrowLeft' },
        { time: 1500, key: 'ArrowDown' },
        { time: 2000, key: 'ArrowUp' },
        { time: 2500, key: 'ArrowRight' },

        // Build up
        { time: 3000, key: 'ArrowLeft' },
        { time: 3500, key: 'ArrowRight' },
        { time: 4000, key: 'ArrowDown' },
        { time: 4500, key: 'ArrowUp' },

        // Faster section
        { time: 5000, key: 'ArrowLeft' },
        { time: 5250, key: 'ArrowDown' },
        { time: 5500, key: 'ArrowUp' },
        { time: 5750, key: 'ArrowRight' },

        { time: 6000, key: 'ArrowRight' },
        { time: 6250, key: 'ArrowUp' },
        { time: 6500, key: 'ArrowDown' },
        { time: 6750, key: 'ArrowLeft' },

        // Complex pattern
        { time: 7000, key: 'ArrowLeft' },
        { time: 7150, key: 'ArrowLeft' },
        { time: 7300, key: 'ArrowDown' },
        { time: 7450, key: 'ArrowUp' },
        { time: 7600, key: 'ArrowRight' },
        { time: 7750, key: 'ArrowRight' },

        // Call and response section (PaRappa style)
        // "Teacher" pattern
        { time: 8500, key: 'ArrowLeft' },
        { time: 8750, key: 'ArrowDown' },
        { time: 9000, key: 'ArrowRight' },

        // "Student" response (you repeat it)
        { time: 10000, key: 'ArrowLeft' },
        { time: 10250, key: 'ArrowDown' },
        { time: 10500, key: 'ArrowRight' },

        // More patterns...
        { time: 11500, key: 'ArrowUp' },
        { time: 11750, key: 'ArrowDown' },
        { time: 12000, key: 'ArrowUp' },
        { time: 12250, key: 'ArrowDown' },

        { time: 13000, key: 'ArrowLeft' },
        { time: 13250, key: 'ArrowRight' },
        { time: 13500, key: 'ArrowLeft' },
        { time: 13750, key: 'ArrowRight' },

        // Final rush
        { time: 14500, key: 'ArrowLeft' },
        { time: 14650, key: 'ArrowDown' },
        { time: 14800, key: 'ArrowUp' },
        { time: 14950, key: 'ArrowRight' },
        { time: 15100, key: 'ArrowLeft' },
        { time: 15250, key: 'ArrowDown' },
        { time: 15400, key: 'ArrowUp' },
        { time: 15550, key: 'ArrowRight' },
    ]
};

// Available songs
const songs = {
    'song1': sampleSong
};

// Game instance
let game = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    game = new Game();

    // Load default song
    game.loadSong(sampleSong);

    // Start button handler
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');

    startBtn.addEventListener('click', () => {
        startMenu.classList.add('hidden');
        game.start();
    });

    // Song selector
    const songPicker = document.getElementById('song-picker');
    songPicker.addEventListener('change', (e) => {
        const selectedSong = songs[e.target.value];
        if (selectedSong) {
            game.loadSong(selectedSong);
        }
    });

    // Handle song end
    game.audio.addEventListener('ended', () => {
        showGameOver();
    });
});

/**
 * Show game over screen
 */
function showGameOver() {
    const startMenu = document.getElementById('start-menu');
    const h1 = startMenu.querySelector('h1');
    const p = startMenu.querySelector('p');
    const startBtn = document.getElementById('start-btn');

    h1.textContent = '🎵 Song Complete! 🎵';
    p.innerHTML = `
        Final Score: ${game.score}<br>
        Max Combo: ${game.maxCombo}<br>
        💰 Fewture Tokens Earned: ${game.fewtureTokens}
    `;
    startBtn.textContent = 'Play Again';

    startMenu.classList.remove('hidden');

    // Reset on click
    startBtn.onclick = () => {
        h1.textContent = '🎵 Fewture Beats 🎵';
        p.textContent = 'Press arrow keys to the beat!';
        startBtn.textContent = 'Start Game';
        startMenu.classList.add('hidden');
        game.start();
    };
}

/**
 * Helper function to create custom song charts
 * This makes it easy to add your own music!
 */
function createSongChart(name, bpm, audioUrl) {
    return {
        name: name,
        bpm: bpm,
        audioUrl: audioUrl,
        notes: []
    };
}

/**
 * Helper to add notes to a chart
 * Usage: addNote(chart, 1.5, 'ArrowLeft') - adds note at 1.5 seconds
 */
function addNote(chart, timeInSeconds, key) {
    chart.notes.push({
        time: timeInSeconds * 1000,
        key: key
    });
}

// Example of creating a custom chart:
// const myChart = createSongChart("My Song", 140, "assets/music/mysong.mp3");
// addNote(myChart, 1.0, 'ArrowLeft');
// addNote(myChart, 1.5, 'ArrowDown');
// addNote(myChart, 2.0, 'ArrowUp');
// songs['mysong'] = myChart;
