'use client';

import { useEffect, useRef } from 'react';

/**
 * Real-time WebGL car paint: dark metallic lacquer under studio softbox
 * reflections, with water beads on top.
 *
 * `progress.current` (0..1) drives the detailing story:
 *   0.00–0.34  dirt washes off
 *   0.36–0.64  swirl marks polish out, reflections sharpen
 *   0.68–0.96  coating: water beads form and slide
 * Without `progress` the surface is shown fully coated.
 */

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uClean;
uniform float uScale;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

// Static water beads. xy = lens normal, z = mask.
vec3 beads(vec2 p, float scale, float density, float seed){
  vec2 q = p*scale;
  vec2 id = floor(q);
  vec2 f = fract(q) - 0.5;
  if(density < 0.01 || hash(id + seed) > density) return vec3(0.0);
  float rad = mix(0.13, 0.31, hash(id + seed + 3.7));
  vec2 c = (vec2(hash(id + seed + 1.3), hash(id + seed + 5.1)) - 0.5) * 2.0 * (0.46 - rad);
  vec2 d = f - c;
  d.y *= 1.1;
  float l = length(d) / rad;
  float m = smoothstep(1.0, 0.8, l);
  return vec3(d / rad * m, m);
}

// Drops that slide down, leaving a wet trail.
vec3 sliders(vec2 p, float scale, float t, float seed){
  vec2 q = p * vec2(scale, scale * 0.25);
  float col = floor(q.x);
  float sp = mix(0.06, 0.2, hash(vec2(col, seed)));
  q.y += t * sp + hash(vec2(col, seed + 2.0)) * 10.0;
  vec2 id = floor(q);
  vec2 f = fract(q) - 0.5;
  if(hash(id + seed) > 0.4) return vec3(0.0);
  f.x -= (hash(id + seed + 4.0) - 0.5) * 0.35;
  vec2 d = vec2(f.x, (f.y + 0.25) * 4.0);
  float rad = 0.2;
  float l = length(d) / rad;
  float m = smoothstep(1.0, 0.8, l);
  float trail = smoothstep(0.07, 0.0, abs(f.x)) * smoothstep(0.5, -0.1, f.y) * step(-0.2, f.y);
  return vec3(d / rad * m, max(m, trail * 0.45));
}

