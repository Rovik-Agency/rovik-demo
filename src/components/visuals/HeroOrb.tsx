import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function HeroOrb() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const mount = ref.current;
    if (!mount || reduced) return;
    let dispose = false;
    let renderer: import('three').WebGLRenderer | undefined;
    import('three').then((THREE) => {
      if (dispose || !mount) return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 4.2;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);
      const geo = new THREE.IcosahedronGeometry(1.45, 3);
      const mat = new THREE.MeshStandardMaterial({ color: 0x5b6cff, roughness: .42, metalness: .18, wireframe: true });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const light = new THREE.PointLight(0x8a5cff, 2.4);
      light.position.set(2, 2, 3);
      scene.add(light);
      const resize = () => { if (!renderer || !mount) return; renderer.setSize(mount.clientWidth, mount.clientHeight); camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix(); };
      window.addEventListener('resize', resize);
      const tick = () => { if (!renderer || dispose) return; mesh.rotation.x += 0.003; mesh.rotation.y += 0.005; renderer.render(scene, camera); requestAnimationFrame(tick); };
      tick();
      return () => window.removeEventListener('resize', resize);
    });
    return () => { dispose = true; renderer?.dispose(); mount.innerHTML = ''; };
  }, [reduced]);
  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 opacity-70" />;
}
