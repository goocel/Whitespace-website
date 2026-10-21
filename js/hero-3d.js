/*
 * Home hero in 3D (three.js, WebGL), like the live site: the same matrix as the svg from
 * js/home.js, drawn as lit cubes with thin gaps. The camera turns a little toward the cursor,
 * and hovering a column lights its top cube and updates the caption.
 *
 * The svg stays in the page as the size reference and the fallback: the canvas sits exactly on
 * top of it and uses the same frame (camera fitted to the svg's viewBox), so the layout, size
 * and cropping do not change. No WebGL, or three.js failed to load → the svg stays.
 * Camera, lights, colours and intro timing follow the live site's hero.
 */
(function () {
  const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js";

  const hero = window.HeroMatrix;
  const holder = document.getElementById("heroMatrix");
  if (!hero || !holder) return;

  const probe = document.createElement("canvas");
  const probeGl = probe.getContext("webgl2") || probe.getContext("webgl");
  if (!probeGl) return;
  const lose = probeGl.getExtension("WEBGL_lose_context");
  if (lose) lose.loseContext();

  // Hides the svg while three.js loads; js/home-motion.js also skips its svg tilt.
  holder.dataset.gl = "loading";
  import(THREE_URL)
    .then(start)
    .catch(() => delete holder.dataset.gl);

  function start(THREE) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      delete holder.dataset.gl;
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.className = "hero__gl";
    canvas.setAttribute("aria-hidden", "true");
    holder.appendChild(canvas);

    /* ---------- Camera: isometric, fitted to the svg's frame ----------
       Voxel (x, y, z) sits at three.js (x, z, y). In the svg, one cube edge is 1 unit long;
       on an isometric camera it is √(2/3), so the svg frame scales by K. */
    const K = Math.sqrt(2 / 3);
    const COS = Math.cos(Math.PI / 6);
    const [vbX, vbY, vbW, vbH] = hero.svg.getAttribute("viewBox").split(" ").map(Number);
    const size = Math.max(...hero.voxels.map((v) => Math.max(v.x, v.y))) + 1;
    const target = new THREE.Vector3(size / 2, 1, size / 2);
    // Where the target lands in svg units (svg y runs down)
    const tx = (target.x - target.z) * COS;
    const ty = (target.x + target.z) * 0.5 - target.y;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    const YAW = Math.PI / 4;
    const PITCH = Math.atan(1 / Math.SQRT2);
    const orbit = (yaw, pitch) => {
      const a = PITCH + pitch;
      camera.position.set(
        target.x + 40 * Math.cos(a) * Math.sin(YAW + yaw),
        target.y + 40 * Math.sin(a),
        target.z + 40 * Math.cos(a) * Math.cos(YAW + yaw)
      );
      camera.lookAt(target);
    };
    orbit(0, 0);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8d939a, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(14, 20, -6);
    scene.add(sun);

    /* ---------- Cubes ---------- */
    const cubes = hero.voxels.filter((v) => v.tone !== "ghost");
    const ghostVoxel = hero.voxels.find((v) => v.tone === "ghost");
    const TONE = { light: "#e9ebee", mid: "#b9bec4", dark: "#3a3f45" };
    const ORANGE = new THREE.Color("#f2902a");
    const colors = cubes.map((v) => new THREE.Color(TONE[v.tone] || TONE.light));

    const geometry = new THREE.BoxGeometry(0.94, 0.94, 0.94);
    const mesh = new THREE.InstancedMesh(geometry, new THREE.MeshLambertMaterial({ color: 0xffffff }), cubes.length);
    colors.forEach((c, i) => mesh.setColorAt(i, c));
    mesh.frustumCulled = false; // always on screen; skips a bounds check every frame
    scene.add(mesh);

    // Highest cube of each column, the one that lights up on hover
    const topOf = new Map();
    cubes.forEach((v, i) => {
      const key = `${v.x},${v.y}`;
      if (!topOf.has(key) || cubes[topOf.get(key)].z < v.z) topOf.set(key, i);
    });

    /* ---------- The whitespace: an orange outline with a faint fill ----------
       Drawn over everything (no depth test), like the svg, so the cubes in front never hide it. */
    let ghostLines, ghostFill;
    if (ghostVoxel) {
      const box = new THREE.BoxGeometry(0.94, 0.94, 0.94);
      // Only the 9 edges you would see on a solid cube (top face, three front uprights and the
      // two bottom front edges), as in the svg; the back edges would show through otherwise.
      const h = 0.47;
      const edges = [
        [-h, h, -h, h, h, -h], [h, h, -h, h, h, h], [h, h, h, -h, h, h], [-h, h, h, -h, h, -h],
        [h, h, h, h, -h, h], [h, h, -h, h, -h, -h], [-h, h, h, -h, -h, h],
        [-h, -h, h, h, -h, h], [h, -h, -h, h, -h, h],
      ].flat();
      const outline = new THREE.BufferGeometry();
      outline.setAttribute("position", new THREE.Float32BufferAttribute(edges, 3));
      ghostLines = new THREE.LineSegments(
        outline,
        new THREE.LineBasicMaterial({ color: 0xf2902a, transparent: true, opacity: 0, depthTest: false })
      );
      ghostFill = new THREE.Mesh(
        box,
        new THREE.MeshBasicMaterial({ color: 0xf2902a, transparent: true, opacity: 0, depthTest: false, depthWrite: false })
      );
      [ghostFill, ghostLines].forEach((m, i) => {
        m.position.set(ghostVoxel.x + 0.5, ghostVoxel.z + 0.5, ghostVoxel.y + 0.5);
        m.renderOrder = 1 + i;
        scene.add(m);
      });
    }

    /* ---------- Size: the canvas covers the svg; the frustum is the svg's frame ---------- */
    const fit = () => {
      const w = holder.clientWidth;
      const h = holder.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      // Match the svg's "meet" fit: the frame is centred, scaled by the tighter side.
      const scale = Math.min(w / vbW, h / vbH);
      const halfW = w / scale / 2;
      const halfH = h / scale / 2;
      const cx = vbX + vbW / 2 - tx;
      const cy = vbY + vbH / 2 - ty;
      camera.left = (cx - halfW) * K;
      camera.right = (cx + halfW) * K;
      camera.top = -(cy - halfH) * K;
      camera.bottom = -(cy + halfH) * K;
      camera.updateProjectionMatrix();
      draw();
    };

    /* ---------- Frame loop: intro, then only while the camera is still easing ---------- */
    const dummy = new THREE.Object3D();
    let yaw = 0, pitch = 0, goalYaw = 0, goalPitch = 0;
    let startedAt = null;
    let frame = 0;
    let onScreen = true;

    const draw = () => renderer.render(scene, camera);
    const clamp01 = (n) => Math.min(1, Math.max(0, n));

    const tick = (now) => {
      frame = 0;
      const t = startedAt === null ? 0 : now - startedAt;
      // Cubes rise into place from the back corner, a ripple across the matrix
      cubes.forEach((v, i) => {
        const at = (v.x + v.y) / (size * 2) + 0.05 * v.z;
        const p = reduced ? 1 : clamp01((t - 1100 * at) / 500);
        const e = 1 - Math.pow(1 - p, 3);
        dummy.position.set(v.x + 0.5, v.z + 0.5 - (1 - e) * 1.5, v.y + 0.5);
        dummy.scale.setScalar(Math.max(1e-4, e));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.boundingSphere = null; // recomputed from the moved cubes, for hover hits
      if (ghostLines) {
        const g = reduced ? 1 : clamp01((t - 1300) / 500);
        ghostLines.material.opacity = g;
        ghostFill.material.opacity = 0.12 * g;
      }
      yaw += (goalYaw - yaw) * 0.08;
      pitch += (goalPitch - pitch) * 0.08;
      orbit(yaw, pitch);
      draw();
      const easing = Math.abs(goalYaw - yaw) > 5e-4 || Math.abs(goalPitch - pitch) > 5e-4;
      if (onScreen && ((startedAt !== null && t < 2000) || easing)) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    /* ---------- Cursor: camera follows, hover lights a column ---------- */
    const stage = holder.closest(".hero__matrix") || holder;
    const ray = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let lit = -1;

    const light = (index) => {
      if (index === lit) return;
      if (lit >= 0) mesh.setColorAt(lit, colors[lit]);
      if (index >= 0) mesh.setColorAt(index, ORANGE);
      mesh.instanceColor.needsUpdate = true;
      lit = index;
    };

    stage.addEventListener("pointermove", (event) => {
      const box = canvas.getBoundingClientRect();
      const nx = ((event.clientX - box.left) / box.width) * 2 - 1;
      const ny = -((event.clientY - box.top) / box.height) * 2 + 1;
      if (!reduced) {
        const s = stage.getBoundingClientRect();
        goalYaw = 0.12 * (((event.clientX - s.left) / s.width) * 2 - 1);
        goalPitch = -0.05 * (((event.clientY - s.top) / s.height) * 2 - 1);
      }
      if (finePointer) {
        pointer.set(nx, ny);
        ray.setFromCamera(pointer, camera);
        const hit = ray.intersectObject(mesh)[0];
        const onGhost = !hit && ghostFill && ray.intersectObject(ghostFill).length > 0;
        let key = null;
        if (hit) key = `${cubes[hit.instanceId].x},${cubes[hit.instanceId].y}`;
        else if (onGhost) key = `${ghostVoxel.x},${ghostVoxel.y}`;
        light(key && hit ? topOf.get(key) : -1);
        hero.caption.textContent = key ? hero.cellLabel(key) : hero.defaultCaption;
        stage.style.cursor = key ? "crosshair" : "";
      }
      wake();
    });
    stage.addEventListener("pointerleave", () => {
      goalYaw = 0;
      goalPitch = 0;
      light(-1);
      hero.caption.textContent = hero.defaultCaption;
      stage.style.cursor = "";
      wake();
    });

    new ResizeObserver(fit).observe(holder);
    fit();

    // Hide every cube until the intro starts, then play it once the hero is on screen.
    tick(0);
    holder.dataset.gl = "on";
    const begin = () => {
      if (startedAt === null) startedAt = performance.now();
      wake();
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) begin();
      }).observe(holder);
    } else {
      begin();
    }
  }
})();
