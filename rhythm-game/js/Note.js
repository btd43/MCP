/**
 * Note - Represents a single note/input in the game
 */
class Note {
    constructor(time, key, lane) {
        this.time = time;           // When the note should be hit (in ms)
        this.key = key;             // Which key (e.g., 'ArrowLeft')
        this.lane = lane;           // Which lane (0-3)
        this.y = -50;               // Starting Y position
        this.speed = 200;           // Pixels per second
        this.hit = false;           // Whether the note has been hit
        this.missed = false;        // Whether the note was missed
        this.width = 70;
        this.height = 20;

        // Visual properties
        this.colors = {
            'ArrowLeft': '#ff6b6b',
            'ArrowDown': '#4ecdc4',
            'ArrowUp': '#45b7d1',
            'ArrowRight': '#ffa502'
        };

        this.color = this.colors[key] || '#ffffff';
    }

    /**
     * Update note position
     */
    update(deltaTime, currentTime, targetY) {
        if (this.hit || this.missed) return;

        // Calculate how far the note should have traveled
        const timeUntilHit = this.time - currentTime;
        const distanceFromTarget = (timeUntilHit / 1000) * this.speed;

        this.y = targetY - distanceFromTarget;

        // Check if note is missed (passed the target zone)
        if (this.y > targetY + 100) {
            this.missed = true;
        }
    }

    /**
     * Draw the note
     */
    draw(ctx, laneX, targetY) {
        if (this.hit || this.missed) return;

        ctx.save();

        // Draw note shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(laneX + 5, this.y + 5, this.width, this.height);

        // Draw note
        ctx.fillStyle = this.color;
        ctx.fillRect(laneX, this.y, this.width, this.height);

        // Draw note border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(laneX, this.y, this.width, this.height);

        // Draw arrow symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const arrowSymbols = {
            'ArrowLeft': '←',
            'ArrowDown': '↓',
            'ArrowUp': '↑',
            'ArrowRight': '→'
        };

        ctx.fillText(
            arrowSymbols[this.key] || '?',
            laneX + this.width / 2,
            this.y + this.height / 2
        );

        ctx.restore();
    }

    /**
     * Check if this note is in the hit window
     */
    isInHitWindow(currentTime, maxWindow = 200) {
        const difference = Math.abs(this.time - currentTime);
        return difference <= maxWindow;
    }
}
