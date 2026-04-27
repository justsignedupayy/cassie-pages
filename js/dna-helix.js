// Interactive DNA Helix Animation
class DNAHelix {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        this.particles = [];
        this.baseRotation = 0;
        this.userRotation = 0;
        this.autoRotateSpeed = 0.015;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.momentum = 0;
        this.friction = 0.95;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = this.canvas.width = rect.width;
        this.height = this.canvas.height = rect.height;
    }
    
    init() {
        const particleCount = 30;
        const helixHeight = this.height * 1.5;
        const radius = Math.min(this.width, this.height) * 0.15;
        
        for (let i = 0; i < particleCount; i++) {
            const progress = i / particleCount;
            this.particles.push({
                y: progress * helixHeight - helixHeight * 0.25,
                baseY: progress * helixHeight - helixHeight * 0.25,
                radius: radius,
                speed: 1.5
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init(); // Reinitialize particles with new dimensions
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.momentum = 0;
            this.canvas.style.cursor = 'grabbing';
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                this.userRotation += deltaX * 0.02;
                this.momentum = deltaX * 0.02;
                this.lastMouseX = e.clientX;
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
        
        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.lastMouseX = e.touches[0].clientX;
            this.momentum = 0;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isDragging) {
                const deltaX = e.touches[0].clientX - this.lastMouseX;
                this.userRotation += deltaX * 0.02;
                this.momentum = deltaX * 0.02;
                this.lastMouseX = e.touches[0].clientX;
            }
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
        });
        
        // Set initial cursor
        this.canvas.style.cursor = 'grab';
    }
    
    draw() {
        // Clear canvas completely for crisp rendering
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Update rotation
        if (!this.isDragging) {
            this.baseRotation += this.autoRotateSpeed;
            this.userRotation += this.momentum;
            this.momentum *= this.friction;
        }
        
        const totalRotation = this.baseRotation + this.userRotation;
        
        // Draw DNA helix
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Update vertical position
            particle.y += particle.speed;
            if (particle.y > this.height + 50) {
                particle.y = -50;
            }
            
            // Calculate angle for spiral (creates helix effect)
            const spiralAngle = (particle.y / this.height) * Math.PI * 4 + totalRotation;
            
            // Calculate positions for both strands
            const x1 = centerX + Math.cos(spiralAngle) * particle.radius;
            const y1 = centerY + particle.y - this.height * 0.5;
            const x2 = centerX + Math.cos(spiralAngle + Math.PI) * particle.radius;
            const y2 = centerY + particle.y - this.height * 0.5;
            
            // Draw connections to previous particle
            if (i > 0) {
                const prevParticle = this.particles[i - 1];
                const prevSpiralAngle = ((prevParticle.y / this.height) * Math.PI * 4 + totalRotation);
                const prevX1 = centerX + Math.cos(prevSpiralAngle) * prevParticle.radius;
                const prevY1 = centerY + prevParticle.y - this.height * 0.5;
                const prevX2 = centerX + Math.cos(prevSpiralAngle + Math.PI) * prevParticle.radius;
                const prevY2 = centerY + prevParticle.y - this.height * 0.5;
                
                // Strand 1 (cyan) with gradient
                const gradient1 = this.ctx.createLinearGradient(prevX1, prevY1, x1, y1);
                gradient1.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
                gradient1.addColorStop(1, 'rgba(14, 165, 233, 0.4)');
                
                this.ctx.beginPath();
                this.ctx.strokeStyle = gradient1;
                this.ctx.lineWidth = 3;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = 'rgba(14, 165, 233, 0.6)';
                this.ctx.moveTo(prevX1, prevY1);
                this.ctx.lineTo(x1, y1);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
                
                // Strand 2 (green) with gradient
                const gradient2 = this.ctx.createLinearGradient(prevX2, prevY2, x2, y2);
                gradient2.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
                gradient2.addColorStop(1, 'rgba(16, 185, 129, 0.4)');
                
                this.ctx.beginPath();
                this.ctx.strokeStyle = gradient2;
                this.ctx.lineWidth = 3;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
                this.ctx.moveTo(prevX2, prevY2);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
                
                // Connection between strands (base pairs) - only draw when strands are close
                const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
                const maxDistance = particle.radius * 2.2; // Only draw when strands are close
                
                if (distance < maxDistance) {
                    const opacity = Math.max(0.15, 0.4 * (1 - distance / maxDistance));
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                }
            }
            
            // Draw particles with glow
            // Strand 1 particle
            const glowGradient1 = this.ctx.createRadialGradient(x1, y1, 0, x1, y1, 8);
            glowGradient1.addColorStop(0, 'rgba(14, 165, 233, 1)');
            glowGradient1.addColorStop(0.5, 'rgba(14, 165, 233, 0.6)');
            glowGradient1.addColorStop(1, 'rgba(14, 165, 233, 0)');
            
            this.ctx.beginPath();
            this.ctx.fillStyle = glowGradient1;
            this.ctx.arc(x1, y1, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.fillStyle = '#0ea5e9';
            this.ctx.arc(x1, y1, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Strand 2 particle
            const glowGradient2 = this.ctx.createRadialGradient(x2, y2, 0, x2, y2, 8);
            glowGradient2.addColorStop(0, 'rgba(16, 185, 129, 1)');
            glowGradient2.addColorStop(0.5, 'rgba(16, 185, 129, 0.6)');
            glowGradient2.addColorStop(1, 'rgba(16, 185, 129, 0)');
            
            this.ctx.beginPath();
            this.ctx.fillStyle = glowGradient2;
            this.ctx.arc(x2, y2, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.fillStyle = '#10b981';
            this.ctx.arc(x2, y2, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DNAHelix('dna-canvas');
});