vec3 env(vec2 r, float w, vec2 m){
  float ry = r.y + 0.16*r.x*r.x - m.y*0.18;
  float rx = r.x - m.x*0.35;
  float s1 = 0.06;
  float b1 = exp(-pow((ry - 0.2)/(s1 + w), 2.0)) * (s1/(s1 + w)*0.85 + 0.15);
  b1 *= smoothstep(1.3 + w, 0.4 - w, abs(rx));
  float s2 = 0.012;
  float b2 = exp(-pow((ry + 0.3)/(s2 + w), 2.0)) * (s2/(s2 + w)) * 0.5;
  b2 *= smoothstep(1.1, 0.2, abs(rx + 0.25));
  float s3 = 0.035;
  float b3 = exp(-pow((rx - 0.78)/(s3 + w), 2.0)) * (s3/(s3 + w)) * 0.4;
  b3 *= smoothstep(0.55, 0.0, abs(ry));
  vec3 sky = mix(vec3(0.012, 0.018, 0.032), vec3(0.06, 0.085, 0.125), smoothstep(-0.7, 0.7, ry));
  return sky + vec3(0.93, 0.96, 1.0) * (b1*1.2 + b2 + b3);
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  float t = uTime;
  vec2 m = uMouse - 0.5;

  float wash   = smoothstep(0.0, 0.34, uClean);
  float polish = smoothstep(0.36, 0.64, uClean);
  float coat   = smoothstep(0.68, 0.96, uClean);
  float gloss  = mix(0.2, 0.78, polish) + 0.22*coat;
  float w      = mix(0.24, 0.01, gloss);

  // water
  vec3 b1 = beads(p, 6.0, 0.5*coat, 0.0);
  vec3 b2 = beads(p + vec2(0.37, 0.11), 13.0, 0.65*coat, 11.0);
  vec3 b3 = beads(p + vec2(0.13, 0.51), 28.0, 0.75*coat, 23.0);
  vec3 s1 = coat > 0.01 ? sliders(p, 4.0, t, 31.0) * coat : vec3(0.0);
  vec2 dn = b1.xy + b2.xy + b3.xy + s1.xy;
  float dm = clamp(b1.z + b2.z + b3.z + s1.z, 0.0, 1.0);

  // reflections (orange peel + lens refraction through drops)
  vec2 peel = vec2(noise(p*36.0), noise(p*36.0 + 7.0)) - 0.5;
  vec2 r = p + peel*0.005 - dn*0.22;
  vec3 refl = env(r, mix(w, w*0.5 + 0.015, dm), m);
  float hl = max(0.0, dot(refl, vec3(0.333)) - 0.05);

  // lacquer + metallic flake
  vec3 base = vec3(0.02, 0.036, 0.07) * (0.85 + 0.3*fbm(p*1.6));
  vec2 fc = floor(gl_FragCoord.xy / (1.5*uScale));
  float tw = step(0.78, fract(hash(fc + 1.7) + m.x*1.7 + m.y*1.1 + t*0.02));
  float flake = step(0.88, hash(fc)) * tw;
  vec3 col = base + refl * mix(0.3, 1.0, gloss);
  col += vec3(0.45, 0.65, 1.0) * flake * (0.025 + 0.6*hl) * (1.0 - dm);

  // swirl marks (polished away)
  vec2 hc = vec2(m.x*0.35, 0.2 + m.y*0.18);
  vec2 q = p - hc;
  float rr = length(q);
  float a = atan(q.y, q.x);
  float ring = floor(rr*50.0);
  float sc = smoothstep(0.7, 0.92, noise(vec2(rr*240.0 + noise(q*9.0)*6.0, a*2.2 + hash(vec2(ring, 3.0))*6.0)));
  float swirl = (1.0 - polish) * sc * exp(-rr*rr*4.0);
  col += vec3(0.8, 0.86, 0.95) * swirl * (0.04 + 0.4*hl);

  // drop shading: dark rim, specular, caustic
  float rim = clamp(dot(dn, dn), 0.0, 1.0);
  col *= 1.0 - 0.5*rim*dm;
  vec3 N = normalize(vec3(dn*1.4, 1.0));
  vec3 L = normalize(vec3(-0.3 + m.x*1.2, 0.75 + m.y, 1.0));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(N, H), 0.0), 160.0) * dm;
  col += vec3(1.0) * spec * 1.6;
  col += vec3(0.5, 0.7, 1.0) * smoothstep(0.2, 0.9, -dn.y) * dm * 0.06;

  // dirt layer, washed away
  float n1 = fbm(p*2.6 + 3.1);
  float streak = fbm(vec2(p.x*13.0, p.y*1.1 + 2.0));
  float speck = step(0.82, noise(p*85.0));
  float dirtField = 0.6*n1 + 0.4*streak;
  float th = mix(-0.1, 0.95, wash);
  float dirt = smoothstep(th, th + 0.12, dirtField) * (0.86 + 0.14*speck);
  vec3 dirtCol = mix(vec3(0.24, 0.22, 0.2), vec3(0.47, 0.43, 0.38), n1) * (0.85 + 0.3*streak);
  dirtCol += refl * 0.06;
  float wet = smoothstep(th - 0.06, th, dirtField) * (1.0 - smoothstep(th, th + 0.02, dirtField)) * (1.0 - wash);
  col = mix(col, dirtCol, dirt * 0.94);
  col += vec3(0.6, 0.75, 0.9) * wet * 0.25;

  // vignette, dither
  col *= mix(0.6, 1.0, smoothstep(1.35, 0.25, length(p*vec2(0.75, 1.05))));
  col = clamp(col, 0.0, 1.0);
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  progress?: { current: number };
  className?: string;
};

export default function PaintCanvas({ progress, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return; // CSS background stays as fallback

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, 'uRes'),
      time: gl.getUniformLocation(prog, 'uTime'),
      mouse: gl.getUniformLocation(prog, 'uMouse'),
      clean: gl.getUniformLocation(prog, 'uClean'),
      scale: gl.getUniformLocation(prog, 'uScale'),
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.6);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const target = { x: 0.5, y: 0.55 };
    const mouse = { x: 0.5, y: 0.55 };
    let pointerActive = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointerActive = true;
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = reduce ? 4 : (now - start) / 1000;
      if (!pointerActive && !reduce) {
        // gentle automatic light drift on touch devices / before mouse moves
        target.x = 0.5 + Math.sin(t * 0.35) * 0.18;
        target.y = 0.55 + Math.cos(t * 0.27) * 0.08;
      }
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.clean, progress ? progress.current : 1);
      gl.uniform1f(u.scale, dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [progress]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
