'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS mesh gradient.');
      setFallback(true);
      return;
    }

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float sinWave(vec2 p, float speed, float freq) {
        return sin(p.x * freq + u_time * speed) * cos(p.y * freq + u_time * speed * 0.8);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; ++i) {
          v += a * sinWave(p, 0.12, 1.8);
          p = rot * p * 2.1 + shift;
          a *= 0.55;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = (uv - 0.5) * 2.0;
        p.x *= aspect;

        float n = fbm(p * 0.7 + vec2(u_time * 0.04, u_time * 0.01));
        float n2 = fbm(p * 1.3 - vec2(u_time * 0.02, -u_time * 0.03) + n);

        vec3 colorBg = vec3(0.02, 0.027, 0.043); // #05070B
        vec3 colorGold = vec3(0.79, 0.65, 0.35); // #c9a55a
        vec3 colorBlue = vec3(0.08, 0.25, 0.6);   // #144099

        float w1 = smoothstep(-0.4, 0.4, n2);
        float w2 = smoothstep(-0.3, 0.6, n);

        vec3 color = colorBg;
        color += colorGold * w1 * 0.06;
        color += colorBlue * w2 * 0.08;

        float dist = length(p);
        color += colorGold * (1.0 - smoothstep(0.0, 1.6, dist)) * 0.03;

        float vignette = 1.0 - smoothstep(0.4, 1.7, dist);
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) {
      setFallback(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setFallback(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      setFallback(true);
      return;
    }

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    if (!buffer) {
      setFallback(true);
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId = 0;
    const startTime = performance.now();

    const render = () => {
      const currentTime = (performance.now() - startTime) / 1000;
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, currentTime);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  if (fallback) {
    return (
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-[#05070B]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(201, 165, 90, 0.05) 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(20, 64, 153, 0.07) 0%, transparent 65%)
          `
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-[#05070B]"
    />
  );
}
