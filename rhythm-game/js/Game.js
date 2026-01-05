/**
 * Game - Main game controller
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.audio = document.getElementById('game-audio');

        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 420;

        // Game state
        this.isPlaying = false;
        this.isPaused = false;

        // Game objects
        this.rhythmEngine = new RhythmEngine();
        this.notes = [];
        this.activeNotes = [];

        // Scoring
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.fewtureTokens = 0;

        // Lane configuration
        this.lanes = [
            { key: 'ArrowLeft', x: 165 },
            { key: 'ArrowDown', x: 275 },
            { key: 'ArrowUp', x: 385 },
            { key: 'ArrowRight', x: 495 }
        ];
        this.targetY = 320; // Where notes should be hit

        // Input tracking
        this.keysPressed = new Set();

        // Animation
        this.lastTime = 0;

        // Bind methods
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
    }

    /**
     * Load a song chart
     */
    loadSong(songData) {
        this.notes = [];
        this.rhythmEngine.bpm = songData.bpm || 120;

        // Generate notes from chart data
        songData.notes.forEach(noteData => {
            const note = new Note(
                noteData.time,
                noteData.key,
                this.getLaneIndex(noteData.key)
            );
            this.notes.push(note);
        });

        // Sort notes by time
        this.notes.sort((a, b) => a.time - b.time);

        // Load audio
        this.audio.src = songData.audioUrl;
    }

    /**
     * Get lane index from key
     */
    getLaneIndex(key) {
        return this.lanes.findIndex(lane => lane.key === key);
    }

    /**
     * Start the game
     */
    start() {
        this.isPlaying = true;
        this.score = 0;
        this.combo = 0;
        this.fewtureTokens = 0;
        this.activeNotes = [...this.notes];

        // Start audio
        this.audio.currentTime = 0;
        this.audio.play();

        // Start rhythm engine
        this.rhythmEngine.start(this.audio);

        // Add event listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);

        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);

        // Update UI
        this.updateUI();
    }

    /**
     * Handle key down
     */
    handleKeyDown(event) {
        if (!this.isPlaying || this.keysPressed.has(event.key)) return;

        const validKeys = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'];
        if (!validKeys.includes(event.key)) return;

        event.preventDefault();
        this.keysPressed.add(event.key);

        // Visual feedback
        const lane = document.querySelector(`.note-lane[data-key="${event.key}"]`);
        if (lane) lane.classList.add('active');

        // Check for note hit
        this.checkNoteHit(event.key);
    }

    /**
     * Handle key up
     */
    handleKeyUp(event) {
        this.keysPressed.delete(event.key);

        const lane = document.querySelector(`.note-lane[data-key="${event.key}"]`);
        if (lane) lane.classList.remove('active');
    }

    /**
     * Check if a note was hit
     */
    checkNoteHit(key) {
        const currentTime = this.rhythmEngine.currentTime;

        // Find the closest unhit note for this key
        const note = this.activeNotes.find(n =>
            n.key === key &&
            !n.hit &&
            !n.missed &&
            n.isInHitWindow(currentTime, this.rhythmEngine.timingWindows.miss)
        );

        if (note) {
            const result = this.rhythmEngine.judgeHit(note.time, currentTime);

            if (result) {
                note.hit = true;
                this.score += result.score;
                this.fewtureTokens += result.tokens;

                if (result.judgment !== 'miss') {
                    this.combo++;
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                } else {
                    this.combo = 0;
                }

                this.showFeedback(result.judgment);
                this.updateUI();
            }
        }
    }

    /**
     * Show visual feedback
     */
    showFeedback(judgment) {
        const feedbackEl = document.getElementById('feedback');
        feedbackEl.textContent = judgment.toUpperCase();
        feedbackEl.className = `show ${judgment}`;

        setTimeout(() => {
            feedbackEl.classList.remove('show');
        }, 500);
    }

    /**
     * Update UI elements
     */
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('combo').textContent = this.combo;
        document.getElementById('tokens').textContent = this.fewtureTokens;
    }

    /**
     * Game loop
     */
    gameLoop(currentTime) {
        if (!this.isPlaying) return;

        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Update rhythm engine
        this.rhythmEngine.update();

        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw notes
        const gameCurrentTime = this.rhythmEngine.currentTime;

        this.activeNotes.forEach(note => {
            note.update(deltaTime, gameCurrentTime, this.targetY);

            const lane = this.lanes[note.lane];
            if (lane) {
                note.draw(this.ctx, lane.x, this.targetY);
            }
        });

        // Draw target line
        this.drawTargetLine();

        // Check for missed notes
        this.activeNotes.forEach(note => {
            if (note.missed && !note.hit) {
                this.combo = 0;
                this.updateUI();
            }
        });

        // Remove missed/hit notes that are off screen
        this.activeNotes = this.activeNotes.filter(note =>
            !note.missed && !note.hit
        );

        // Continue loop
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * Draw the target line where notes should be hit
     */
    drawTargetLine() {
        this.ctx.save();
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(150, this.targetY);
        this.ctx.lineTo(650, this.targetY);
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Stop the game
     */
    stop() {
        this.isPlaying = false;
        this.audio.pause();
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
}
