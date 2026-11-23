import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { Lightbulb, Compass, Hammer, Sparkles } from 'lucide-react';

interface ApproachHeroVisualProps {
  className?: string;
}

export const ApproachHeroVisual = ({ className = '' }: ApproachHeroVisualProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 3. Central Illuminated Idea Node (Octahedron crystal with glow)
    const coreGeo = new THREE.OctahedronGeometry(1.1, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x635bff,
      emissive: 0x5145e5,
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.55,
      transparent: true,
      opacity: 0.95,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Fine wireframe cage around core
    const wireGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x8b7cff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // 4. Solution Stage Satellites (Discover, Plan, Build, Evolve)
    const stages = [
      { x: -2.3, y: 1.2, z: 0.2, color: 0x38bdf8, size: 0.32, label: 'Discover' },
      { x: 2.2, y: 1.4, z: -0.3, color: 0x635bff, size: 0.35, label: 'Plan' },
      { x: 2.4, y: -1.3, z: 0.4, color: 0x5145e5, size: 0.34, label: 'Build' },
      { x: -2.1, y: -1.5, z: -0.2, color: 0x8b7cff, size: 0.3, label: 'Evolve' },
    ];

    const stageMeshes: { mesh: THREE.Mesh; line: THREE.Line; origin: THREE.Vector3 }[] = [];

    stages.forEach((stage) => {
      const geo = new THREE.SphereGeometry(stage.size, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: stage.color,
        emissive: stage.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(stage.x, stage.y, stage.z);
      mainGroup.add(mesh);

      // Connecting line to center
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(stage.x, stage.y, stage.z)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: stage.color,
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      mainGroup.add(line);

      stageMeshes.push({ mesh, line, origin: new THREE.Vector3(stage.x, stage.y, stage.z) });
    });

    // 5. Orbital Conduits (Process Rings)
    const conduitMaterials = [
      new THREE.LineBasicMaterial({ color: 0x635bff, transparent: true, opacity: 0.28 }),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 }),
    ];

    const conduitRings: THREE.Line[] = [];
    [2.4, 3.2].forEach((radius, i) => {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      ringGeo.setFromPoints(points);
      const ring = new THREE.Line(ringGeo, conduitMaterials[i % conduitMaterials.length]);
      ring.rotation.x = 0.7 + i * 0.5;
      ring.rotation.y = 0.4 * i;
      mainGroup.add(ring);
      conduitRings.push(ring);
    });

    // 6. Floating Ambient Particles (Data Sparks)
    const particleCount = 40;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8b7cff,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x635bff, 2.0);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.6);
    dirLight2.position.set(-5, -4, 4);
    scene.add(dirLight2);

    // 8. Mouse Parallax
    let targetRotationX = 0;
    let targetRotationY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 0.4;
      targetRotationX = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Rotate central idea crystal
        coreMesh.rotation.y = elapsedTime * 0.25;
        coreMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.15;
        wireMesh.rotation.y = -elapsedTime * 0.2;
        wireMesh.rotation.z = elapsedTime * 0.12;

        // Smooth mouse tilt
        mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

        // Animate rings
        conduitRings.forEach((ring, i) => {
          ring.rotation.z = elapsedTime * (0.08 + i * 0.04);
        });

        // Floating stages
        stageMeshes.forEach((item, index) => {
          const { mesh, line, origin } = item;
          const floatOffset = Math.sin(elapsedTime * 1.2 + index * 1.5) * 0.15;
          mesh.position.y = origin.y + floatOffset;

          const positions = line.geometry.attributes.position.array as Float32Array;
          positions[3] = mesh.position.x;
          positions[4] = mesh.position.y;
          positions[5] = mesh.position.z;
          line.geometry.attributes.position.needsUpdate = true;
        });

        particles.rotation.y = elapsedTime * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  return (
    <div className={`relative w-full aspect-square max-w-[540px] mx-auto select-none ${className}`}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Graceful Fallback if WebGL is disabled */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-background-lavender/30 rounded-3xl border border-border">
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-primary to-electric flex items-center justify-center shadow-soft-lg animate-pulse">
            <div className="w-48 h-48 rounded-full bg-white flex flex-col items-center justify-center text-center p-4">
              <Lightbulb className="w-8 h-8 text-primary mb-2" />
              <span className="font-heading font-bold text-sm text-text-main">The ANTHIX Method</span>
              <span className="text-xs text-text-secondary">Idea → Impact</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Progressive Milestones Badges */}
      <div
        className="absolute top-4 left-0 sm:left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-soft-sm text-xs font-semibold text-text-main animate-bounce"
        style={{ animationDuration: '4s' }}
      >
        <div className="w-2 h-2 rounded-full bg-sky animate-ping" />
        <Lightbulb className="w-3.5 h-3.5 text-primary" />
        <span>01 Discover</span>
      </div>

      <div
        className="absolute top-16 right-0 sm:right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-soft-sm text-xs font-semibold text-text-main animate-bounce"
        style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}
      >
        <div className="w-2 h-2 rounded-full bg-primary" />
        <Compass className="w-3.5 h-3.5 text-primary" />
        <span>02 Plan</span>
      </div>

      <div
        className="absolute bottom-14 left-2 sm:left-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-soft-sm text-xs font-semibold text-text-main animate-bounce"
        style={{ animationDuration: '5s', animationDelay: '1s' }}
      >
        <div className="w-2 h-2 rounded-full bg-primary-deep" />
        <Hammer className="w-3.5 h-3.5 text-primary-deep" />
        <span>03 Build</span>
      </div>

      <div
        className="absolute bottom-6 right-2 sm:right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-soft-sm text-xs font-semibold text-text-main animate-bounce"
        style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>04 Evolve</span>
      </div>
    </div>
  );
};
