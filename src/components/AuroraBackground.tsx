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

  vec3 aurora(vec2 uv) {
    float v = 0.0;
    
    // Create multiple layers of waves with smoother movement
    for(float i = 0.0; i < 5.0; i++) {
      // Slower, more subtle movement
      vec2 offset = vec2(
        sin(time * 0.05 + i) * 0.15, 
        cos(time * 0.08 + i) * 0.15
      );
      
      // Smoother wave effect
      float wave = sin(uv.x * 1.5 + time * 0.3 + i) * 0.5 + 0.5;
      wave *= sin(uv.y * 1.5 + time * 0.2 + i) * 0.5 + 0.5;
      
      // Softer blend
      v += wave * (0.4 / (length(uv - offset) + 0.8));
    }
    
    // Enhanced color gradient with more natural transition
    vec3 col = mix(
      vec3(0.0, 0.35, 0.5),   // Deeper blue
      vec3(0.1, 0.5, 0.3),    // Richer green
      smoothstep(0.2, 0.8, v)  // Smoother transition
    );
    
    return col * v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 color = aurora(uv);
    
    // Softer glow
    color += aurora(uv * 1.05) * 0.3;
    color += aurora(uv * 1.1) * 0.2;
    
    gl_FragColor = vec4(color, 0.6);
  }
`;

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  useEffect((): (() => void) | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl');
    if (!gl) return undefined;

    let program: WebGLProgram | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;

    try {
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
      let startTime = Date.now();
      const animate = () => {
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
        opacity: 0.8,
      }}
    />
  );
}
