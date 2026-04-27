// 3D Interactive DNA Helix using Three.js
class DNAHelix3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.helix = null;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.autoRotate = true;
        this.autoRotateSpeed = 0.005;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background
        
        // Camera setup
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Lighting - matching brand colors
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Cyan light (brand color)
        const pointLight1 = new THREE.PointLight(0x0ea5e9, 1.2, 100);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);
        
        // Purple light (secondary brand color)
        const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.2, 100);
        pointLight2.position.set(-5, 5, 5);
        this.scene.add(pointLight2);
        
        // Green light (accent color)
        const pointLight3 = new THREE.PointLight(0x10b981, 0.8, 100);
        pointLight3.position.set(0, -5, 5);
        this.scene.add(pointLight3);
        
        // Create DNA helix
        this.createHelix();
    }
    
    createHelix() {
        const group = new THREE.Group();
        
        const particleCount = 40;
        const radius = 0.8;
        const height = 4;
        const turns = 2;
        
        const strand1Geometry = new THREE.BufferGeometry();
        const strand2Geometry = new THREE.BufferGeometry();
        const basePairsGeometry = new THREE.BufferGeometry();
        
        const strand1Positions = [];
        const strand2Positions = [];
        const basePairsPositions = [];
        const strand1Colors = [];
        const strand2Colors = [];
        const basePairsColors = [];
        
        // Create particles and connections with gradients
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            const angle = t * Math.PI * 2 * turns;
            const y = (t - 0.5) * height;
            
            // Strand 1 - gradient from cyan to purple
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            strand1Positions.push(x1, y, z1);
            
            // Gradient: cyan (0) -> purple (0.5) -> green (1)
            let r1, g1, b1;
            if (t < 0.5) {
                // Cyan to Purple
                const localT = t * 2;
                r1 = 0.055 + (0.545 - 0.055) * localT;
                g1 = 0.647 + (0.361 - 0.647) * localT;
                b1 = 0.914 + (0.965 - 0.914) * localT;
            } else {
                // Purple to Green
                const localT = (t - 0.5) * 2;
                r1 = 0.545 + (0.063 - 0.545) * localT;
                g1 = 0.361 + (0.725 - 0.361) * localT;
                b1 = 0.965 + (0.506 - 0.965) * localT;
            }
            strand1Colors.push(r1, g1, b1);
            
            // Strand 2 - gradient from purple to cyan (opposite direction)
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;
            strand2Positions.push(x2, y, z2);
            
            // Gradient: purple (0) -> green (0.5) -> cyan (1)
            let r2, g2, b2;
            if (t < 0.5) {
                // Purple to Green
                const localT = t * 2;
                r2 = 0.545 + (0.063 - 0.545) * localT;
                g2 = 0.361 + (0.725 - 0.361) * localT;
                b2 = 0.965 + (0.506 - 0.965) * localT;
            } else {
                // Green to Cyan
                const localT = (t - 0.5) * 2;
                r2 = 0.063 + (0.055 - 0.063) * localT;
                g2 = 0.725 + (0.647 - 0.725) * localT;
                b2 = 0.506 + (0.914 - 0.506) * localT;
            }
            strand2Colors.push(r2, g2, b2);
            
            // Base pair connection - gradient between the two strand colors
            basePairsPositions.push(x1, y, z1, x2, y, z2);
            basePairsColors.push(r1, g1, b1, r2, g2, b2);
        }
        
        // Strand 1
        strand1Geometry.setAttribute('position', new THREE.Float32BufferAttribute(strand1Positions, 3));
        strand1Geometry.setAttribute('color', new THREE.Float32BufferAttribute(strand1Colors, 3));
        
        const strand1Material = new THREE.LineBasicMaterial({ 
            vertexColors: true,
            linewidth: 3,
            transparent: true,
            opacity: 0.95
        });
        
        const strand1 = new THREE.Line(strand1Geometry, strand1Material);
        group.add(strand1);
        
        // Strand 2
        strand2Geometry.setAttribute('position', new THREE.Float32BufferAttribute(strand2Positions, 3));
        strand2Geometry.setAttribute('color', new THREE.Float32BufferAttribute(strand2Colors, 3));
        
        const strand2Material = new THREE.LineBasicMaterial({ 
            vertexColors: true,
            linewidth: 3,
            transparent: true,
            opacity: 0.95
        });
        
        const strand2 = new THREE.Line(strand2Geometry, strand2Material);
        group.add(strand2);
        
        // Base pairs already have gradient colors from the loop above
        basePairsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(basePairsPositions, 3));
        basePairsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(basePairsColors, 3));
        
        const basePairsMaterial = new THREE.LineBasicMaterial({ 
            vertexColors: true,
            linewidth: 1.5,
            transparent: true,
            opacity: 0.5
        });
        
        const basePairs = new THREE.LineSegments(basePairsGeometry, basePairsMaterial);
        group.add(basePairs);
        
        // Add glowing particles
        const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            const angle = t * Math.PI * 2 * turns;
            const y = (t - 0.5) * height;
            
            // Strand 1 particles - gradient colors matching the strand
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const color1 = new THREE.Color();
            if (t < 0.5) {
                const localT = t * 2;
                color1.lerpColors(
                    new THREE.Color(0x0ea5e9), // Cyan
                    new THREE.Color(0x8b5cf6), // Purple
                    localT
                );
            } else {
                const localT = (t - 0.5) * 2;
                color1.lerpColors(
                    new THREE.Color(0x8b5cf6), // Purple
                    new THREE.Color(0x10b981), // Green
                    localT
                );
            }
            const particle1 = new THREE.Mesh(
                particleGeometry,
                new THREE.MeshBasicMaterial({ 
                    color: color1,
                    transparent: true,
                    opacity: 1.0
                })
            );
            particle1.position.set(x1, y, z1);
            group.add(particle1);
            
            // Strand 2 particles - gradient colors matching the strand
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;
            const color2 = new THREE.Color();
            if (t < 0.5) {
                const localT = t * 2;
                color2.lerpColors(
                    new THREE.Color(0x8b5cf6), // Purple
                    new THREE.Color(0x10b981), // Green
                    localT
                );
            } else {
                const localT = (t - 0.5) * 2;
                color2.lerpColors(
                    new THREE.Color(0x10b981), // Green
                    new THREE.Color(0x0ea5e9), // Cyan
                    localT
                );
            }
            const particle2 = new THREE.Mesh(
                particleGeometry,
                new THREE.MeshBasicMaterial({ 
                    color: color2,
                    transparent: true,
                    opacity: 1.0
                })
            );
            particle2.position.set(x2, y, z2);
            group.add(particle2);
        }
        
        this.helix = group;
        this.scene.add(this.helix);
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.autoRotate = false;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.renderer.domElement.style.cursor = 'grabbing';
        });
        
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                this.targetRotationY += deltaX * 0.01;
                this.targetRotationX += deltaY * 0.01;
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
            }
        });
        
        this.renderer.domElement.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.renderer.domElement.style.cursor = 'grab';
            // Resume auto-rotation after a delay
            setTimeout(() => {
                if (!this.isDragging) {
                    this.autoRotate = true;
                }
            }, 2000);
        });
        
        this.renderer.domElement.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.renderer.domElement.style.cursor = 'grab';
            setTimeout(() => {
                if (!this.isDragging) {
                    this.autoRotate = true;
                }
            }, 2000);
        });
        
        // Touch support
        this.renderer.domElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.autoRotate = false;
            this.lastMouseX = e.touches[0].clientX;
            this.lastMouseY = e.touches[0].clientY;
        });
        
        this.renderer.domElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isDragging) {
                const deltaX = e.touches[0].clientX - this.lastMouseX;
                const deltaY = e.touches[0].clientY - this.lastMouseY;
                
                this.targetRotationY += deltaX * 0.01;
                this.targetRotationX += deltaY * 0.01;
                
                this.lastMouseX = e.touches[0].clientX;
                this.lastMouseY = e.touches[0].clientY;
            }
        });
        
        this.renderer.domElement.addEventListener('touchend', () => {
            this.isDragging = false;
            setTimeout(() => {
                if (!this.isDragging) {
                    this.autoRotate = true;
                }
            }, 2000);
        });
        
        this.renderer.domElement.style.cursor = 'grab';
    }
    
    onWindowResize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Smooth rotation interpolation
        this.rotationX += (this.targetRotationX - this.rotationX) * 0.1;
        this.rotationY += (this.targetRotationY - this.rotationY) * 0.1;
        
        if (this.autoRotate && !this.isDragging) {
            this.targetRotationY += this.autoRotateSpeed;
        }
        
        if (this.helix) {
            this.helix.rotation.x = this.rotationX;
            this.helix.rotation.y = this.rotationY;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE !== 'undefined') {
        new DNAHelix3D('dna-canvas');
    } else {
        console.error('Three.js is not loaded');
    }
});

