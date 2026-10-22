/*
 * Home hero in 3D (three.js, WebGL), like the live site: the same matrix as the svg from
 * js/home.js, drawn as lit cubes with thin gaps. The camera turns a little toward the cursor,
 * and hovering a column lights its top cube and updates the caption.
 *
 * Renderer, camera fit and lights come from js/iso-gl.js: the canvas sits exactly on top of the
 * svg and uses its frame, so the layout, size and cropping do not change. No WebGL, or three.js
 * failed to load → the svg stays. Colours and intro timing follow the live site's hero.
 */
(function () {
  const hero = window.HeroMatrix;
  const holder = document.getElementById("heroMatrix");
  if (!hero || !holder || !window.IsoGL || !IsoGL.supported()) return;

  // Hides the svg while three.js loads; js/home-motion.js also skips its svg tilt.
  holder.dataset.gl = "loading";
  IsoGL.load()
    .then(start)
    .catch(() => delete holder.dataset.gl);

  function start(THREE) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const size = Math.max(...hero.voxels.map((v) => Math.max(v.x, v.y))) + 1;
    let gl;
    try {
      gl = IsoGL.stage(THREE, { holder, svg: hero.svg, target: [size / 2, size / 2, 1] });
    } catch (error) {
      delete holder.dataset.gl;
      return;
    }
    const { scene, camera, canvas, draw } = gl;

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

    /* ---------- Frame loop: intro, then only while the camera is still easing ---------- */
    const dummy = new THREE.Object3D();
    let startedAt = null;
    let frame = 0;
    let onScreen = true;
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
      const easing = gl.step();
      draw();
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
      if (!reduced) gl.aim(...IsoGL.pointerIn(stage, event));
      if (finePointer) {
        const [nx, ny] = IsoGL.pointerIn(canvas, event);
        pointer.set(nx, -ny);
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
      gl.aim(0, 0);
      light(-1);
      hero.caption.textContent = hero.defaultCaption;
      stage.style.cursor = "";
      wake();
    });

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
