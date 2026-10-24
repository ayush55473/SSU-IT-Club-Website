import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hero3D — Interactive 3D IT Club Developer Workstation & Holographic Innovation Core.
 * 
 * Replaces the abstract icosahedron with an unmistakably IT-focused 3D composition:
 * - A sleek, floating 3D laptop with a glowing developer code terminal.
 * - Screen renders live syntax-highlighted IT Club code and a blinking cursor.
 * - Floating 3D golden code brackets { } and an orbiting silicon processor die.
 * - Warm emissive Mustard Gold (#AE7B29) and Dark Brown (#672C1C) lighting & ambient glow.
 * - Exact same smooth mouse-following cursor parallax and tilt effect.
 * - High performance, lightweight WebGL with proper resource disposal on unmount.
 */
export function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    // Adjusted camera distance to ensure full object fits comfortably without side cropping
    camera.position.set(0, 0.25, 7.8);

    // 2. WebGL Renderer with alpha transparency and antialiasing
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup (Studio warm key light + screen glow)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Primary Mustard Gold Key Light
    const dirGoldLight = new THREE.DirectionalLight(0xae7b29, 2.4);
    dirGoldLight.position.set(4, 5, 4);
    scene.add(dirGoldLight);

    // Secondary Dark Brown Rim Light
    const dirBrownLight = new THREE.DirectionalLight(0x672c1c, 1.8);
    dirBrownLight.position.set(-4, -3, -2);
    scene.add(dirBrownLight);

    // Emissive Golden Screen Point Light (casts glow onto keyboard & space)
    const screenGlowLight = new THREE.PointLight(0xae7b29, 3.2, 5);
    screenGlowLight.position.set(0, 0.8, 0.6);
    scene.add(screenGlowLight);

    // 4. Main Composition Group (Tilts with cursor)
    const mainGroup = new THREE.Group();
    // Default initial tilt for handsome editorial perspective
    mainGroup.rotation.x = 0.22;
    mainGroup.rotation.y = -0.32;
    // Scale down slightly to fit comfortably within viewport borders
    mainGroup.scale.set(0.82, 0.82, 0.82);
    scene.add(mainGroup);

    // =========================================================================
    // A. 3D LAPTOP / WORKSTATION (Symbol of IT & Coding)
    // =========================================================================
    const laptopGroup = new THREE.Group();
    mainGroup.add(laptopGroup);

    // Shared Palette Materials
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x672c1c, // Dark Brown brand color
      metalness: 0.65,
      roughness: 0.28,
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xae7b29, // Mustard Gold accent
      metalness: 0.85,
      roughness: 0.2,
    });

    const keyboardBaseMat = new THREE.MeshStandardMaterial({
      color: 0x3d170e, // Darker mahogany tone for keyboard well
      roughness: 0.5,
      metalness: 0.3,
    });

    // 1. Laptop Base Chassis
    const baseGeo = new THREE.BoxGeometry(3.0, 0.12, 2.0);
    const baseMesh = new THREE.Mesh(baseGeo, chassisMat);
    laptopGroup.add(baseMesh);

    // Golden perimeter bevel trim on base
    const baseTrimGeo = new THREE.BoxGeometry(3.04, 0.02, 2.04);
    const baseTrimMesh = new THREE.Mesh(baseTrimGeo, goldTrimMat);
    baseTrimMesh.position.y = 0.06;
    laptopGroup.add(baseTrimMesh);

    // 2. Trackpad
    const trackpadGeo = new THREE.PlaneGeometry(0.85, 0.55);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0xFAF6F4,
      roughness: 0.4,
      metalness: 0.1,
    });
    const trackpadMesh = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpadMesh.rotation.x = -Math.PI / 2;
    trackpadMesh.position.set(0, 0.065, 0.58);
    laptopGroup.add(trackpadMesh);

    // Trackpad golden border
    const trackpadBorderGeo = new THREE.PlaneGeometry(0.88, 0.58);
    const trackpadBorder = new THREE.Mesh(trackpadBorderGeo, goldTrimMat);
    trackpadBorder.rotation.x = -Math.PI / 2;
    trackpadBorder.position.set(0, 0.063, 0.58);
    laptopGroup.add(trackpadBorder);

    // 3. Keyboard Well & Keys
    const keyWellGeo = new THREE.PlaneGeometry(2.6, 1.05);
    const keyWellMesh = new THREE.Mesh(keyWellGeo, keyboardBaseMat);
    keyWellMesh.rotation.x = -Math.PI / 2;
    keyWellMesh.position.set(0, 0.062, -0.3);
    laptopGroup.add(keyWellMesh);

    // Individual Keycaps Grid
    const keyGeo = new THREE.BoxGeometry(0.16, 0.035, 0.16);
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x542114,
      emissive: 0xae7b29,
      emissiveIntensity: 0.25,
      roughness: 0.4,
      metalness: 0.5,
    });

    const keyRows = 5;
    const keyCols = 13;
    const keysGroup = new THREE.Group();
    laptopGroup.add(keysGroup);

    for (let r = 0; r < keyRows; r++) {
      for (let c = 0; c < keyCols; c++) {
        // Skip spacebar area for realistic layout
        if (r === keyRows - 1 && c >= 4 && c <= 8) continue;
        const key = new THREE.Mesh(keyGeo, keyMat);
        key.position.set(
          -1.15 + c * 0.192,
          0.08,
          -0.7 + r * 0.198
        );
        keysGroup.add(key);
      }
    }

    // Spacebar Key
    const spacebarGeo = new THREE.BoxGeometry(0.95, 0.035, 0.16);
    const spacebar = new THREE.Mesh(spacebarGeo, keyMat);
    spacebar.position.set(0, 0.08, -0.7 + (keyRows - 1) * 0.198);
    keysGroup.add(spacebar);

    // 4. Laptop Display Screen Lid
    const lidGroup = new THREE.Group();
    // Position hinge at back edge of base
    lidGroup.position.set(0, 0.06, -1.0);
    // Open angle ~112 degrees
    lidGroup.rotation.x = -Math.PI * 0.14;
    laptopGroup.add(lidGroup);

    // Display Back Lid (Dark Brown)
    const lidGeo = new THREE.BoxGeometry(3.0, 1.95, 0.08);
    const lidMesh = new THREE.Mesh(lidGeo, chassisMat);
    lidMesh.position.set(0, 0.975, 0);
    lidGroup.add(lidMesh);

    // Lid Golden Perimeter Frame
    const lidFrameGeo = new THREE.BoxGeometry(3.04, 1.99, 0.02);
    const lidFrame = new THREE.Mesh(lidFrameGeo, goldTrimMat);
    lidFrame.position.set(0, 0.975, -0.01);
    lidGroup.add(lidFrame);

    // Golden University IT Club Badge on Lid Back
    const lidLogoGeo = new THREE.TorusGeometry(0.24, 0.025, 12, 32);
    const lidLogoMesh = new THREE.Mesh(lidLogoGeo, goldTrimMat);
    lidLogoMesh.position.set(0, 0.975, -0.05);
    lidGroup.add(lidLogoMesh);

    // =========================================================================
    // B. DYNAMIC GLOWING CODE TERMINAL SCREEN
    // =========================================================================
    // High-resolution procedural canvas for crystal clear syntax
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 680;
    const ctx = screenCanvas.getContext('2d');

    // Helper to draw terminal content on canvas
    const renderTerminalCanvas = (blinkOn = true) => {
      // 1. Dark Chocolate Terminal Background
      ctx.fillStyle = '#220B04';
      ctx.fillRect(0, 0, 1024, 680);

      // 2. Terminal Header Bar
      ctx.fillStyle = '#1A0702';
      ctx.fillRect(0, 0, 1024, 65);
      ctx.strokeStyle = '#AE7B29';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 65);
      ctx.lineTo(1024, 65);
      ctx.stroke();

      // Window Control Dots
      // Red dot
      ctx.fillStyle = '#853925';
      ctx.beginPath();
      ctx.arc(36, 32, 11, 0, Math.PI * 2);
      ctx.fill();

      // Mustard Gold dot
      ctx.fillStyle = '#AE7B29';
      ctx.beginPath();
      ctx.arc(68, 32, 11, 0, Math.PI * 2);
      ctx.fill();

      // Green dot
      ctx.fillStyle = '#5A7545';
      ctx.beginPath();
      ctx.arc(100, 32, 11, 0, Math.PI * 2);
      ctx.fill();

      // Window Title Tab
      ctx.fillStyle = '#AE7B29';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('⚡ it-club-core.js  —  [UNIVERSITY IT CLUB]', 150, 40);

      // 3. Syntax Highlighted Code Lines
      const startX = 45;
      let startY = 125;
      const lineHeight = 42;

      const lines = [
        { text: '// 🎓 UNIVERSITY IT CLUB — Where Ideas Meet Innovation', color: '#AE7B29', bold: true },
        { text: 'import { Innovation, Community } from "@campus/it";', color: '#FFFFFF' },
        { text: '', color: '#FFFFFF' },
        { text: 'const itClub = new Community({', color: '#FFFFFF' },
        { text: '  motto: "Where Ideas Meet Innovation",', color: '#D8A54E' },
        { text: '  activities: ["Workshops", "Tech Seminars", "Showcase"],', color: '#FFFFFF' },
        { text: '  activeMembers: "Students & Tech Enthusiasts",', color: '#D8A54E' },
        { text: '  academicYear: "2026 – 2027"', color: '#AE7B29' },
        { text: '});', color: '#FFFFFF' },
        { text: '', color: '#FFFFFF' },
        { text: '> itClub.launch();  // 🚀 Building the Future Together', color: '#AE7B29', bold: true },
      ];

      lines.forEach((line) => {
        ctx.fillStyle = line.color;
        ctx.font = line.bold ? 'bold 25px monospace' : '23px monospace';
        ctx.fillText(line.text, startX, startY);
        startY += lineHeight;
      });

      // 4. Blinking Terminal Cursor
      if (blinkOn) {
        ctx.fillStyle = '#AE7B29';
        ctx.fillRect(startX + 695, startY - lineHeight + 4, 16, 26);
      }
    };

    renderTerminalCanvas(true);
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.anisotropy = 16;

    // Glowing screen material
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissive: 0xffffff,
      emissiveMap: screenTexture,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      metalness: 0.1,
    });

    const screenGeo = new THREE.PlaneGeometry(2.78, 1.76);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.975, 0.042);
    lidGroup.add(screenMesh);

    // =========================================================================
    // C. FLOATING 3D CODE BRACKETS { } (Universal IT Symbol)
    // =========================================================================
    const bracketsGroup = new THREE.Group();
    mainGroup.add(bracketsGroup);

    // Helper to generate a 3D Curly Bracket path
    const createBracketGeometry = (isLeft = true) => {
      const shape = new THREE.Shape();
      const mult = isLeft ? 1 : -1;
      // Procedural 3D bracket contour
      shape.moveTo(0 * mult, 0.8);
      shape.lineTo(0.12 * mult, 0.8);
      shape.lineTo(0.12 * mult, 0.45);
      shape.lineTo(0.25 * mult, 0.15);
      shape.lineTo(0.32 * mult, 0); // Point
      shape.lineTo(0.25 * mult, -0.15);
      shape.lineTo(0.12 * mult, -0.45);
      shape.lineTo(0.12 * mult, -0.8);
      shape.lineTo(0 * mult, -0.8);
      shape.lineTo(0 * mult, -0.7);
      shape.lineTo(0.04 * mult, -0.7);
      shape.lineTo(0.04 * mult, -0.4);
      shape.lineTo(0.16 * mult, -0.1);
      shape.lineTo(0.2 * mult, 0);
      shape.lineTo(0.16 * mult, 0.1);
      shape.lineTo(0.04 * mult, 0.4);
      shape.lineTo(0.04 * mult, 0.7);
      shape.lineTo(0 * mult, 0.7);
      shape.closePath();

      return new THREE.ExtrudeGeometry(shape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      });
    };

    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0xae7b29, // Mustard Gold
      emissive: 0x672c1c,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.2,
    });

    // Left Bracket { (Positioned comfortably close to the laptop)
    const leftBracketGeo = createBracketGeometry(true);
    const leftBracket = new THREE.Mesh(leftBracketGeo, bracketMat);
    leftBracket.position.set(-1.75, 0.7, 0.35);
    leftBracket.scale.set(1.05, 1.05, 1.05);
    bracketsGroup.add(leftBracket);

    // Right Bracket } (Positioned comfortably close to the laptop)
    const rightBracketGeo = createBracketGeometry(false);
    const rightBracket = new THREE.Mesh(rightBracketGeo, bracketMat);
    rightBracket.position.set(1.75, 0.7, 0.35);
    rightBracket.scale.set(1.05, 1.05, 1.05);
    bracketsGroup.add(rightBracket);

    // =========================================================================
    // D. ORBITING 3D SILICON PROCESSOR / CHIP DIE
    // =========================================================================
    const chipGroup = new THREE.Group();
    chipGroup.position.set(1.45, 1.55, -0.3);
    mainGroup.add(chipGroup);

    // Ceramic package base (Dark Brown)
    const chipBaseGeo = new THREE.BoxGeometry(0.65, 0.65, 0.08);
    const chipBase = new THREE.Mesh(chipBaseGeo, chassisMat);
    chipGroup.add(chipBase);

    // Silicon core die with golden border
    const siliconDieGeo = new THREE.BoxGeometry(0.38, 0.38, 0.1);
    const siliconDieMat = new THREE.MeshStandardMaterial({
      color: 0xae7b29,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xae7b29,
      emissiveIntensity: 0.4,
    });
    const siliconDie = new THREE.Mesh(siliconDieGeo, siliconDieMat);
    chipGroup.add(siliconDie);

    // Golden Pin Leads around chip
    const pinGeo = new THREE.BoxGeometry(0.035, 0.035, 0.035);
    for (let p = -3; p <= 3; p++) {
      // Top pins
      const pinTop = new THREE.Mesh(pinGeo, goldTrimMat);
      pinTop.position.set(p * 0.085, 0.35, 0);
      chipGroup.add(pinTop);

      // Bottom pins
      const pinBottom = new THREE.Mesh(pinGeo, goldTrimMat);
      pinBottom.position.set(p * 0.085, -0.35, 0);
      chipGroup.add(pinBottom);
    }

    // =========================================================================
    // E. FLOATING DATA NODES & ORBITAL GOLDEN RINGS
    // =========================================================================
    // Dynamic Orbital Gimbal Ring (Scaled to fit without clipping)
    const orbitRingGeo = new THREE.TorusGeometry(2.15, 0.022, 16, 120);
    const orbitRing = new THREE.Mesh(orbitRingGeo, goldTrimMat);
    orbitRing.rotation.x = Math.PI / 3;
    orbitRing.rotation.y = Math.PI / 6;
    mainGroup.add(orbitRing);

    // Floating Data Cubes / Innovation Nodes
    const satelliteGroup = new THREE.Group();
    mainGroup.add(satelliteGroup);

    const satelliteCubes = [];
    const cubeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const goldCubeMat = new THREE.MeshStandardMaterial({
      color: 0xae7b29,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xae7b29,
      emissiveIntensity: 0.3,
    });
    const brownCubeMat = new THREE.MeshStandardMaterial({
      color: 0x672c1c,
      metalness: 0.5,
      roughness: 0.3,
    });

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 1.95;
      const mat = i % 2 === 0 ? goldCubeMat : brownCubeMat;
      const cube = new THREE.Mesh(cubeGeo, mat);
      cube.position.set(Math.cos(angle) * radius, (Math.sin(angle) * radius) * 0.5, Math.sin(angle) * radius * 0.7);
      satelliteGroup.add(cube);
      satelliteCubes.push({ mesh: cube, angle, speed: 0.009 + i * 0.002, radius });
    }

    // Ambient Golden Particle Swarm
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 5.2;
      particlePositions[i + 1] = (Math.random() - 0.5) * 4.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xae7b29,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // =========================================================================
    // 5. CURSOR-BASED PARALLAX & TILT INTERACTION (EXACT SAME AS BEFORE)
    // =========================================================================
    let targetRotationX = 0.22;
    let targetRotationY = -0.32;
    let currentRotationX = 0.22;
    let currentRotationY = -0.32;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Smooth mouse-following rotation range
      targetRotationY = -0.32 + mouseX * 0.55;
      targetRotationX = 0.22 + -mouseY * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 7. Render Loop with Hover Floating & Cursor Lerp
    let animationId;
    let clock = new THREE.Clock();
    let lastBlink = 0;
    let cursorState = true;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Blinking Terminal Cursor update every 500ms
      if (elapsedTime - lastBlink > 0.5) {
        cursorState = !cursorState;
        renderTerminalCanvas(cursorState);
        screenTexture.needsUpdate = true;
        lastBlink = elapsedTime;
      }

      if (!prefersReducedMotion) {
        // Subtle levitation / floating kinetics
        laptopGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.09;
        
        // Gentle rotation of floating code brackets
        leftBracket.rotation.y = Math.sin(elapsedTime * 1.2) * 0.25;
        leftBracket.position.y = 0.8 + Math.cos(elapsedTime * 1.6) * 0.08;

        rightBracket.rotation.y = -Math.sin(elapsedTime * 1.2) * 0.25;
        rightBracket.position.y = 0.8 + Math.sin(elapsedTime * 1.6) * 0.08;

        // Rotating processor chip
        chipGroup.rotation.y += 0.015;
        chipGroup.rotation.x = Math.sin(elapsedTime * 1.1) * 0.2;
        chipGroup.position.y = 1.9 + Math.sin(elapsedTime * 1.8) * 0.07;

        // Orbiting Ring
        orbitRing.rotation.z += 0.006;
        orbitRing.rotation.y += 0.004;

        // Animate satellite nodes
        satelliteCubes.forEach((item) => {
          item.angle += item.speed;
          item.mesh.position.x = Math.cos(item.angle) * item.radius;
          item.mesh.position.z = Math.sin(item.angle) * item.radius;
          item.mesh.rotation.x += 0.02;
          item.mesh.rotation.y += 0.02;
        });

        // Slow ambient particle drifting
        particles.rotation.y += 0.0015;

        // Ultra-smooth mouse parallax tracking lerp
        currentRotationX += (targetRotationX - currentRotationX) * 0.065;
        currentRotationY += (targetRotationY - currentRotationY) * 0.065;

        mainGroup.rotation.x = currentRotationX;
        mainGroup.rotation.y = currentRotationY;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup & Disposal on unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Geometries
      baseGeo.dispose();
      baseTrimGeo.dispose();
      trackpadGeo.dispose();
      trackpadBorderGeo.dispose();
      keyWellGeo.dispose();
      keyGeo.dispose();
      spacebarGeo.dispose();
      lidGeo.dispose();
      lidFrameGeo.dispose();
      lidLogoGeo.dispose();
      screenGeo.dispose();
      leftBracketGeo.dispose();
      rightBracketGeo.dispose();
      chipBaseGeo.dispose();
      siliconDieGeo.dispose();
      pinGeo.dispose();
      orbitRingGeo.dispose();
      cubeGeo.dispose();
      particleGeo.dispose();

      // Dispose Materials & Textures
      chassisMat.dispose();
      goldTrimMat.dispose();
      keyboardBaseMat.dispose();
      trackpadMat.dispose();
      keyMat.dispose();
      screenMat.dispose();
      screenTexture.dispose();
      bracketMat.dispose();
      siliconDieMat.dispose();
      goldCubeMat.dispose();
      brownCubeMat.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] flex items-center justify-center">
      {/* Enhanced Multi-layer Glow Aura behind the 3D model */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl opacity-35 pointer-events-none animate-pulse-subtle"
        style={{
          background: 'radial-gradient(circle, rgba(174,123,41,0.55) 0%, rgba(103,44,28,0.25) 45%, transparent 75%)',
        }}
      />
      <div 
        className="absolute w-72 h-72 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(174,123,41,0.3) 50%, transparent 80%)',
        }}
      />
      
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
        aria-label="Interactive 3D University IT Club Developer Workstation & Holographic Innovation Core"
      />

      {/* Subtle Tech Coordinates Tag (University IT Club Branding) */}
      <div className="absolute bottom-2 right-4 text-[10px] uppercase tracking-widest text-[#AE7B29] font-semibold bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded border border-[rgba(174,123,41,0.3)] shadow-xs pointer-events-none select-none flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#AE7B29] animate-ping" />
      </div>
    </div>
  );
}
