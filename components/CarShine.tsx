'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll-driven "bling" on a real photo (public/car).
 *   porsche.jpg      – the photo, untouched background
 *   porsche-mask.png – where the car is (white = car)
 * progress.current (0..1): a light beam sweeps across the car from front to back,
 * star glints flash on the rims, chrome and headlight as it passes, then keep twinkling softly.
 */

// Car bounding box in texture coordinates (x0, y0, x1, y1), y from top.
const CAR = [0.125, 0.3275, 0.891, 0.676];
// Bright points for the glints (texture coordinates).
const GLINTS = [
  0.266, 0.553, // front rim
  0.7051, 0.522, // rear rim
  0.5137, 0.338, // window trim
  0.4328, 0.4194, // mirror
  0.1965, 0.5021, // headlight
  0.8504, 0.5032, // rear quarter
  0.5988, 0.338, // roofline
];

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D uImg;
uniform sampler2D uMask;
uniform vec2 uRes;
uniform vec4 uRect;
uniform vec4 uCar;
uniform float uP;
uniform float uTime;
uniform vec2 uGlint[7];

float star(vec2 d, float s, float rot){
  float c = cos(rot), si = sin(rot);
  vec2 r = vec2(c*d.x - si*d.y, si*d.x + c*d.y);
  float core = exp(-dot(r, r) / (s*s*0.012));
  float halo = exp(-dot(r, r) / (s*s*0.08)) * 0.25;
  float rays = exp(-abs(r.x)/(s*0.42)) * exp(-r.y*r.y/(s*s*0.0005))
             + exp(-abs(r.y)/(s*0.42)) * exp(-r.x*r.x/(s*s*0.0005));
  vec2 q = vec2(r.x + r.y, r.x - r.y) * 0.7071;
  float diag = (exp(-abs(q.x)/(s*0.16)) * exp(-q.y*q.y/(s*s*0.0004))
              + exp(-abs(q.y)/(s*0.16)) * exp(-q.x*q.x/(s*s*0.0004))) * 0.45;
  return core*1.3 + halo + rays + diag;
}

void main(){
  vec2 s = gl_FragCoord.xy / uRes; s.y = 1.0 - s.y;
  vec2 uv = uRect.xy + s * uRect.zw;
  vec3 col = texture2D(uImg, uv).rgb;
  float car = texture2D(uMask, uv).r;
  vec2 cu = (uv - uCar.xy) / (uCar.zw - uCar.xy);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));

  // light beam across the paint
  float st = smoothstep(0.08, 0.86, uP);
  float pos = mix(-0.25, 1.25, st);
  float fade = sin(3.14159 * st);
  float d = cu.x + (cu.y - 0.5)*0.35 - pos;
  float band = exp(-d*d/0.0035) + 0.35*exp(-d*d/0.03);
  col += (vec3(1.0) - col) * band * fade * car * (0.45 + 0.5*smoothstep(0.35, 0.9, lum));

  // glints
  float done = smoothstep(0.86, 1.0, uP);
  float px = uRes.y;
  for (int i = 0; i < 7; i++) {
    vec2 g = uGlint[i];
    vec2 gc = (g - uCar.xy) / (uCar.zw - uCar.xy);
    float dg = gc.x + (gc.y - 0.5)*0.35 - pos;
    float flash = exp(-dg*dg/0.006) * step(0.001, st) * (1.0 - step(0.999, st));
    float fi = float(i);
    float tw = done * pow(max(0.0, sin(uTime*1.1 + fi*2.3)), 10.0) * 0.8;
    float amp = max(flash, tw);
    if (amp < 0.002) continue;
    vec2 dp = (uv - g) / uRect.zw * uRes;
    float size = px * 0.1 * (0.5 + 0.5*amp);
    col += vec3(1.0, 0.985, 0.95) * star(dp, size, uTime*0.25 + fi) * amp * 1.4;
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export default function CarShine({ progress, className }: { progress: { current: number }; className?: string }) {
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
    const u = { res: U('uRes'), rect: U('uRect'), p: U('uP'), time: U('uTime') };
    gl.uniform1i(U('uImg'), 0);
    gl.uniform1i(U('uMask'), 1);
    gl.uniform4f(U('uCar'), CAR[0], CAR[1], CAR[2], CAR[3]);
    gl.uniform2fv(U('uGlint'), new Float32Array(GLINTS));

    let texSize = { w: 2048, h: 1365 };
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
    load(0, '/car/porsche.jpg');
    load(1, '/car/porsche-mask.png');

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

    // Fill the canvas with the photo (like object-fit: cover), centred on the car.
    const rect = () => {
      const aspect = canvas.clientWidth / canvas.clientHeight;
      const ta = texSize.w / texSize.h;
      let Vw: number, Vh: number;
      if (aspect > ta) { Vw = texSize.w; Vh = Vw / aspect; } else { Vh = texSize.h; Vw = Vh * aspect; }
      const cx = ((CAR[0] + CAR[2]) / 2) * texSize.w;
      const cy = ((CAR[1] + CAR[3]) / 2) * texSize.h;
      const x = Math.min(texSize.w - Vw, Math.max(0, cx - Vw / 2));
      const y = Math.min(texSize.h - Vh, Math.max(0, cy - Vh * 0.56));
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
      gl.uniform1f(u.time, reduce ? 2 : (now - start) / 1000);
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
    <canvas ref={ref} aria-hidden="true" className={className} style={{ opacity: 0, transition: 'opacity .6s ease' }} />
  );
}
