"use client"
import { useEffect, useRef } from 'react';

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform float time;
  uniform vec2 resolution;

  vec3 aurora_color(vec2 pos) {
    vec3 blue = vec3(0.0, 0.4, 1.0);
    vec3 green = vec3(0.0, 1.0, 0.4);
    
    float t = sin(pos.x * 2.0 + time * 0.1) * 0.5 + 0.5;
    return mix(blue, green, t);  // Full intensity colors
  }

  float aurora_shape(vec2 pos) {
    float v = 0.0;
    
    // Create multiple layers of waves
    for(float i = 0.0; i < 5.0; i++) {
      vec2 offset = vec2(
        sin(time * 0.05 + i) * 0.15, 
        cos(time * 0.08 + i) * 0.15
      );
      
      float wave = sin(pos.x * 1.5 + time * 0.3 + i) * 0.5 + 0.5;
      wave *= sin(pos.y * 1.5 + time * 0.2 + i) * 0.5 + 0.5;
      
      v += wave * (0.3 / (length(pos - offset) + 0.8));
    }
    
    // Calculate alpha for more subtle effect
    float baseAlpha = 0.05;  // Reduced minimum visibility
    float smoothValue = smoothstep(0.1, 0.4, v);
    return min(baseAlpha + (smoothValue * 0.3), 0.5);  // Cap at 50% opacity
  }

  void main() {
    // Normalize coordinates
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    vec2 pos = (2.0 * uv - 1.0);
    pos.x *= resolution.x/resolution.y;
    
    // Calculate aurora effect with smoother blending
    vec3 auroraCol = aurora_color(pos);
    float alpha = aurora_shape(pos);
    
    // Apply gamma correction only to color, not alpha
    vec3 finalColor = pow(auroraCol, vec3(1.0/2.2));
    
    // Use smooth alpha channel
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  useEffect((): (() => void) | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl');
    if (!gl) return undefined;

    let program: WebGLProgram | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;

    try {
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  // Standard alpha blending for proper transparency

      // Create and compile vertex shader
      vs = gl.createShader(gl.VERTEX_SHADER);
      if (!vs) throw new Error('Failed to create vertex shader');
      gl.shaderSource(vs, vertexShader);
      gl.compileShader(vs);
      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        throw new Error(`Vertex shader compile error: ${gl.getShaderInfoLog(vs)}`);
      }

      // Create and compile fragment shader
      fs = gl.createShader(gl.FRAGMENT_SHADER);
      if (!fs) throw new Error('Failed to create fragment shader');
      gl.shaderSource(fs, fragmentShader);
      gl.compileShader(fs);
      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        throw new Error(`Fragment shader compile error: ${gl.getShaderInfoLog(fs)}`);
      }

      // Create and link shader program
      program = gl.createProgram();
      if (!program) throw new Error('Failed to create shader program');
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
      }
      gl.useProgram(program);

      // Create vertex buffer
      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      // Set up attributes and uniforms
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const timeLocation = gl.getUniformLocation(program, 'time');
      const resolutionLocation = gl.getUniformLocation(program, 'resolution');

      // Animation loop
      const startTime = Date.now();
      const animate = () => {
        gl.clear(gl.COLOR_BUFFER_BIT);  // Clear to white before drawing
        const time = (Date.now() - startTime) * 0.001;
        gl.uniform1f(timeLocation, time);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Handle resize
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      animate();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener('resize', handleResize);
        
        // Cleanup WebGL resources
        if (program) gl.deleteProgram(program);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
      };
    } catch (error) {
      console.error('WebGL error:', error);
      // Cleanup on error
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return undefined;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
}
