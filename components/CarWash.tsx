'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll-driven car wash on a real photo.
 * Textures (public/carwash):
 *   clean.jpg – the clean car composited into a white garage
 *   mask.png  – R: car, G: area around the car, B: floor
 * progress.current (0..1):
 *   0.00–0.12 dirty
 *   0.12–0.40 snow foam is sprayed on
 *   0.42–0.76 rinse runs top to bottom, dirt goes with the foam
 *   0.78–1.00 dries, light sweeps across the paint
 */

// Car bounding box in texture coordinates (x0, y0, x1, y1), y from top.
const CAR = [0.3375, 0.3643, 0.6609, 0.6346];

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D uImg;
uniform sampler2D uMask;
uniform vec2 uRes;
uniform vec4 uRect;   // visible part of the texture: x, y, w, h
uniform vec4 uCar;    // car bbox in texture space
uniform float uP;
uniform float uTime;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.07 + 3.1; a *= 0.5; } return v; }

// foam bubbles: soft cells with darker rims
float bubbles(vec2 p){
  vec2 id = floor(p); vec2 f = fract(p) - 0.5;
  vec2 c = (vec2(hash(id), hash(id + 7.3)) - 0.5) * 0.5;
  float r = mix(0.22, 0.45, hash(id + 2.1));
  float d = length(f - c) / r;
  return smoothstep(0.7, 1.0, d) * step(d, 1.15);
}

// water droplets left on the paint after rinsing
vec3 drops(vec2 p, float scale, float seed){
  vec2 q = p * scale; vec2 id = floor(q); vec2 f = fract(q) - 0.5;
  if (hash(id + seed) > 0.42) return vec3(0.0);
  float rad = mix(0.12, 0.28, hash(id + seed + 3.7));
  vec2 c = (vec2(hash(id + seed + 1.3), hash(id + seed + 5.1)) - 0.5) * 2.0 * (0.45 - rad);
  vec2 d = f - c; d.y *= 1.15;
  float m = smoothstep(1.0, 0.75, length(d) / rad);
  return vec3(d / rad * m, m);
}

