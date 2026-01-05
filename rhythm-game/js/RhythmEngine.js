/**
 * RhythmEngine - Handles timing, beat detection, and scoring
 */
class RhythmEngine {
    constructor() {
        this.bpm = 120; // Beats per minute
        this.offset = 0; // Audio offset in ms
        this.startTime = 0;
        this.currentTime = 0;

        // Timing windows (in ms)
        this.timingWindows = {
            perfect: 50,  // ±50ms
            great: 100,   // ±100ms
            good: 150,    // ±150ms
            miss: 200     // ±200ms
        };

        // Scoring
        this.scoreValues = {
            perfect: 100,
            great: 75,
            good: 50,
            miss: 0
        };

        // Token rewards
        this.tokenRewards = {
            perfect: 10,
            great: 7,
            good: 5,
            miss: 0
        };
    }

    /**
     * Calculate beat duration in milliseconds
     */
    getBeatDuration() {
        return (60 / this.bpm) * 1000;
    }

    /**
     * Start the rhythm engine
     */
    start(audioElement) {
        this.audioElement = audioElement;
        this.startTime = performance.now();
    }

    /**
     * Update current time
     */
    update() {
        if (this.audioElement && !this.audioElement.paused) {
            this.currentTime = this.audioElement.currentTime * 1000; // Convert to ms
        }
    }

    /**
     * Judge timing accuracy
     * @param {number} targetTime - When the note should be hit (in ms)
     * @param {number} hitTime - When the note was actually hit (in ms)
     */
    judgeHit(targetTime, hitTime) {
        const difference = Math.abs(targetTime - hitTime);

        if (difference <= this.timingWindows.perfect) {
            return {
                judgment: 'perfect',
                score: this.scoreValues.perfect,
                tokens: this.tokenRewards.perfect
            };
        } else if (difference <= this.timingWindows.great) {
            return {
                judgment: 'great',
                score: this.scoreValues.great,
                tokens: this.tokenRewards.great
            };
        } else if (difference <= this.timingWindows.good) {
            return {
                judgment: 'good',
                score: this.scoreValues.good,
                tokens: this.tokenRewards.good
            };
        } else if (difference <= this.timingWindows.miss) {
            return {
                judgment: 'miss',
                score: this.scoreValues.miss,
                tokens: this.tokenRewards.miss
            };
        }

        return null; // Too far off
    }

    /**
     * Convert beats to milliseconds
     */
    beatsToMs(beats) {
        return beats * this.getBeatDuration();
    }

    /**
     * Get current beat
     */
    getCurrentBeat() {
        return this.currentTime / this.getBeatDuration();
    }
}
