/**
 * CallAndResponse - PaRappa-style call and response gameplay
 * Teacher shows a pattern, player repeats it
 */
class CallAndResponse {
    constructor(game) {
        this.game = game;
        this.isActive = false;
        this.mode = 'normal'; // 'normal', 'watching', 'responding'

        // Current phrase
        this.currentPhrase = null;
        this.phraseIndex = 0;

        // Player's response
        this.playerInputs = [];
        this.responseStartTime = 0;

        // Grading
        this.phraseScore = 0;
        this.successThreshold = 0.7; // 70% accuracy needed
    }

    /**
     * Create a call-and-response phrase
     */
    createPhrase(startTime, pattern, repeatDelay = 2000) {
        return {
            startTime: startTime,           // When the teacher pattern starts
            pattern: pattern,                // Array of {time, key} objects
            repeatDelay: repeatDelay,        // Gap before player responds (ms)
            responseTime: startTime + this.getPatternDuration(pattern) + repeatDelay
        };
    }

    /**
     * Get total duration of a pattern
     */
    getPatternDuration(pattern) {
        if (pattern.length === 0) return 0;
        const lastNote = pattern[pattern.length - 1];
        return lastNote.time;
    }

    /**
     * Start a call-and-response section
     */
    startPhrase(phrase) {
        this.isActive = true;
        this.currentPhrase = phrase;
        this.mode = 'watching';
        this.playerInputs = [];
        this.phraseScore = 0;

        // Show instruction
        this.showInstruction('🎵 Watch and learn!');
    }

    /**
     * Update call-and-response state
     */
    update(currentTime) {
        if (!this.isActive || !this.currentPhrase) return;

        // Check if we should switch to response mode
        if (this.mode === 'watching' && currentTime >= this.currentPhrase.responseTime) {
            this.mode = 'responding';
            this.responseStartTime = currentTime;
            this.showInstruction('🎤 Now you try!');
        }

        // Check if response is complete
        if (this.mode === 'responding') {
            const expectedInputs = this.currentPhrase.pattern.length;
            if (this.playerInputs.length >= expectedInputs) {
                this.gradeResponse();
                this.endPhrase();
            }
        }
    }

    /**
     * Record player input during response phase
     */
    recordInput(key, time) {
        if (this.mode !== 'responding') return;

        const relativeTime = time - this.responseStartTime;
        this.playerInputs.push({
            key: key,
            time: relativeTime
        });
    }

    /**
     * Grade the player's response
     */
    gradeResponse() {
        const pattern = this.currentPhrase.pattern;
        let correctInputs = 0;

        // Compare player inputs to pattern
        for (let i = 0; i < pattern.length; i++) {
            const expected = pattern[i];
            const actual = this.playerInputs[i];

            if (!actual) continue;

            // Check if key matches
            const keyMatch = expected.key === actual.key;

            // Check if timing is close (within 200ms)
            const timeDiff = Math.abs(expected.time - actual.time);
            const timingMatch = timeDiff < 200;

            if (keyMatch && timingMatch) {
                correctInputs++;
            }
        }

        // Calculate accuracy
        const accuracy = correctInputs / pattern.length;
        this.phraseScore = accuracy;

        // Show result
        if (accuracy >= 0.9) {
            this.showResult('COOL!', '#00ff00');
            this.game.fewtureTokens += 50; // Bonus tokens!
        } else if (accuracy >= this.successThreshold) {
            this.showResult('GOOD!', '#ffff00');
            this.game.fewtureTokens += 25;
        } else {
            this.showResult('TRY AGAIN...', '#ff0000');
        }

        this.game.updateUI();
    }

    /**
     * End the current phrase
     */
    endPhrase() {
        this.isActive = false;
        this.mode = 'normal';
        this.currentPhrase = null;
        this.playerInputs = [];
    }

    /**
     * Show instruction text
     */
    showInstruction(text) {
        const feedbackEl = document.getElementById('feedback');
        feedbackEl.textContent = text;
        feedbackEl.className = 'show';

        setTimeout(() => {
            feedbackEl.classList.remove('show');
        }, 1500);
    }

    /**
     * Show result of response
     */
    showResult(text, color) {
        const feedbackEl = document.getElementById('feedback');
        feedbackEl.textContent = text;
        feedbackEl.style.color = color;
        feedbackEl.className = 'show';

        setTimeout(() => {
            feedbackEl.classList.remove('show');
            feedbackEl.style.color = '';
        }, 2000);
    }

    /**
     * Draw visual indicator for call-and-response mode
     */
    draw(ctx, canvasWidth, canvasHeight) {
        if (!this.isActive) return;

        ctx.save();

        // Draw mode indicator
        const text = this.mode === 'watching' ? '👀 WATCH' : '🎤 YOUR TURN';
        const color = this.mode === 'watching' ? '#00aaff' : '#ff00aa';

        ctx.fillStyle = color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvasWidth / 2, 30);

        // Draw progress bar for watching phase
        if (this.mode === 'watching' && this.currentPhrase) {
            const progress = this.playerInputs.length / this.currentPhrase.pattern.length;
            const barWidth = 200;
            const barHeight = 10;
            const barX = (canvasWidth - barWidth) / 2;
            const barY = 50;

            // Background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // Progress
            ctx.fillStyle = color;
            ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        }

        ctx.restore();
    }
}

/**
 * Example usage in a song chart:
 *
 * Create phrases for your song:
 *
 * const phrases = [
 *     {
 *         startTime: 8000,
 *         pattern: [
 *             { time: 0, key: 'ArrowLeft' },
 *             { time: 500, key: 'ArrowDown' },
 *             { time: 1000, key: 'ArrowRight' }
 *         ],
 *         repeatDelay: 2000
 *     }
 * ];
 *
 * Then in your game, check for phrases and activate them when the time comes.
 */
