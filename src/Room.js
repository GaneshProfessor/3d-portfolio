import * as THREE from 'three';

export class Room {
    constructor(scene) {
        this.scene = scene;
        this.interactiveObjects = [];
        this.createRoom();
        this.createFurniture();
        this.createDecorations();
        this.createProjectDisplays();
    }

    createRoom() {
        // Create floating platform base
        const platformHeight = 0.3;
        const platformSize = 10;
        
        // Platform/Island base with better material
        const platformGeometry = new THREE.BoxGeometry(platformSize, platformHeight, platformSize);
        const platformMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xc4a574,
            roughness: 0.7,
            metalness: 0.1
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -platformHeight / 2;
        platform.castShadow = true;
        platform.receiveShadow = true;
        this.scene.add(platform);

        // Platform edge trim (darker)
        const edgeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b7355,
            roughness: 0.6
        });
        const edgeHeight = 0.05;
        
        // Front edge
        const frontEdge = new THREE.Mesh(
            new THREE.BoxGeometry(platformSize, edgeHeight, 0.1),
            edgeMaterial
        );
        frontEdge.position.set(0, -platformHeight - edgeHeight/2, platformSize/2);
        this.scene.add(frontEdge);
        
        // Back edge
        const backEdge = new THREE.Mesh(
            new THREE.BoxGeometry(platformSize, edgeHeight, 0.1),
            edgeMaterial
        );
        backEdge.position.set(0, -platformHeight - edgeHeight/2, -platformSize/2);
        this.scene.add(backEdge);
        
        // Left edge
        const leftEdge = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, edgeHeight, platformSize),
            edgeMaterial
        );
        leftEdge.position.set(-platformSize/2, -platformHeight - edgeHeight/2, 0);
        this.scene.add(leftEdge);
        
        // Right edge
        const rightEdge = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, edgeHeight, platformSize),
            edgeMaterial
        );
        rightEdge.position.set(platformSize/2, -platformHeight - edgeHeight/2, 0);
        this.scene.add(rightEdge);

        // Floor on top of platform - add wood plank pattern
        this.createFloorWithPattern(platformSize);

        // Walls with better material
        this.createWalls(platformSize);
        
        // Window on back wall
        this.createWindow();
    }

    createFloorWithPattern(platformSize) {
        const floorGroup = new THREE.Group();
        
        // Main floor base
        const floorGeometry = new THREE.PlaneGeometry(platformSize - 0.5, platformSize - 0.5);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xd4a574,
            roughness: 0.85,
            metalness: 0.05
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0.01;
        floor.receiveShadow = true;
        floorGroup.add(floor);

        // Add wood plank lines for detail
        const plankWidth = 0.8;
        const numPlanks = Math.floor((platformSize - 0.5) / plankWidth);
        
        for (let i = 0; i < numPlanks; i++) {
            const line = new THREE.Mesh(
                new THREE.PlaneGeometry(0.02, platformSize - 0.5),
                new THREE.MeshStandardMaterial({ 
                    color: 0xb8935f,
                    roughness: 0.9
                })
            );
            line.rotation.x = -Math.PI / 2;
            line.position.set(
                -platformSize/2 + 0.5 + i * plankWidth,
                0.02,
                0
            );
            floorGroup.add(line);
        }

        this.scene.add(floorGroup);
    }

    createWalls(platformSize) {
        const wallHeight = 4;
        
        // Better wall material with slight texture feel
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xf5e6d3,
            roughness: 0.9,
            metalness: 0.0
        });

        // Back wall - full width
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(platformSize - 0.5, wallHeight, 0.2),
            wallMaterial
        );
        backWall.position.set(0, wallHeight/2, -(platformSize - 0.5)/2);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Add baseboard to back wall
        const baseboard1 = new THREE.Mesh(
            new THREE.BoxGeometry(platformSize - 0.5, 0.15, 0.05),
            new THREE.MeshStandardMaterial({ color: 0xd4a574 })
        );
        baseboard1.position.set(0, 0.075, -(platformSize - 0.5)/2 + 0.1);
        this.scene.add(baseboard1);

        // Left wall - full depth
        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, wallHeight, platformSize - 0.5),
            wallMaterial
        );
        leftWall.position.set(-(platformSize - 0.5)/2, wallHeight/2, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Add baseboard to left wall
        const baseboard2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.15, platformSize - 0.5),
            new THREE.MeshStandardMaterial({ color: 0xd4a574 })
        );
        baseboard2.position.set(-(platformSize - 0.5)/2 + 0.1, 0.075, 0);
        this.scene.add(baseboard2);

        // NO RIGHT WALL - removed so text is visible
    }

    createWindow() {
        const windowGroup = new THREE.Group();
        
        // Window frame (thicker and more defined)
        const frameThickness = 0.15;
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 2, frameThickness),
            new THREE.MeshStandardMaterial({ 
                color: 0x6b4423,
                roughness: 0.6,
                metalness: 0.1
            })
        );
        frame.castShadow = true;
        windowGroup.add(frame);

        // Window panes (glass) - BRIGHT GLOWING like sunlight
        const glassGeometry = new THREE.PlaneGeometry(1.1, 0.85);
        const glassMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffee,
            emissive: 0xffffcc,
            emissiveIntensity: 1.2,
            transparent: true,
            opacity: 0.9,
            roughness: 0.1
        });
        
        // Four window panes - bright and glowing
        const positions = [
            [-0.6, 0.5],
            [0.6, 0.5],
            [-0.6, -0.5],
            [0.6, -0.5]
        ];
        
        positions.forEach(([x, y]) => {
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.set(x, y, 0.08);
            windowGroup.add(glass);
        });

        // Window dividers (more prominent)
        const dividerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a3319,
            roughness: 0.7
        });
        
        // Vertical divider
        const vDivider = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 2, 0.08),
            dividerMaterial
        );
        vDivider.castShadow = true;
        windowGroup.add(vDivider);

        // Horizontal divider
        const hDivider = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.08, 0.08),
            dividerMaterial
        );
        hDivider.castShadow = true;
        windowGroup.add(hDivider);

        // Window sill
        const sill = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 0.1, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        sill.position.set(0, -1.05, 0.1);
        sill.castShadow = true;
        windowGroup.add(sill);

        // Add extra glow behind window for sunlight effect
        const glowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2.3, 1.8),
            new THREE.MeshBasicMaterial({
                color: 0xfffacd,
                transparent: true,
                opacity: 0.6
            })
        );
        glowPlane.position.z = 0.05;
        windowGroup.add(glowPlane);

        windowGroup.position.set(2, 2.5, -4.7);
        this.scene.add(windowGroup);
    }

    createFurniture() {
        // Desk
        this.createDesk();
        
        // Bed
        this.createBed();
        
        // Bookshelf
        this.createBookshelf();
        
        // Chair
        this.createChair();
    }

    createDesk() {
        const deskGroup = new THREE.Group();
        
        // Desk top
        const deskTop = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.1, 1.2),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        deskTop.position.y = 0.75;
        deskTop.castShadow = true;
        deskTop.receiveShadow = true;
        deskGroup.add(deskTop);

        // Legs
        const legPositions = [
            [-1.1, 0.375, -0.5],
            [1.1, 0.375, -0.5],
            [-1.1, 0.375, 0.5],
            [1.1, 0.375, 0.5]
        ];
        
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.75, 0.1),
                new THREE.MeshStandardMaterial({ color: 0x6b5345 })
            );
            leg.position.set(...pos);
            leg.castShadow = true;
            deskGroup.add(leg);
        });

        // Drawer
        const drawer = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.2, 1),
            new THREE.MeshStandardMaterial({ color: 0x7a6450 })
        );
        drawer.position.set(-0.7, 0.5, 0);
        drawer.castShadow = true;
        deskGroup.add(drawer);

        // Drawer handle
        const handle = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.05, 0.05),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        handle.position.set(-0.7, 0.5, 0.52);
        deskGroup.add(handle);

        deskGroup.position.set(-1, 0, -3.5);
        this.scene.add(deskGroup);
        this.deskGroup = deskGroup;
    }

    createBed() {
        const bedGroup = new THREE.Group();
        
        // Bed frame base - BIGGER
        const frameBase = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.2, 3.5),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        frameBase.position.y = 0.1;
        frameBase.castShadow = true;
        bedGroup.add(frameBase);
        
        // Mattress - BIGGER and THICKER
        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(2.3, 0.4, 3.3),
            new THREE.MeshStandardMaterial({ color: 0x9db4ab })
        );
        mattress.position.y = 0.4;
        mattress.castShadow = true;
        mattress.receiveShadow = true;
        bedGroup.add(mattress);

        // Headboard - TALLER
        const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.8, 0.15),
            new THREE.MeshStandardMaterial({ color: 0x7a6450 })
        );
        headboard.position.set(0, 0.6, -1.75);
        headboard.castShadow = true;
        bedGroup.add(headboard);

        // Pillow - BIGGER
        const pillow = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.2, 0.5),
            new THREE.MeshStandardMaterial({ color: 0xf5f5dc })
        );
        pillow.position.set(0, 0.7, -1.3);
        pillow.castShadow = true;
        bedGroup.add(pillow);

        // Blanket - BIGGER
        const blanket = new THREE.Mesh(
            new THREE.BoxGeometry(2.1, 0.15, 2),
            new THREE.MeshStandardMaterial({ color: 0xc8a882 })
        );
        blanket.position.set(0, 0.68, 0.2);
        blanket.castShadow = true;
        bedGroup.add(blanket);

        // Bed legs
        const legPositions = [
            [-1.1, 0.05, -1.6],
            [1.1, 0.05, -1.6],
            [-1.1, 0.05, 1.6],
            [1.1, 0.05, 1.6]
        ];
        
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.1, 0.15),
                new THREE.MeshStandardMaterial({ color: 0x6b5345 })
            );
            leg.position.set(...pos);
            leg.castShadow = true;
            bedGroup.add(leg);
        });

        bedGroup.position.set(3, 0, -2);
        this.scene.add(bedGroup);
    }

    createBookshelf() {
        const shelfGroup = new THREE.Group();
        
        // Main structure
        const back = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 2, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        back.castShadow = true;
        shelfGroup.add(back);

        // Shelf items configuration - mix of books, trophies, and frames
        const shelfItems = [
            // Shelf 1 (top): 2 books + 1 trophy
            [
                { type: 'book', title: 'JavaScript', color: 0x3498db },
                { type: 'book', title: 'React', color: 0x2ecc71 },
                { type: 'trophy', color: 0xffd700 }
            ],
            // Shelf 2: 1 frame + 2 books
            [
                { type: 'frame', color: 0x8b4513 },
                { type: 'book', title: 'Python', color: 0xf39c12 },
                { type: 'book', title: 'Django', color: 0x9b59b6 }
            ],
            // Shelf 3: 2 books + 1 frame
            [
                { type: 'book', title: 'CSS3', color: 0xe67e22 },
                { type: 'book', title: 'HTML5', color: 0x34495e },
                { type: 'frame', color: 0x2c3e50 }
            ],
            // Shelf 4 (bottom): 1 trophy + 2 books
            [
                { type: 'trophy', color: 0xc0c0c0 },
                { type: 'book', title: 'Three.js', color: 0xc0392b },
                { type: 'book', title: 'WebGL', color: 0x2980b9 }
            ]
        ];

        for (let i = 0; i < 4; i++) {
            // Create shelf
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 0.05, 0.4),
                new THREE.MeshStandardMaterial({ color: 0x7a6450 })
            );
            shelf.position.set(0, -0.9 + i * 0.6, 0.15);
            shelf.castShadow = true;
            shelfGroup.add(shelf);

            // Add items to shelf
            const items = shelfItems[i];
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                const xPos = -0.5 + j * 0.45;
                const yPos = -0.9 + i * 0.6;

                if (item.type === 'book') {
                    this.createShelfBook(shelfGroup, item.title, item.color, xPos, yPos);
                } else if (item.type === 'trophy') {
                    this.createShelfTrophy(shelfGroup, item.color, xPos, yPos);
                } else if (item.type === 'frame') {
                    this.createShelfFrame(shelfGroup, item.color, xPos, yPos);
                }
            }
        }

        shelfGroup.position.set(-3.5, 1, -4.5);
        this.scene.add(shelfGroup);
    }

    createShelfBook(parent, title, color, x, y) {
        const bookHeight = 0.35;
        const bookThickness = 0.05;
        const bookWidth = 0.28;
        
        // Create text canvas for spine
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Fill background with book color
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add white text horizontally
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const spineTexture = new THREE.CanvasTexture(canvas);
        spineTexture.needsUpdate = true;
        
        // Create materials array
        const materials = [
            new THREE.MeshStandardMaterial({ map: spineTexture, roughness: 0.8 }), // right (spine)
            new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 }), // left
            new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 }), // top
            new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 }), // bottom
            new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 }), // front
            new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 })  // back
        ];
        
        const book = new THREE.Mesh(
            new THREE.BoxGeometry(bookThickness, bookHeight, bookWidth),
            materials
        );
        book.position.set(x, y + bookHeight / 2, 0.15);
        book.castShadow = true;
        parent.add(book);
    }

    createShelfTrophy(parent, color, x, y) {
        const trophyGroup = new THREE.Group();
        
        // Base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.03, 0.12),
            new THREE.MeshStandardMaterial({ 
                color: 0x8b7355,
                roughness: 0.6
            })
        );
        base.castShadow = true;
        trophyGroup.add(base);
        
        // Stem
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.03, 0.1),
            new THREE.MeshStandardMaterial({ 
                color: color,
                metalness: 0.8,
                roughness: 0.2
            })
        );
        stem.position.y = 0.065;
        stem.castShadow = true;
        trophyGroup.add(stem);
        
        // Cup
        const cup = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.04, 0.12, 16),
            new THREE.MeshStandardMaterial({ 
                color: color,
                metalness: 0.9,
                roughness: 0.1
            })
        );
        cup.position.y = 0.18;
        cup.castShadow = true;
        trophyGroup.add(cup);
        
        // Handles
        const handleGeometry = new THREE.TorusGeometry(0.04, 0.008, 8, 16, Math.PI);
        const handleMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.rotation.y = Math.PI / 2;
        leftHandle.position.set(-0.06, 0.18, 0);
        trophyGroup.add(leftHandle);
        
        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.rotation.y = -Math.PI / 2;
        rightHandle.position.set(0.06, 0.18, 0);
        trophyGroup.add(rightHandle);
        
        trophyGroup.position.set(x, y + 0.015, 0.15);
        parent.add(trophyGroup);
    }

    createShelfFrame(parent, frameColor, x, y) {
        const frameGroup = new THREE.Group();
        
        // Photo/picture
        const photo = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.25, 0.18),
            new THREE.MeshStandardMaterial({ 
                color: 0x87ceeb,
                roughness: 0.6
            })
        );
        photo.castShadow = true;
        frameGroup.add(photo);
        
        // Frame border
        const borderThickness = 0.015;
        const borderMaterial = new THREE.MeshStandardMaterial({ 
            color: frameColor,
            roughness: 0.5,
            metalness: 0.3
        });
        
        // Top border
        const topBorder = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, borderThickness, 0.2),
            borderMaterial
        );
        topBorder.position.y = 0.13;
        frameGroup.add(topBorder);
        
        // Bottom border
        const bottomBorder = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, borderThickness, 0.2),
            borderMaterial
        );
        bottomBorder.position.y = -0.13;
        frameGroup.add(bottomBorder);
        
        // Left border
        const leftBorder = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 0.25, borderThickness),
            borderMaterial
        );
        leftBorder.position.z = -0.09;
        frameGroup.add(leftBorder);
        
        // Right border
        const rightBorder = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 0.25, borderThickness),
            borderMaterial
        );
        rightBorder.position.z = 0.09;
        frameGroup.add(rightBorder);
        
        // Stand at back
        const stand = new THREE.Mesh(
            new THREE.BoxGeometry(0.01, 0.15, 0.08),
            new THREE.MeshStandardMaterial({ color: frameColor })
        );
        stand.position.set(-0.02, -0.05, 0);
        stand.rotation.x = -0.3;
        frameGroup.add(stand);
        
        frameGroup.position.set(x, y + 0.125, 0.15);
        parent.add(frameGroup);
    }

    createChair() {
        const chairGroup = new THREE.Group();
        
        // Seat
        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.1, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x667788 })
        );
        seat.position.y = 0.5;
        seat.castShadow = true;
        chairGroup.add(seat);

        // Backrest
        const backrest = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x667788 })
        );
        backrest.position.set(0, 0.75, -0.2);
        backrest.castShadow = true;
        chairGroup.add(backrest);

        // Legs
        const legPositions = [
            [-0.2, 0.25, -0.2],
            [0.2, 0.25, -0.2],
            [-0.2, 0.25, 0.2],
            [0.2, 0.25, 0.2]
        ];
        
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.03, 0.5),
                new THREE.MeshStandardMaterial({ color: 0x333333 })
            );
            leg.position.set(...pos);
            leg.castShadow = true;
            chairGroup.add(leg);
        });

        chairGroup.position.set(-1, 0, -2);
        chairGroup.rotation.y = Math.PI; // Face the desk
        this.scene.add(chairGroup);
    }

    createDecorations() {
        // Rug
        this.createRug();
        
        // Cushions on bed
        this.createCushion(2.8, 0.85, -1.8);
        this.createCushion(3.2, 0.85, -1.6);
    }

    createPlant(x, y, z) {
        const plantGroup = new THREE.Group();
        
        // Pot
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.12, 0.25, 8),
            new THREE.MeshStandardMaterial({ color: 0xcd853f })
        );
        pot.position.y = 0.125;
        pot.castShadow = true;
        plantGroup.add(pot);

        // Plant leaves
        for (let i = 0; i < 5; i++) {
            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0x228b22 })
            );
            const angle = (i / 5) * Math.PI * 2;
            leaf.position.set(
                Math.cos(angle) * 0.1,
                0.3 + Math.random() * 0.2,
                Math.sin(angle) * 0.1
            );
            leaf.castShadow = true;
            plantGroup.add(leaf);
        }

        plantGroup.position.set(x, y, z);
        this.scene.add(plantGroup);
    }

    createRug() {
        const rugGroup = new THREE.Group();
        
        // Main rug with better material
        const rug = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.02, 4),
            new THREE.MeshStandardMaterial({ 
                color: 0xb8503c,
                roughness: 0.95,
                metalness: 0
            })
        );
        rug.position.y = 0.02;
        rug.castShadow = true;
        rug.receiveShadow = true;
        rugGroup.add(rug);

        // Add border pattern with raised edges
        const borderColor = 0xd2691e;
        const borderWidth = 0.2;
        const borderHeight = 0.03;
        
        // Top border
        const topBorder = new THREE.Mesh(
            new THREE.BoxGeometry(3, borderHeight, borderWidth),
            new THREE.MeshStandardMaterial({ 
                color: borderColor, 
                roughness: 0.9 
            })
        );
        topBorder.position.set(0, 0.025, -2 + borderWidth/2);
        topBorder.castShadow = true;
        rugGroup.add(topBorder);
        
        // Bottom border
        const bottomBorder = new THREE.Mesh(
            new THREE.BoxGeometry(3, borderHeight, borderWidth),
            new THREE.MeshStandardMaterial({ 
                color: borderColor, 
                roughness: 0.9 
            })
        );
        bottomBorder.position.set(0, 0.025, 2 - borderWidth/2);
        bottomBorder.castShadow = true;
        rugGroup.add(bottomBorder);
        
        // Left border
        const leftBorder = new THREE.Mesh(
            new THREE.BoxGeometry(borderWidth, borderHeight, 4),
            new THREE.MeshStandardMaterial({ 
                color: borderColor, 
                roughness: 0.9 
            })
        );
        leftBorder.position.set(-1.5 + borderWidth/2, 0.025, 0);
        leftBorder.castShadow = true;
        rugGroup.add(leftBorder);
        
        // Right border
        const rightBorder = new THREE.Mesh(
            new THREE.BoxGeometry(borderWidth, borderHeight, 4),
            new THREE.MeshStandardMaterial({ 
                color: borderColor, 
                roughness: 0.9 
            })
        );
        rightBorder.position.set(1.5 - borderWidth/2, 0.025, 0);
        rightBorder.castShadow = true;
        rugGroup.add(rightBorder);

        // Add center pattern lines for detail
        for (let i = 0; i < 3; i++) {
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(2.5, 0.025, 0.05),
                new THREE.MeshStandardMaterial({ 
                    color: 0x8b3a2a,
                    roughness: 0.95
                })
            );
            line.position.set(0, 0.03, -1 + i);
            rugGroup.add(line);
        }

        rugGroup.position.set(-1, 0, 1.5);
        this.scene.add(rugGroup);
    }

    createLamp() {
        const lampGroup = new THREE.Group();
        
        // Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        lampGroup.add(base);

        // Pole
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.4),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        pole.position.y = 0.2;
        lampGroup.add(pole);

        // Lampshade
        const shade = new THREE.Mesh(
            new THREE.ConeGeometry(0.15, 0.2, 8),
            new THREE.MeshStandardMaterial({ 
                color: 0xffb366,
                emissive: 0xffb366,
                emissiveIntensity: 0.3
            })
        );
        shade.position.y = 0.45;
        lampGroup.add(shade);

        lampGroup.position.set(-2, 0.8, -3.5);
        this.scene.add(lampGroup);
    }

    createHangingPlant(x, y, z) {
        const plantGroup = new THREE.Group();
        
        // Hanging rope/chain
        const rope = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x654321 })
        );
        rope.position.y = 0.25;
        plantGroup.add(rope);
        
        // Pot
        const pot = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0xcd853f })
        );
        pot.scale.y = 0.7;
        plantGroup.add(pot);
        
        // Hanging vines
        for (let i = 0; i < 4; i++) {
            const vine = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.01, 0.6),
                new THREE.MeshStandardMaterial({ color: 0x2d5016 })
            );
            const angle = (i / 4) * Math.PI * 2;
            vine.position.set(
                Math.cos(angle) * 0.1,
                -0.4,
                Math.sin(angle) * 0.1
            );
            vine.rotation.z = Math.random() * 0.3;
            plantGroup.add(vine);
            
            // Leaves on vines
            for (let j = 0; j < 3; j++) {
                const leaf = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 6, 6),
                    new THREE.MeshStandardMaterial({ color: 0x228b22 })
                );
                leaf.scale.set(1.5, 0.5, 1);
                leaf.position.set(
                    Math.cos(angle) * 0.1,
                    -0.2 - j * 0.15,
                    Math.sin(angle) * 0.1
                );
                plantGroup.add(leaf);
            }
        }
        
        plantGroup.position.set(x, y, z);
        this.scene.add(plantGroup);
    }

    createWallPoster(x, y, z) {
        const posterGroup = new THREE.Group();
        
        // Poster canvas
        const poster = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.6, 0.8),
            new THREE.MeshStandardMaterial({ 
                color: 0xffd700,
                roughness: 0.7
            })
        );
        poster.castShadow = true;
        posterGroup.add(poster);
        
        // Frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 0.65, 0.85),
            new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
        );
        frame.position.x = -0.02;
        posterGroup.add(frame);
        
        posterGroup.position.set(x, y, z);
        posterGroup.rotation.y = Math.PI / 2;
        this.scene.add(posterGroup);
    }

    createLaptop(x, y, z) {
        const laptopGroup = new THREE.Group();
        
        // Base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.02, 0.25),
            new THREE.MeshStandardMaterial({ 
                color: 0x2a2a2a,
                roughness: 0.4,
                metalness: 0.6
            })
        );
        base.castShadow = true;
        laptopGroup.add(base);
        
        // Screen
        const screen = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.25, 0.02),
            new THREE.MeshStandardMaterial({ 
                color: 0x1a1a1a,
                roughness: 0.3,
                metalness: 0.5
            })
        );
        screen.position.set(0, 0.125, -0.115);
        screen.rotation.x = -0.3;
        screen.castShadow = true;
        laptopGroup.add(screen);
        
        // Screen display
        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(0.32, 0.2),
            new THREE.MeshStandardMaterial({ 
                color: 0x4a90e2,
                emissive: 0x4a90e2,
                emissiveIntensity: 0.3
            })
        );
        display.position.set(0, 0.125, -0.105);
        display.rotation.x = -0.3;
        laptopGroup.add(display);
        
        laptopGroup.position.set(x, y, z);
        laptopGroup.rotation.y = -0.3;
        this.scene.add(laptopGroup);
    }

    createMug(x, y, z) {
        const mugGroup = new THREE.Group();
        
        // Mug body
        const mug = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.04, 0.1, 16),
            new THREE.MeshStandardMaterial({ 
                color: 0xff6b6b,
                roughness: 0.6
            })
        );
        mug.castShadow = true;
        mugGroup.add(mug);
        
        // Handle
        const handle = new THREE.Mesh(
            new THREE.TorusGeometry(0.04, 0.01, 8, 16, Math.PI),
            new THREE.MeshStandardMaterial({ color: 0xff6b6b })
        );
        handle.rotation.y = Math.PI / 2;
        handle.position.set(0.05, 0, 0);
        mugGroup.add(handle);
        
        mugGroup.position.set(x, y, z);
        this.scene.add(mugGroup);
    }

    createComputerTower(x, y, z) {
        const towerGroup = new THREE.Group();
        
        // Main tower body
        const tower = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.45, 0.4),
            new THREE.MeshStandardMaterial({ 
                color: 0x2a2a2a,
                roughness: 0.4,
                metalness: 0.5
            })
        );
        tower.position.y = 0.225;
        tower.castShadow = true;
        towerGroup.add(tower);
        
        // Front panel
        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.4, 0.02),
            new THREE.MeshStandardMaterial({ 
                color: 0x1a1a1a,
                roughness: 0.3
            })
        );
        panel.position.set(0, 0.225, 0.21);
        towerGroup.add(panel);
        
        // Power button (glowing)
        const powerButton = new THREE.Mesh(
            new THREE.CircleGeometry(0.02, 16),
            new THREE.MeshStandardMaterial({ 
                color: 0x00ff00,
                emissive: 0x00ff00,
                emissiveIntensity: 0.8
            })
        );
        powerButton.position.set(0, 0.4, 0.22);
        towerGroup.add(powerButton);
        
        // Drive bays
        for (let i = 0; i < 2; i++) {
            const bay = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.03, 0.01),
                new THREE.MeshStandardMaterial({ color: 0x333333 })
            );
            bay.position.set(0, 0.15 + i * 0.05, 0.22);
            towerGroup.add(bay);
        }
        
        towerGroup.position.set(x, y, z);
        this.scene.add(towerGroup);
    }

    createStackedBooks(x, y, z) {
        const booksGroup = new THREE.Group();
        
        const bookColors = [0x8b4513, 0x2e8b57, 0x4169e1];
        
        for (let i = 0; i < 3; i++) {
            const book = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.03, 0.2),
                new THREE.MeshStandardMaterial({ 
                    color: bookColors[i],
                    roughness: 0.8
                })
            );
            book.position.y = i * 0.03;
            book.rotation.y = (Math.random() - 0.5) * 0.2;
            book.castShadow = true;
            booksGroup.add(book);
        }
        
        booksGroup.position.set(x, y, z);
        this.scene.add(booksGroup);
    }

    createNightstand(x, y, z) {
        const nightstandGroup = new THREE.Group();
        
        // Top
        const top = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.05, 0.4),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        top.position.y = 0.5;
        top.castShadow = true;
        nightstandGroup.add(top);
        
        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.45, 0.35),
            new THREE.MeshStandardMaterial({ color: 0x7a6450 })
        );
        body.position.y = 0.225;
        body.castShadow = true;
        nightstandGroup.add(body);
        
        // Drawer
        const drawer = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.15, 0.02),
            new THREE.MeshStandardMaterial({ color: 0x6b5345 })
        );
        drawer.position.set(0, 0.3, 0.175);
        nightstandGroup.add(drawer);
        
        // Knob
        const knob = new THREE.Mesh(
            new THREE.SphereGeometry(0.02, 8, 8),
            new THREE.MeshStandardMaterial({ 
                color: 0xffd700,
                metalness: 0.8,
                roughness: 0.2
            })
        );
        knob.position.set(0, 0.3, 0.19);
        nightstandGroup.add(knob);
        
        // Small lamp on nightstand
        const lampBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.02),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        lampBase.position.y = 0.53;
        nightstandGroup.add(lampBase);
        
        const lampShade = new THREE.Mesh(
            new THREE.ConeGeometry(0.08, 0.12, 8),
            new THREE.MeshStandardMaterial({ 
                color: 0xffeaa7,
                emissive: 0xffeaa7,
                emissiveIntensity: 0.2
            })
        );
        lampShade.position.y = 0.6;
        nightstandGroup.add(lampShade);
        
        nightstandGroup.position.set(x, y, z);
        this.scene.add(nightstandGroup);
    }

    createCushion(x, y, z) {
        const cushion = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.1, 0.25),
            new THREE.MeshStandardMaterial({ 
                color: 0xdda15e,
                roughness: 0.9
            })
        );
        cushion.position.set(x, y, z);
        cushion.rotation.y = Math.random() * Math.PI;
        cushion.castShadow = true;
        this.scene.add(cushion);
    }

    createCat(x, y, z) {
        const catGroup = new THREE.Group();
        
        // Cat body - BIGGER
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.25, 0.5),
            new THREE.MeshStandardMaterial({ 
                color: 0xffa500,
                roughness: 0.8
            })
        );
        body.castShadow = true;
        catGroup.add(body);
        
        // Cat head - BIGGER
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.25, 0.3),
            new THREE.MeshStandardMaterial({ color: 0xffa500 })
        );
        head.position.set(0, 0.08, -0.35);
        head.castShadow = true;
        catGroup.add(head);
        
        // Ears - BIGGER
        const ear1 = new THREE.Mesh(
            new THREE.ConeGeometry(0.08, 0.15, 3),
            new THREE.MeshStandardMaterial({ color: 0xffa500 })
        );
        ear1.position.set(-0.1, 0.25, -0.35);
        catGroup.add(ear1);
        
        const ear2 = new THREE.Mesh(
            new THREE.ConeGeometry(0.08, 0.15, 3),
            new THREE.MeshStandardMaterial({ color: 0xffa500 })
        );
        ear2.position.set(0.1, 0.25, -0.35);
        catGroup.add(ear2);
        
        // Tail - BIGGER
        const tail = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.05, 0.4),
            new THREE.MeshStandardMaterial({ color: 0xffa500 })
        );
        tail.position.set(0, 0.15, 0.3);
        tail.rotation.x = Math.PI / 4;
        catGroup.add(tail);
        
        // Legs - BIGGER
        const legPositions = [
            [-0.15, -0.15, -0.15],
            [0.15, -0.15, -0.15],
            [-0.15, -0.15, 0.15],
            [0.15, -0.15, 0.15]
        ];
        
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.04, 0.04, 0.15),
                new THREE.MeshStandardMaterial({ color: 0xffa500 })
            );
            leg.position.set(...pos);
            catGroup.add(leg);
        });
        
        catGroup.position.set(x, y, z);
        catGroup.rotation.y = -Math.PI / 4;
        this.scene.add(catGroup);
    }

    createWallVines(x, y, z) {
        const vinesGroup = new THREE.Group();
        
        // Create multiple leaves cascading down
        for (let i = 0; i < 8; i++) {
            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 8, 8),
                new THREE.MeshStandardMaterial({ 
                    color: 0x2d5016,
                    roughness: 0.8
                })
            );
            
            // Scale to make it look like a leaf
            leaf.scale.set(2, 0.3, 1);
            
            // Position leaves in a cascading pattern
            const offset = i * 0.15;
            leaf.position.set(
                Math.sin(i * 0.5) * 0.2,
                -offset,
                Math.cos(i * 0.3) * 0.1
            );
            
            leaf.rotation.z = Math.sin(i) * 0.3;
            leaf.castShadow = true;
            vinesGroup.add(leaf);
        }
        
        // Add some brighter green leaves for variety
        for (let i = 0; i < 4; i++) {
            const brightLeaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 8, 8),
                new THREE.MeshStandardMaterial({ 
                    color: 0x4a7c2f,
                    roughness: 0.7
                })
            );
            
            brightLeaf.scale.set(1.8, 0.3, 1);
            brightLeaf.position.set(
                Math.sin(i * 0.8) * 0.25,
                -i * 0.3,
                Math.cos(i * 0.4) * 0.12
            );
            
            brightLeaf.rotation.z = Math.cos(i) * 0.4;
            brightLeaf.castShadow = true;
            vinesGroup.add(brightLeaf);
        }
        
        vinesGroup.position.set(x, y, z);
        this.scene.add(vinesGroup);
    }

    createMonsteraPlant(x, y, z) {
        const plantGroup = new THREE.Group();
        
        // Pot
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.2, 0.3, 8),
            new THREE.MeshStandardMaterial({ color: 0xcd853f })
        );
        pot.position.y = 0.15;
        pot.castShadow = true;
        plantGroup.add(pot);

        // Create large monstera leaves
        const leafPositions = [
            { x: -0.3, y: 0.8, z: 0.2, rot: -0.5 },
            { x: 0.3, y: 0.9, z: -0.2, rot: 0.5 },
            { x: -0.2, y: 1.2, z: -0.3, rot: -0.3 },
            { x: 0.2, y: 1.1, z: 0.3, rot: 0.4 },
            { x: 0, y: 1.4, z: 0, rot: 0 }
        ];
        
        leafPositions.forEach(pos => {
            // Large leaf shape
            const leaf = new THREE.Mesh(
                new THREE.CircleGeometry(0.4, 8),
                new THREE.MeshStandardMaterial({ 
                    color: 0x2d5016,
                    side: THREE.DoubleSide,
                    roughness: 0.8
                })
            );
            
            leaf.position.set(pos.x, pos.y, pos.z);
            leaf.rotation.y = pos.rot;
            leaf.rotation.x = Math.PI / 6;
            leaf.castShadow = true;
            plantGroup.add(leaf);
            
            // Stem
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.03, pos.y - 0.3),
                new THREE.MeshStandardMaterial({ color: 0x3a5a2a })
            );
            stem.position.set(pos.x * 0.3, pos.y / 2, pos.z * 0.3);
            plantGroup.add(stem);
        });
        
        plantGroup.position.set(x, y, z);
        this.scene.add(plantGroup);
    }

    createStringLights() {
        const lightsGroup = new THREE.Group();
        
        // String lights from left wall corner to back wall corner
        const numBulbs = 10;
        const startX = -4.5;  // Left wall
        const endX = 2;       // Back wall
        const startY = 3.7;
        const endY = 3.7;
        const startZ = 3.5;   // Front corner
        const endZ = -4.5;    // Back corner
        const sag = 0.5;      // Natural sag
        
        // Light bulbs along the curved string
        for (let i = 0; i < numBulbs; i++) {
            const t = i / (numBulbs - 1);
            
            // Calculate position with catenary curve
            const x = startX + (endX - startX) * t;
            const z = startZ + (endZ - startZ) * t;
            
            // Catenary curve - sags in the middle
            const y = startY - sag * Math.pow(2 * t - 1, 2);
            
            // Bulb
            const bulb = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 8, 8),
                new THREE.MeshStandardMaterial({ 
                    color: 0xfff8dc,
                    emissive: 0xfff8dc,
                    emissiveIntensity: 0.7
                })
            );
            
            bulb.position.set(x, y, z);
            bulb.castShadow = true;
            lightsGroup.add(bulb);
            
            // Add subtle point light for each bulb
            const light = new THREE.PointLight(0xfff8dc, 0.3, 2);
            light.position.copy(bulb.position);
            lightsGroup.add(light);
        }
        
        // Wall attachment hooks
        const hook1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        hook1.position.set(startX, startY, startZ);
        lightsGroup.add(hook1);
        
        const hook2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0x8b7355 })
        );
        hook2.position.set(endX, endY, endZ);
        lightsGroup.add(hook2);
        
        this.scene.add(lightsGroup);
    }

    createRosePlant(x, y, z) {
        const roseGroup = new THREE.Group();
        
        // Small decorative pot
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.06, 0.12, 8),
            new THREE.MeshStandardMaterial({ color: 0xcd853f })
        );
        pot.castShadow = true;
        roseGroup.add(pot);
        
        // Stems
        const stemPositions = [
            { x: 0, z: 0, height: 0.25 },
            { x: -0.03, z: 0.02, height: 0.22 },
            { x: 0.03, z: -0.02, height: 0.2 }
        ];
        
        stemPositions.forEach((stem, index) => {
            // Green stem
            const stemMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.008, 0.01, stem.height),
                new THREE.MeshStandardMaterial({ color: 0x2d5016 })
            );
            stemMesh.position.set(stem.x, stem.height / 2 + 0.06, stem.z);
            roseGroup.add(stemMesh);
            
            // Rose flower at top of stem
            const rose = new THREE.Mesh(
                new THREE.SphereGeometry(0.035, 8, 8),
                new THREE.MeshStandardMaterial({ 
                    color: index === 0 ? 0xff1744 : (index === 1 ? 0xff4081 : 0xff5252),
                    roughness: 0.6
                })
            );
            rose.position.set(stem.x, stem.height + 0.08, stem.z);
            rose.scale.set(1, 0.8, 1);
            rose.castShadow = true;
            roseGroup.add(rose);
            
            // Small leaves on stem
            for (let i = 0; i < 2; i++) {
                const leaf = new THREE.Mesh(
                    new THREE.SphereGeometry(0.015, 6, 6),
                    new THREE.MeshStandardMaterial({ color: 0x3a5a2a })
                );
                leaf.scale.set(2, 0.3, 1);
                leaf.position.set(
                    stem.x + (i % 2 === 0 ? 0.02 : -0.02),
                    0.1 + i * 0.08,
                    stem.z
                );
                leaf.rotation.z = (i % 2 === 0 ? 0.5 : -0.5);
                roseGroup.add(leaf);
            }
        });
        
        roseGroup.position.set(x, y, z);
        this.scene.add(roseGroup);
    }

    createProjectDisplays() {
        // Project 1 - Monitor on desk (ON TOP of desk)
        const monitor = this.createMonitor(-1, 1.15, -3.5, 0);
        monitor.userData.projectId = 'project1';
        this.interactiveObjects.push(monitor);

        // Removed floating holograms - keeping only the monitor
    }

    createMonitor(x, y, z, index) {
        const monitorGroup = new THREE.Group();
        
        // Screen with solid color - no blur
        const screen = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.5, 0.05),
            new THREE.MeshStandardMaterial({ 
                color: 0x60a5fa,
                roughness: 0.3,
                metalness: 0.2
            })
        );
        screen.castShadow = true;
        monitorGroup.add(screen);

        // Screen bezel/frame
        const bezel = new THREE.Mesh(
            new THREE.BoxGeometry(0.85, 0.55, 0.03),
            new THREE.MeshStandardMaterial({ 
                color: 0x1a1a1a,
                roughness: 0.4,
                metalness: 0.4
            })
        );
        bezel.position.z = -0.04;
        bezel.castShadow = true;
        monitorGroup.add(bezel);

        // Stand base
        const standBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16),
            new THREE.MeshStandardMaterial({ 
                color: 0x2a2a2a,
                roughness: 0.3,
                metalness: 0.5
            })
        );
        standBase.position.y = -0.35;
        standBase.castShadow = true;
        monitorGroup.add(standBase);

        // Stand pole
        const stand = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.2),
            new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                roughness: 0.4,
                metalness: 0.4
            })
        );
        stand.position.y = -0.25;
        stand.castShadow = true;
        monitorGroup.add(stand);

        monitorGroup.position.set(x, y, z);
        this.scene.add(monitorGroup);
        
        return screen;
    }

    createFrame(x, y, z, index) {
        const frameGroup = new THREE.Group();
        
        // Canvas/Screen with solid colors - no blur
        const canvas = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.9, 0.05),
            new THREE.MeshStandardMaterial({ 
                color: index === 1 ? 0xa855f7 : 0x3b82f6,
                roughness: 0.4,
                metalness: 0.1
            })
        );
        canvas.castShadow = true;
        frameGroup.add(canvas);

        // Thicker, more defined border
        const borderThickness = 0.12;
        const border = new THREE.Mesh(
            new THREE.BoxGeometry(1.35, 1.05, borderThickness),
            new THREE.MeshStandardMaterial({ 
                color: 0x1a1a1a,
                roughness: 0.4,
                metalness: 0.3
            })
        );
        border.position.z = -0.06;
        border.castShadow = true;
        frameGroup.add(border);

        // Add inner frame detail
        const innerFrame = new THREE.Mesh(
            new THREE.BoxGeometry(1.25, 0.95, 0.03),
            new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                roughness: 0.5
            })
        );
        innerFrame.position.z = 0.01;
        frameGroup.add(innerFrame);

        frameGroup.position.set(x, y, z);
        this.scene.add(frameGroup);
        
        return canvas;
    }

    createHologram(x, y, z) {
        const geometry = new THREE.OctahedronGeometry(0.3);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8,
            wireframe: true
        });
        const hologram = new THREE.Mesh(geometry, material);
        hologram.position.set(x, y, z);
        hologram.castShadow = true;
        this.scene.add(hologram);
        
        return hologram;
    }

    update() {
        // Animate all holograms
        this.interactiveObjects.forEach(obj => {
            if (obj.geometry && obj.geometry.type === 'OctahedronGeometry') {
                obj.rotation.y += 0.01;
                obj.rotation.x += 0.005;
            }
        });
    }

    getInteractiveObjects() {
        return this.interactiveObjects;
    }
}
