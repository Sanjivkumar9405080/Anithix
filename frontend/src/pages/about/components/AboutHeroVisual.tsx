import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface AboutHeroVisualProps {
  className?: string;
}

export const AboutHeroVisual = ({ className = '' }: AboutHeroVisualProps) => {
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
    camera.position.set(0, 0, 7.5);

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

    // 3. Main Composition Group
    const visualGroup = new THREE.Group();
    scene.add(visualGroup);

    // 4. Central Connected Crystalline Nodes (representing Ideas -> Transformation)
    const nodeCoords = [
      { x: 0, y: 0.8, z: 0, radius: 0.7, color: 0x635BFF },
      { x: -1.4, y: -0.7, z: 0.5, radius: 0.55, color: 0x38BDF8 },
      { x: 1.4, y: -0.6, z: -0.4, radius: 0.6, color: 0x8B7CFF },
      { x: 0, y: -1.3, z: 0.8, radius: 0.45, color: 0x5145E5 },
    ];

    const nodeMeshes: THREE.Mesh[] = [];
    nodeCoords.forEach((coord) => {
      const geo = new THREE.OctahedronGeometry(coord.radius, 1);
      const mat = new THREE.MeshPhysicalMaterial({
        color: coord.color,
        emissive: coord.color,
        emissiveIntensity: 0.25,
        roughness: 0.15,
        metalness: 0.1,
        transmission: 0.65,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(coord.x, coord.y, coord.z);
      visualGroup.add(mesh);
      nodeMeshes.push(mesh);
    });

    // 5. Connecting Energy Lines / Beams
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x8B7CFF,
      transparent: true,
      opacity: 0.45,
      linewidth: 1.5,
    });

    for (let i = 0; i < nodeCoords.length; i++) {
      for (let j = i + 1; j < nodeCoords.length; j++) {
        const points = [
          new THREE.Vector3(nodeCoords[i].x, nodeCoords[i].y, nodeCoords[i].z),
          new THREE.Vector3(nodeCoords[j].x, nodeCoords[j].y, nodeCoords[j].z),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        visualGroup.add(line);
      }
    }

    // 6. Orbital Flow Rings
    const ringGroup = new THREE.Group();
    visualGroup.add(ringGroup);

    const ringGeo1 = new THREE.TorusGeometry(2.4, 0.015, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x635BFF,
      emissive: 0x635BFF,
      emissiveIntensity: 0.4,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.8, 0.012, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      emissive: 0x38BDF8,
      emissiveIntensity: 0.4,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    ringGroup.add(ring2);

    // 7. Ambient Particle Field
    const particleCount = 40;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.0 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x635BFF,
      size: 0.065,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    visualGroup.add(particles);

    // 8. Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38BDF8, 2.2);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x635BFF, 2.0);
    dirLight2.position.set(-5, -4, 4);
    scene.add(dirLight2);

    // Mouse Parallax
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.4;
      targetY = -y * 0.3;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Scroll offset
    let scrollOffset = 0;
    const handleScroll = () => {
      scrollOffset = Math.min(window.scrollY / window.innerHeight, 1.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        visualGroup.rotation.y += (targetX + elapsed * 0.12 + scrollOffset * 0.3 - visualGroup.rotation.y) * 0.05;
        visualGroup.rotation.x += (targetY + scrollOffset * 0.2 - visualGroup.rotation.x) * 0.05;

        ring1.rotation.z = elapsed * 0.2 + scrollOffset * 0.4;
        ring2.rotation.z = -elapsed * 0.15 - scrollOffset * 0.3;

        nodeMeshes.forEach((mesh, idx) => {
          mesh.rotation.y = elapsed * (0.2 + idx * 0.1);
          mesh.rotation.x = Math.sin(elapsed * 0.5 + idx) * 0.2;
        });

        particles.rotation.y = elapsed * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);

      nodeMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion]);

  if (!hasWebGL) {
    return (
      <div className={`relative w-full h-full min-h-[380px] lg:min-h-[500px] flex items-center justify-center ${className}`}>
        <div className="relative w-64 h-64 rounded-full border border-primary/20 bg-gradient-to-tr from-background-lavender to-background-softBlue flex items-center justify-center shadow-soft-lg">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 rotate-12 flex items-center justify-center shadow-glow-primary">
            <span className="text-white font-black text-2xl font-heading -rotate-12">A</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[380px] lg:min-h-[520px] flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