void main(){
  vec2 s = gl_FragCoord.xy / uRes; s.y = 1.0 - s.y;
  vec2 uv = uRect.xy + s * uRect.zw;
  vec3 clean = texture2D(uImg, uv).rgb;
  vec3 mk = texture2D(uMask, uv).rgb;
  float car = mk.r; float near = mk.g; float floorM = mk.b;
  vec2 cu = (uv - uCar.xy) / (uCar.zw - uCar.xy);  // 0..1 across the car
  float t = uTime;

  float foamIn = smoothstep(0.12, 0.40, uP);
  float rinse  = smoothstep(0.42, 0.76, uP);
  float finish = smoothstep(0.78, 1.00, uP);

  // rinse front: runs top → bottom with a ragged, drippy edge
  float edge = mix(-0.15, 1.2, rinse) + (fbm(vec2(cu.x*7.0, 1.3)) - 0.5)*0.16 + (noise(vec2(cu.x*25.0, 4.0)) - 0.5)*0.025;
  float rinsed = smoothstep(edge + 0.02, edge - 0.02, cu.y);
  if (rinse <= 0.0) rinsed = 0.0;

  float lum = dot(clean, vec3(0.299, 0.587, 0.114));
  vec3 col = clean;

  // ── dirt ───────────────────────────────────────────────
  float low = smoothstep(0.3, 1.0, cu.y);
  float base = smoothstep(0.97, 0.85, cu.y);          // fade out under the body (shadow area)
  float dc = car * base;
  float n1 = fbm(cu*vec2(4.0, 6.0) + 2.0);
  float n2 = fbm(cu*vec2(18.0, 26.0) + 9.0);
  vec3 dirty = mix(col, vec3(lum)*0.92 + vec3(0.045, 0.035, 0.02), 0.42);            // dull, desaturated
  float film = (0.3 + 0.7*low) * (0.55 + 0.6*n1);
  dirty = mix(dirty, vec3(0.50, 0.46, 0.40) * (0.72 + 0.45*lum), clamp(film*0.42, 0.0, 0.6)); // road film
  float spray = step(0.74 - 0.22*low, noise(cu*vec2(320.0, 340.0))) * low * (0.4 + 0.6*n2);
  dirty = mix(dirty, vec3(0.38, 0.33, 0.27), spray*0.5);                                // fine splatter
  float streak = smoothstep(0.6, 0.78, fbm(vec2(cu.x*80.0, cu.y*2.2))) * (0.3 + 0.7*low);
  dirty = mix(dirty, dirty*0.8 + vec3(0.035, 0.03, 0.02), streak*0.45);                 // drip streaks
  col = mix(col, dirty, dc * (1.0 - rinsed));

  // ── foam ───────────────────────────────────────────────
  float sprayN = fbm(cu*vec2(3.0, 4.0) + 11.0) + cu.x*0.25 - cu.y*0.15;
  float cover = smoothstep(1.05 - foamIn*1.45, 1.17 - foamIn*1.45, sprayN) * foamIn;
  float thick = smoothstep(0.25, 0.65, fbm(cu*vec2(8.0, 10.0) + 4.0 + vec2(0.0, -t*0.02)));
  // foam keeps the car's form: shade it from a softened copy of the photo
  vec2 px = uRect.zw / uRes * 6.0;
  vec3 sb = (texture2D(uImg, uv + vec2(px.x, 0.0)).rgb + texture2D(uImg, uv - vec2(px.x, 0.0)).rgb
           + texture2D(uImg, uv + vec2(0.0, px.y)).rgb + texture2D(uImg, uv - vec2(0.0, px.y)).rgb + clean) / 5.0;
  float lb = dot(sb, vec3(0.299, 0.587, 0.114));
  float grain = noise(cu*vec2(420.0, 460.0) + vec2(0.0, t*0.05)) * 0.05 + noise(cu*vec2(150.0, 160.0)) * 0.05;
  float shade = 0.7 + 0.3*smoothstep(0.02, 0.62, lb);
  vec3 foamCol = vec3(0.99, 0.992, 0.995) * shade * (0.93 + 0.07*thick) * (1.0 - grain);
  float foamA = dc * cover * mix(0.72, 0.97, thick) * (1.0 - rinsed);
  col = mix(col, foamCol, foamA);

  // running water sheet at the rinse edge
  float band = exp(-pow((cu.y - edge)/0.045, 2.0)) * car * smoothstep(0.97, 0.85, cu.y) * step(0.001, rinse) * (1.0 - finish);
  float sheet = noise(vec2(cu.x*90.0, cu.y*8.0 - t*3.0)) * noise(vec2(cu.x*35.0, cu.y*3.0 - t*2.0));
  col += vec3(0.75, 0.8, 0.85) * band * (0.25 + 0.7*sheet) * 0.55;

  // ── wet paint ──────────────────────────────────────────
  float wet = car * rinsed * (1.0 - finish);
  vec3 wetCol = (col - 0.5) * 1.08 + 0.5;
  wetCol *= 0.96;
  col = mix(col, wetCol, wet);
  vec3 d1 = drops(cu*vec2(1.0, 1.15), 48.0, 0.0);
  vec3 d2 = drops(cu*vec2(1.0, 1.15) + 0.37, 90.0, 13.0);
  vec2 dn = d1.xy + d2.xy*0.5; float dm = clamp(d1.z + d2.z*0.5, 0.0, 1.0) * wet;
  vec3 N = normalize(vec3(dn*1.3, 1.0));
  float spec = pow(max(dot(N, normalize(vec3(-0.25, 0.6, 1.0))), 0.0), 90.0);
  col = mix(col, col*0.93, dm*clamp(dot(dn,dn), 0.0, 1.0)*0.5);
  col += spec * dm * 0.55 * smoothstep(0.08, 0.3, lum);

  // ── finish: light sweep over the paint ─────────────────
  float pos = mix(-0.35, 1.35, finish);
  float dd = cu.x*0.85 + cu.y*0.45 - pos;
  float sweep = exp(-dd*dd/0.006) * car * step(0.001, finish) * (1.0 - smoothstep(0.97, 1.0, finish));
  col += (vec3(1.0) - col) * sweep * (0.25 + 0.5*smoothstep(0.25, 0.65, lum));

  // ── wet floor around the car ───────────────────────────
  float puddle = smoothstep(0.35, 0.65, fbm(uv*vec2(14.0, 26.0)) + near*0.45 - 0.25);
  float wf = floorM * (1.0 - car) * near * puddle * (rinse - finish*0.5) ;
  col = mix(col, col*0.84, clamp(wf, 0.0, 1.0));

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export default function CarWash({ progress, className }: { progress: { current: number }; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'a');
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = { res: U('uRes'), rect: U('uRect'), car: U('uCar'), p: U('uP'), time: U('uTime') };
    gl.uniform1i(U('uImg'), 0);
    gl.uniform1i(U('uMask'), 1);
    gl.uniform4f(u.car, CAR[0], CAR[1], CAR[2], CAR[3]);

    let texSize = { w: 2992, h: 2380 };
    let loaded = 0;
    const load = (unit: number, src: string) => {
      const tex = gl.createTexture();
      const img = new Image();
      img.onload = () => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (unit === 0) texSize = { w: img.naturalWidth, h: img.naturalHeight };
        loaded++;
        if (loaded === 2) canvas.style.opacity = '1';
      };
      img.src = src;
    };
    load(0, '/carwash/clean.jpg');
    load(1, '/carwash/mask.png');

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Frame the car: on wide screens it sits right of center (text on the left),
    // on phones it fills the width near the top (text below).
    const rect = () => {
      const vw = canvas.clientWidth, vh = canvas.clientHeight;
      const aspect = vw / vh;
      const wide = aspect > 1.05;
      const carW = (CAR[2] - CAR[0]) * texSize.w;
      const carCx = ((CAR[0] + CAR[2]) / 2) * texSize.w;
      const carCy = ((CAR[1] + CAR[3]) / 2) * texSize.h;
      let Vw = carW / (wide ? 0.5 : 0.94);
      let Vh = Vw / aspect;
      if (Vh > texSize.h) { Vh = texSize.h; Vw = Vh * aspect; }
      if (Vw > texSize.w) { Vw = texSize.w; Vh = Vw / aspect; }
      const fx = wide ? 0.63 : 0.5;
      const fy = wide ? 0.54 : 0.36;
      const x = Math.min(texSize.w - Vw, Math.max(0, carCx - fx * Vw));
      const y = Math.min(texSize.h - Vh, Math.max(0, carCy - fy * Vh));
      return [x / texSize.w, y / texSize.h, Vw / texSize.w, Vh / texSize.h];
    };

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || loaded < 2) return;
      const r = rect();
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform4f(u.rect, r[0], r[1], r[2], r[3]);
      gl.uniform1f(u.p, progress.current);
      gl.uniform1f(u.time, reduce ? 3 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [progress]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ opacity: 0, transition: 'opacity .6s ease' }}
    />
  );
}
