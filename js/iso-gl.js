/*
 * Shared 3D (three.js, WebGL) setup for the cube illustrations: js/hero-3d.js (Home hero) and
 * js/about-3d.js (About hero).
 *
 * Each 3D version draws on a canvas laid exactly over an existing isometric svg, with the camera
 * fitted to that svg's viewBox, so the 3D cubes land where the svg cubes were and the layout does
 * not change. The svg stays as the size reference and the fallback when WebGL is missing.
 * Camera and lights follow the live site's hero: an orthographic isometric camera that turns a
 * little toward the cursor, a soft sky light and one sun.
 *
 * Voxel (x, y, z) — x down-right, y down-left, z up, as in js/isometric.js — sits at three.js
 * (x, z, y), with the cube centred in its cell.
 */
(function () {
  // Also preloaded in the <head> of every page with a 3D hero (<link rel="modulepreload">); keep in sync.
  const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js";
  let loading = null;

  /** True when the browser can draw WebGL. The probe context is released straight away. */
  function supported() {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") || probe.getContext("webgl");
    if (!gl) return false;
    const lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
    return true;
  }

  /** Loads three.js once per page. */
  function load() {
    if (!loading) loading = import(THREE_URL);
    return loading;
  }

  /**
   * Builds the renderer, camera and lights over an svg.
   *   holder: the element the svg fills; the canvas is added to it.
   *   svg: the isometric svg whose viewBox frames the scene.
   *   target: [x, y, z] voxel point the camera looks at and turns around.
 *   bleed: extra canvas around the svg, as a share of its size (default 0), so cubes that fly
 *          in from outside the frame are drawn there too instead of popping in at the edge.
   * Throws if WebGL cannot start; the caller then keeps the svg.
   */
  function stage(THREE, { holder, svg, target, bleed = 0 }) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.className = "iso-gl";
    canvas.setAttribute("aria-hidden", "true");
    holder.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8d939a, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(14, 20, -6);
    scene.add(sun);

    /* Camera: isometric. In the svg one cube edge is 1 unit long; on an isometric camera it is
       √(2/3), so the svg frame scales by K. */
    const K = Math.sqrt(2 / 3);
    const COS = Math.cos(Math.PI / 6);
    const [vx, vy, vz] = target;
    const center = new THREE.Vector3(vx, vz, vy);
    // Where the target lands in svg units (svg y runs down)
    const tx = (vx - vy) * COS;
    const ty = (vx + vy) * 0.5 - vz;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    const YAW = Math.PI / 4;
    const PITCH = Math.atan(1 / Math.SQRT2);
    let yaw = 0, pitch = 0, goalYaw = 0, goalPitch = 0;
    const orbit = () => {
      const a = PITCH + pitch;
      camera.position.set(
        center.x + 40 * Math.cos(a) * Math.sin(YAW + yaw),
        center.y + 40 * Math.sin(a),
        center.z + 40 * Math.cos(a) * Math.cos(YAW + yaw)
      );
      camera.lookAt(center);
    };
    orbit();

    const draw = () => renderer.render(scene, camera);

    /* Size: the canvas covers the svg; the frustum is the svg's frame, fitted like the svg's
       default "meet" (centred, scaled by the tighter side). */
    const fit = () => {
      const w = holder.clientWidth;
      const h = holder.clientHeight;
      if (!w || !h) return;
      const bw = Math.round(w * bleed);
      const bh = Math.round(h * bleed);
      renderer.setSize(w + bw * 2, h + bh * 2, false);
      if (bleed) Object.assign(canvas.style, { left: `${-bw}px`, top: `${-bh}px`, width: `${w + bw * 2}px`, height: `${h + bh * 2}px` });
      const [vbX, vbY, vbW, vbH] = svg.getAttribute("viewBox").split(" ").map(Number);
      // Scale comes from the svg box itself; the bleed only widens the view around it.
      const scale = Math.min(w / vbW, h / vbH);
      const halfW = (w + bw * 2) / scale / 2;
      const halfH = (h + bh * 2) / scale / 2;
      const cx = vbX + vbW / 2 - tx;
      const cy = vbY + vbH / 2 - ty;
      camera.left = (cx - halfW) * K;
      camera.right = (cx + halfW) * K;
      camera.top = -(cy - halfH) * K;
      camera.bottom = -(cy + halfH) * K;
      camera.updateProjectionMatrix();
      draw();
    };
    new ResizeObserver(fit).observe(holder);
    fit();

    return {
      scene,
      camera,
      canvas,
      draw,
      /** Where the cursor is, -1…1 across the area that steers the camera (0, 0 = rest). */
      aim(nx, ny) {
        goalYaw = 0.12 * nx;
        goalPitch = -0.05 * ny;
      },
      /** Eases the camera one frame toward its aim; true while it is still moving. */
      step() {
        yaw += (goalYaw - yaw) * 0.08;
        pitch += (goalPitch - pitch) * 0.08;
        orbit();
        return Math.abs(goalYaw - yaw) > 5e-4 || Math.abs(goalPitch - pitch) > 5e-4;
      },
    };
  }

  /** Cursor position across an element, -1…1 on both axes. */
  function pointerIn(element, event) {
    const box = element.getBoundingClientRect();
    return [((event.clientX - box.left) / box.width) * 2 - 1, ((event.clientY - box.top) / box.height) * 2 - 1];
  }

  window.IsoGL = { supported, load, stage, pointerIn };
})();
