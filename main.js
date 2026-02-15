/**
 * 3D Portfolio - Ganesh KS
 * Inspired by Rachel Wei's portfolio: https://rachelqrwei.ca/
 * Built with Three.js, GSAP, and Vite
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import gsap from 'gsap';
import { Room } from './src/Room.js';
import { ProjectsData } from './src/ProjectsData.js';

class Portfolio {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactiveObjects = [];
        this.hoveredObject = null;
        this.currentTween = null;
        
        this.init();
    }

    init() {
        // Enhanced mobile device detection
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.isAndroid = /Android/i.test(navigator.userAgent);
        
        // Detect screen size
        this.isSmallScreen = window.innerWidth < 768;
        this.isTinyScreen = window.innerWidth < 480;
        
        // Performance settings based on device
        const useHighQuality = !this.isMobile && !this.isTablet;
        
        // Renderer setup with better quality
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Adaptive pixel ratio based on device
        if (this.isTinyScreen) {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        } else if (this.isMobile || this.isTablet) {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        } else {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        
        this.renderer.shadowMap.enabled = useHighQuality; // Disable shadows on mobile
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        document.body.appendChild(this.renderer.domElement);

        // Isometric camera setup
        this.camera.position.set(8, 6, 8);
        this.camera.lookAt(0, 1, 0);

        // Controls - smooth and responsive
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08; // Increased for smoother movement
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;
        this.controls.target.set(0, 1, 0);
        // Strict vertical rotation limits
        this.controls.maxPolarAngle = Math.PI / 2.2; // Can't go below horizontal
        this.controls.minPolarAngle = Math.PI / 6; // Can't go too high
        // Smooth rotation and zoom
        this.controls.rotateSpeed = 0.5; // Slower, smoother rotation
        this.controls.zoomSpeed = 0.8; // Smoother zoom
        this.controls.panSpeed = 0.5; // Smoother pan
        this.controls.enablePan = true;
        // Smooth inertia
        this.controls.minAzimuthAngle = -Infinity;
        this.controls.maxAzimuthAngle = Infinity;

        // Scene setup - dark background for floating island effect
        this.scene.background = new THREE.Color(0x1a1a1a);
        this.scene.fog = new THREE.Fog(0x1a1a1a, 15, 30);

        // Lighting
        this.setupLights();

        // Create room first
        this.room = new Room(this.scene);
        this.interactiveObjects = this.room.getInteractiveObjects();

        // Add 3D text labels
        this.create3DTextLabels();

        // Add reflective floor after room is created
        this.createReflectiveFloor();

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('click', (e) => this.onMouseClick(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Touch event support for mobile devices - use capture phase
        window.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false, capture: true });
        window.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false, capture: true });

        // Music player setup
        this.setupMusicPlayer();

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 500);
        }, 1500);

        // Start animation
        this.animate();
    }

    createReflectiveFloor() {
        // Reflective floor for all devices with adaptive quality
        const geometry = new THREE.PlaneGeometry(50, 50);
        
        // Lower resolution for mobile devices to maintain performance
        const textureSize = (this.isMobile || this.isTablet) ? 512 : 1024;
        
        const reflector = new Reflector(geometry, {
            clipBias: 0.003,
            textureWidth: textureSize,
            textureHeight: textureSize,
            color: 0x888888,
            opacity: (this.isMobile || this.isTablet) ? 0.6 : 0.8 // Slightly less reflective on mobile
        });
        
        reflector.position.y = -0.5;
        reflector.rotation.x = -Math.PI / 2;
        this.scene.add(reflector);
    }

    create3DTextLabels() {
        // Create high-resolution canvas for crisp text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        // Increase resolution 4x for much sharper text
        const scale = 4;
        canvas.width = 1024 * scale;
        canvas.height = 1024 * scale;
        
        // Scale context to match
        context.scale(scale, scale);

        // Clear canvas with transparent background
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Enable text smoothing for better quality
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        // Set text baseline for consistent alignment
        context.textBaseline = 'top';
        context.textAlign = 'left';

        // Name text - larger and italic, left-aligned
        context.fillStyle = '#ffffff';
        context.font = 'italic bold 72px Arial';
        context.fillText('Ganesh KS', 40, 40);

        // Professional title - left-aligned
        context.font = '36px Arial';
        context.fillStyle = '#a0a0a0';
        context.fillText('Python Developer', 40, 130);

        // Menu items - better spacing, left-aligned
        context.fillStyle = '#ffffff';
        context.font = '40px Arial';
        context.fillText('about me', 40, 220);
        context.fillText('projects', 40, 290);
        context.fillText('work experience', 40, 360);
        context.fillText('education', 40, 430);
        context.fillText('contact me', 40, 500);

        // Create texture from canvas with high quality settings
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        // Enable anisotropic filtering for sharper text at angles
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        // Use better filtering
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;

        // Create plane with text
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 1
        });

        const textGeometry = new THREE.PlaneGeometry(6, 6);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Position text at an angle like Rachel Wei's portfolio
        textMesh.position.set(7, 2.5, 0);
        textMesh.rotation.y = -Math.PI / 4; // 45 degree angle facing outward
        
        // Make it clickable
        textMesh.userData.isMenu = true;
        this.menuTextMesh = textMesh;
        
        this.scene.add(textMesh);
    }

    setupLights() {
        // Warm ambient light
        const ambientLight = new THREE.AmbientLight(0xffd7a8, 0.6);
        this.scene.add(ambientLight);

        // Main directional light (sunlight through window)
        const mainLight = new THREE.DirectionalLight(0xfff4e0, 1);
        mainLight.position.set(5, 8, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        this.scene.add(mainLight);

        // Warm desk lamp
        const deskLamp = new THREE.PointLight(0xffb366, 0.8, 8);
        deskLamp.position.set(-3, 2, -3);
        deskLamp.castShadow = true;
        this.scene.add(deskLamp);

        // Accent light (monitor glow)
        const monitorGlow = new THREE.PointLight(0x88ccff, 0.4, 5);
        monitorGlow.position.set(-3, 1.5, -3);
        this.scene.add(monitorGlow);

        // Soft fill light
        const fillLight = new THREE.PointLight(0xffeedd, 0.3, 10);
        fillLight.position.set(3, 3, 3);
        this.scene.add(fillLight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

        // Handle hover effects
        if (intersects.length > 0) {
            const hoveredObj = intersects[0].object;
            
            if (this.hoveredObject !== hoveredObj) {
                // Reset previous hovered object
                if (this.hoveredObject && this.currentTween) {
                    this.currentTween.kill();
                    gsap.to(this.hoveredObject.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
                
                // Animate new hovered object
                this.hoveredObject = hoveredObj;
                this.currentTween = gsap.to(hoveredObj.scale, {
                    x: 1.1,
                    y: 1.1,
                    z: 1.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                // Add floating animation
                gsap.to(hoveredObj.position, {
                    y: hoveredObj.position.y + 0.1,
                    duration: 0.5,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut'
                });
            }
            
            document.body.style.cursor = 'pointer';
        } else {
            // Reset when not hovering
            if (this.hoveredObject) {
                if (this.currentTween) {
                    this.currentTween.kill();
                }
                
                gsap.killTweensOf(this.hoveredObject.position);
                gsap.killTweensOf(this.hoveredObject.scale);
                
                gsap.to(this.hoveredObject.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                // Reset position based on object type
                const originalY = this.getOriginalY(this.hoveredObject);
                gsap.to(this.hoveredObject.position, {
                    y: originalY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                this.hoveredObject = null;
            }
            
            document.body.style.cursor = 'default';
        }
    }

    getOriginalY(object) {
        // Return original Y position based on object's parent position
        if (object.userData.projectId === 'project1') return 0; // Monitor screen
        if (object.userData.projectId === 'project2' || object.userData.projectId === 'project3') return 0; // Frames
        if (object.userData.projectId === 'project4') return 0; // Hologram
        return 0;
    }

    onMouseClick(event) {
        // Handle both mouse and touch events
        let clientX, clientY;
        
        if (event.type === 'touchend' || event.type === 'touchstart') {
            // For touch events, use the stored touch position
            clientX = this.touchStartX || 0;
            clientY = this.touchStartY || 0;
        } else {
            // For mouse events
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for menu text click
        if (this.menuTextMesh) {
            const menuIntersects = this.raycaster.intersectObject(this.menuTextMesh);
            if (menuIntersects.length > 0) {
                // Calculate which menu item was clicked based on Y position
                const uv = menuIntersects[0].uv;
                const yPos = uv.y;
                
                console.log('Menu clicked! UV Y:', yPos); // Debug
                
                // Menu items positions - more precise ranges to prevent overlap
                // Canvas: 1024px tall, items at Y: 220, 290, 360, 430, 500
                if (yPos >= 0.72 && yPos < 0.77) {
                    // About me: ~0.746
                    window.showAboutMe();
                    return;
                }
                if (yPos >= 0.65 && yPos < 0.72) {
                    // Projects: ~0.678
                    window.showProjects();
                    return;
                }
                if (yPos >= 0.58 && yPos < 0.65) {
                    // Work experience: ~0.609
                    window.showWorkExperience();
                    return;
                }
                if (yPos >= 0.51 && yPos < 0.58) {
                    // Education: ~0.541
                    window.showEducation();
                    return;
                }
                if (yPos >= 0.44 && yPos < 0.51) {
                    // Contact me: ~0.473
                    window.showContact();
                    return;
                }
            }
        }
        
        // Check for project objects
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            const projectId = clickedObject.userData.projectId;
            
            // If clicking monitor (project1), open resume
            if (projectId === 'project1') {
                window.open('https://drive.google.com/file/d/1eJ5R99efVtxmc-MX5rnkXjVJTfiUpVdM/view?usp=sharing', '_blank');
                return;
            }
            
            // For other projects, show project info
            this.showProjectInfo(projectId);
        }
    }

    showProjectInfo(projectId) {
        const project = ProjectsData[projectId];
        if (!project) return;

        const panel = document.getElementById('info-panel');
        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-description').textContent = project.description;
        
        const skillsContainer = document.getElementById('project-skills');
        skillsContainer.innerHTML = '';
        project.skills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            skillsContainer.appendChild(tag);
        });

        const link = document.getElementById('project-link');
        link.href = project.link;
        link.style.display = project.link ? 'inline-block' : 'none';

        panel.classList.remove('hidden');
        setTimeout(() => panel.classList.add('show'), 10);

        document.querySelector('.close-btn').onclick = () => {
            panel.classList.remove('show');
            setTimeout(() => panel.classList.add('hidden'), 300);
        };
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update screen size flags
        this.isSmallScreen = window.innerWidth < 768;
        this.isTinyScreen = window.innerWidth < 480;
    }

    // Touch event handlers for mobile devices
    onTouchStart(event) {
        // Don't interfere with UI elements
        if (event.target.closest('.contact-icons') || 
            event.target.closest('.music-player') ||
            event.target.closest('.about-panel') ||
            event.target.closest('.projects-panel') ||
            event.target.closest('.work-experience-panel') ||
            event.target.closest('.education-panel') ||
            event.target.closest('.contact-panel') ||
            event.target.closest('.project-detail-panel')) {
            return;
        }
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            
            // Store touch position for tap detection
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.touchStartTime = Date.now();
            
            // Update mouse position for raycasting
            this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        }
    }

    onTouchEnd(event) {
        // Don't interfere with UI elements
        if (event.target.closest('.contact-icons') || 
            event.target.closest('.music-player') ||
            event.target.closest('.about-panel') ||
            event.target.closest('.projects-panel') ||
            event.target.closest('.work-experience-panel') ||
            event.target.closest('.education-panel') ||
            event.target.closest('.contact-panel') ||
            event.target.closest('.project-detail-panel')) {
            return;
        }
        
        // Detect tap (quick touch without much movement)
        if (this.touchStartTime && this.touchStartX !== undefined) {
            const touchDuration = Date.now() - this.touchStartTime;
            const touch = event.changedTouches[0];
            const touchMoveX = Math.abs(touch.clientX - this.touchStartX);
            const touchMoveY = Math.abs(touch.clientY - this.touchStartY);
            
            // If touch was quick and didn't move much, treat as tap/click
            if (touchDuration < 500 && touchMoveX < 20 && touchMoveY < 20) {
                event.preventDefault();
                event.stopPropagation();
                
                // Use the stored touch start position for accuracy
                this.mouse.x = (this.touchStartX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(this.touchStartY / window.innerHeight) * 2 + 1;
                
                // Perform raycast check
                this.raycaster.setFromCamera(this.mouse, this.camera);
                
                // Check for menu text click
                if (this.menuTextMesh) {
                    const menuIntersects = this.raycaster.intersectObject(this.menuTextMesh);
                    if (menuIntersects.length > 0) {
                        const uv = menuIntersects[0].uv;
                        const yPos = uv.y;
                        
                        console.log('Menu tapped! UV Y:', yPos); // Debug log
                        
                        // Menu items positions - precise ranges to prevent overlap
                        if (yPos >= 0.72 && yPos < 0.77) {
                            window.showAboutMe();
                        } else if (yPos >= 0.65 && yPos < 0.72) {
                            window.showProjects();
                        } else if (yPos >= 0.58 && yPos < 0.65) {
                            window.showWorkExperience();
                        } else if (yPos >= 0.51 && yPos < 0.58) {
                            window.showEducation();
                        } else if (yPos >= 0.44 && yPos < 0.51) {
                            window.showContact();
                        }
                        
                        // Clear touch data
                        this.touchStartTime = null;
                        this.touchStartX = undefined;
                        this.touchStartY = undefined;
                        return;
                    }
                }
                
                // Check for project objects
                const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
                if (intersects.length > 0) {
                    const clickedObject = intersects[0].object;
                    const projectId = clickedObject.userData.projectId;
                    
                    console.log('Object tapped:', projectId); // Debug log
                    
                    if (projectId === 'project1') {
                        window.open('https://drive.google.com/file/d/1eJ5R99efVtxmc-MX5rnkXjVJTfiUpVdM/view?usp=sharing', '_blank');
                    } else {
                        this.showProjectInfo(projectId);
                    }
                }
            }
            
            // Clear touch data
            this.touchStartTime = null;
            this.touchStartX = undefined;
            this.touchStartY = undefined;
        }
    }

    onTouchMove(event) {
        // This is handled by OrbitControls
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.room.update();
        this.renderer.render(this.scene, this.camera);
    }

    setupMusicPlayer() {
        const playPauseBtn = document.getElementById('play-pause');
        const volumeSlider = document.getElementById('volume');
        const progressBar = document.getElementById('progress');
        
        // Create audio element
        this.audio = new Audio();
        // Music file from public/music folder
        this.audio.src = '/music/Mr Bean Animated.mp3';
        this.audio.volume = 0.5;
        
        // Loop counter - play only 2 times
        this.playCount = 0;
        this.maxPlays = 2;
        
        this.audio.addEventListener('ended', () => {
            this.playCount++;
            if (this.playCount < this.maxPlays) {
                this.audio.currentTime = 0;
                this.audio.play();
            } else {
                // Stop after 2 plays
                isPlaying = false;
                playPauseBtn.textContent = '▶';
                this.stopProgressAnimation();
            }
        });
        
        let isPlaying = false;

        playPauseBtn.addEventListener('click', () => {
            if (!this.audio.src) {
                // If no audio file is set, just animate the UI
                isPlaying = !isPlaying;
                playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
                
                if (isPlaying) {
                    this.startProgressAnimation();
                } else {
                    this.stopProgressAnimation();
                }
                return;
            }
            
            // With actual audio file
            if (this.audio.paused) {
                this.audio.play().then(() => {
                    isPlaying = true;
                    playPauseBtn.textContent = '⏸';
                    this.startProgressAnimation();
                }).catch(err => {
                    console.log('Audio play failed:', err);
                });
            } else {
                this.audio.pause();
                isPlaying = false;
                playPauseBtn.textContent = '▶';
                this.stopProgressAnimation();
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            if (this.audio) {
                this.audio.volume = volume;
            }
        });

        // Update progress bar based on actual audio time
        if (this.audio) {
            this.audio.addEventListener('timeupdate', () => {
                if (this.audio.duration) {
                    const progress = (this.audio.currentTime / this.audio.duration) * 100;
                    progressBar.style.width = progress + '%';
                }
            });
        }

        this.progressInterval = null;
        this.currentProgress = 0;
    }

    startProgressAnimation() {
        this.stopProgressAnimation();
        
        // If we have actual audio, don't use fake animation
        if (this.audio && this.audio.src) return;
        
        // Fake progress animation for demo
        this.progressInterval = setInterval(() => {
            this.currentProgress += 0.5;
            if (this.currentProgress >= 100) {
                this.currentProgress = 0;
            }
            document.getElementById('progress').style.width = this.currentProgress + '%';
        }, 100);
    }

    stopProgressAnimation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
}

new Portfolio();
