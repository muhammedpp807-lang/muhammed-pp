import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Animated Three.js network / particle sphere used in the hero section.
 * Self-contained — no global CSS side-effects.
 */
export function ThreeHero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060f, 0.08);

    const camera = new THREE.PerspectiveCamera(55, w/h, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ===== Wireframe icosahedron core =====
    const geo = new THREE.IcosahedronGeometry(1.45, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.45 });
    const core = new THREE.Mesh(geo, mat);
    scene.add(core);

    const coreInner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.0, 1),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.35 })
    );
    scene.add(coreInner);

    // ===== Orbit particles =====
    const N = 260;
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const c1 = new THREE.Color(0x22d3ee), c2 = new THREE.Color(0xa855f7), c3 = new THREE.Color(0xec4899);
    const particlesData: { r: number; a: number; b: number; s: number; c: THREE.Vector3 }[] = [];

    for (let i = 0; i < N; i++) {
      const r = 1.8 + Math.random() * 2.2;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(b) * Math.cos(a);
      const y = r * Math.sin(b) * Math.sin(a);
      const z = r * Math.cos(b);
      positions[i*3] = x; positions[i*3+1] = y; positions[i*3+2] = z;
      const pick = Math.random();
      const col = pick < 0.5 ? c1 : pick < 0.8 ? c2 : c3;
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
      particlesData.push({ r, a, b, s: 0.001 + Math.random() * 0.003, c: new THREE.Vector3(x,y,z) });
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ===== Outer ring =====
    const ringGeo = new THREE.TorusGeometry(3.6, 0.01, 6, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat); ring.rotation.x = Math.PI / 2.2; scene.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.008, 6, 128), new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.4 }));
    ring2.rotation.x = Math.PI / 3; ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    let mouseX = 0, mouseY = 0;
    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      if (!el) return;
      const W = el.clientWidth, H = el.clientHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const tmp = new THREE.Vector3();
    const loop = () => {
      core.rotation.y += 0.002; core.rotation.x += 0.001;
      coreInner.rotation.y -= 0.003; coreInner.rotation.z += 0.001;
      ring.rotation.z += 0.003; ring2.rotation.y += 0.002;
      points.rotation.y += 0.0015;

      // gentle mouse parallax
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // pulse
      const t = Date.now() * 0.001;
      for (let i = 0; i < N; i++) {
        const d = particlesData[i];
        d.a += d.s * (1 + Math.sin(t + i) * 0.2);
        const r = d.r + Math.sin(t*0.8 + i*0.5)*0.08;
        tmp.set(
          r * Math.sin(d.b) * Math.cos(d.a),
          r * Math.sin(d.b) * Math.sin(d.a),
          r * Math.cos(d.b)
        );
        (pGeo.attributes.position as THREE.BufferAttribute).setXYZ(i, tmp.x, tmp.y, tmp.z);
      }
      (pGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose(); geo.dispose(); mat.dispose(); pGeo.dispose(); pMat.dispose(); ringGeo.dispose(); ringMat.dispose();
      if (el && renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={ref} className="absolute inset-0 pointer-events-none"/>;
}
