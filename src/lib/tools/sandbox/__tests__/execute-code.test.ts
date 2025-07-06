import { executeSandboxedCodeTool } from '../execute-code';

describe('Sandboxed Code Execution', () => {
  describe('Basic Functionality', () => {
    test('should execute simple JavaScript code', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return 2 + 2;'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('4');
      expect(result.logs).toBe('');
    });

    test('should handle console.log output', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'console.log("Hello, World!");'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('Code executed successfully (no return value).');
      expect(result.logs).toBe('Hello, World!');
    });

    test('should handle multiple console outputs', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          console.log("First message");
          console.warn("Warning message");
          console.error("Error message");
          console.info("Info message");
        `
      });

      expect(result.logs).toContain('First message');
      expect(result.logs).toContain('WARN: Warning message');
      expect(result.logs).toContain('ERROR: Error message');
      expect(result.logs).toContain('INFO: Info message');
    });

    test('should handle non-string console outputs', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          console.log({ a: 1 });
          console.error({ b: 2 });
          console.warn({ c: 3 });
          console.info({ d: 4 });
        `
      });

      expect(result.logs).toContain('{\n  "a": 1\n}');
      expect(result.logs).toContain('ERROR: {\n  "b": 2\n}');
      expect(result.logs).toContain('WARN: {\n  "c": 3\n}');
      expect(result.logs).toContain('INFO: {\n  "d": 4\n}');
    });

    test('should return values correctly', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return { message: "Hello", number: 42 };'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('{\n  "message": "Hello",\n  "number": 42\n}');
    });

    test('should handle string return values', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return "Hello World";'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('"Hello World"');
    });
  });

  describe('Security Tests - Network Blocking', () => {
    test('should block fetch calls', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            fetch('https://example.com');
            return 'SECURITY BREACH: fetch succeeded';
          } catch (error) {
            return 'fetch blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('fetch is not defined');
      expect(result.result).not.toContain('SECURITY BREACH');
    });

    test('should block XMLHttpRequest', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            new XMLHttpRequest();
            return 'SECURITY BREACH: XMLHttpRequest succeeded';
          } catch (error) {
            return 'XMLHttpRequest blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('XMLHttpRequest is not defined');
      expect(result.result).not.toContain('SECURITY BREACH');
    });

    test('should block WebSocket', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            new WebSocket('ws://example.com');
            return 'SECURITY BREACH: WebSocket succeeded';
          } catch (error) {
            return 'WebSocket blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('WebSocket is not defined');
      expect(result.result).not.toContain('SECURITY BREACH');
    });
  });

  describe('Security Tests - Code Injection Prevention', () => {
    test('should block eval usage', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            eval('2 + 2');
            return 'SECURITY BREACH: eval succeeded';
          } catch (error) {
            return 'eval blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected in the code.');
    });

    test('should block Function constructor', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            new Function('return 2 + 2')();
            return 'SECURITY BREACH: Function constructor succeeded';
          } catch (error) {
            return 'Function constructor blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected in the code.');
    });

    test('should block require statements', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            require('fs');
            return 'SECURITY BREACH: require succeeded';
          } catch (error) {
            return 'require blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Code validation failed: A disallowed pattern was detected in the code.');
    });
  });

  describe('Security Tests - System Access Prevention', () => {
    test('should block process access', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            process.exit(0);
            return 'SECURITY BREACH: process access succeeded';
          } catch (error) {
            return 'process blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Code validation failed: A disallowed pattern was detected in the code.');
    });

    test('should block Buffer access', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            Buffer.from('test');
            return 'SECURITY BREACH: Buffer access succeeded';
          } catch (error) {
            return 'Buffer blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Code validation failed: A disallowed pattern was detected in the code.');
    });

    test('should block global access', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            global.maliciousCode = true;
            return 'SECURITY BREACH: global access succeeded';
          } catch (error) {
            return 'global blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected');
    });

    test('should block setTimeout', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            setTimeout(() => {}, 1000);
            return 'SECURITY BREACH: setTimeout succeeded';
          } catch (error) {
            return 'setTimeout blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('setTimeout is not defined');
      expect(result.result).not.toContain('SECURITY BREACH');
    });

    test('should block setInterval', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            setInterval(() => {}, 1000);
            return 'SECURITY BREACH: setInterval succeeded';
          } catch (error) {
            return 'setInterval blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('setInterval is not defined');
      expect(result.result).not.toContain('SECURITY BREACH');
    });

    test('should block setImmediate', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            setImmediate(() => {});
            return 'SECURITY BREACH: setImmediate succeeded';
          } catch (error) {
            return 'setImmediate blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('setImmediate is not defined');
      expect(result.result).not.toContain('SECURITY BREACH');
    });
  });

  describe('Security Tests - Allowed Globals', () => {
    test('should allow Math operations', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return Math.max(1, 2, 3);'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('3');
    });

    test('should allow Date operations', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return new Date(2023, 0, 1).getFullYear();'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('2023');
    });

    test('should allow JSON operations', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return JSON.stringify({ test: "value" });'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('"{\\"test\\":\\"value\\"}"');
    });

    test('should allow parseInt and parseFloat', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return parseInt("42") + parseFloat("3.14");'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('45.14');
    });

    test('should allow isNaN and isFinite', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return { nan: isNaN("abc"), finite: isFinite(42) };'
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('"nan": true');
      expect(result.result).toContain('"finite": true');
    });
  });

  describe('Error Handling', () => {
    test('should handle syntax errors', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return 2 + + + ;' // Actually invalid syntax
      });

      expect(result.success).toBe(false);
      expect(result.logs).toContain('ERROR:');
      expect(result.error).toContain('Code validation failed');
    });

    test('should handle runtime errors', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'throw new Error("Test error");'
      });

      expect(result.success).toBe(false);
      expect(result.logs).toContain('ERROR: Error: Test error');
      expect(result.error).toBe('Error: Test error');
    });

    test('should handle reference errors', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return undefinedVariable;'
      });

      expect(result.success).toBe(false);
      expect(result.logs).toContain('ERROR: ReferenceError: undefinedVariable is not defined');
      expect(result.error).toBe('ReferenceError: undefinedVariable is not defined');
    });
  });

  describe('Timeout Protection', () => {
    test('should enforce timeout for infinite loops', async () => {
      const startTime = Date.now();
      
      const result = await executeSandboxedCodeTool.handler({
        code: 'while(true) { /* infinite loop */ }'
      });

      const executionTime = Date.now() - startTime;
      
      expect(result.success).toBe(false);
      expect(result.logs).toContain('ERROR: Error: Script execution timed out after 30000ms');
      expect(result.error).toContain('Script execution timed out after 30000ms');
      expect(executionTime).toBeLessThan(35000); // Should timeout before 35 seconds
    }, 40000); // Test timeout of 40 seconds

    test('should allow code that runs within timeout', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          let sum = 0;
          for(let i = 0; i < 1000000; i++) {
            sum += i;
          }
          return sum;
        `
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('499999500000');
      expect(result.logs).toBe('');
    });
  });

  describe('Complex Data Structures', () => {
    test('should handle arrays', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return [1, 2, 3].map(x => x * 2);'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('[\n  2,\n  4,\n  6\n]');
    });

    test('should handle nested objects', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          return {
            user: {
              name: "John",
              age: 30,
              hobbies: ["reading", "coding"]
            }
          };
        `
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('"name": "John"');
      expect(result.result).toContain('"age": 30');
      expect(result.result).toContain('"hobbies"');
    });

    test('should handle functions (but not execute them outside sandbox)', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          function add(a, b) {
            return a + b;
          }
          return add(5, 3);
        `
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('8');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty code', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: ''
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('Code executed successfully (no return value).');
      expect(result.logs).toBe('');
    });

    test('should handle code with only comments', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: '// This is just a comment'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('Code executed successfully (no return value).');
      expect(result.logs).toBe('');
    });

    test('should handle null and undefined returns', async () => {
      const result1 = await executeSandboxedCodeTool.handler({
        code: 'return null;'
      });

      const result2 = await executeSandboxedCodeTool.handler({
        code: 'return undefined;'
      });

      expect(result1.success).toBe(true);
      expect(result1.result).toBe('null');
      expect(result2.success).toBe(true);
      expect(result2.result).toBe('Code executed successfully (no return value).');
    });

    test('should handle very long strings', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'return "a".repeat(1000);'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe(`"${'a'.repeat(1000)}"`);
    });
  });

  describe('Advanced Security Tests', () => {
    test('should prevent prototype pollution attempts', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            Object.prototype.polluted = true;
            return 'SECURITY BREACH: prototype pollution succeeded';
          } catch (error) {
            return 'prototype pollution blocked: ' + error.message;
          }
        `
      });

      // Even if it doesn't throw an error, the pollution shouldn't escape the sandbox
      expect(result.success).toBe(false);
      expect(result.error).toContain('Code validation failed: A disallowed pattern was detected in the code.');
    });

    test('should prevent constructor access attempts', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            ({}).constructor.constructor('return process')();
            return 'SECURITY BREACH: constructor access succeeded';
          } catch (error) {
            return 'constructor access blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected');
    });

    test('should prevent this context manipulation', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: `
          try {
            (function() { return this; }).call(global);
            return 'SECURITY BREACH: this context manipulation succeeded';
          } catch (error) {
            return 'this context blocked: ' + error.message;
          }
        `
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected');
    });
  });

  describe('Security Tests - Object Method Restrictions', () => {
    test('should block Object.create', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'Object.create(null);'
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected in the code.');
    });

    test('should block Object.defineProperty', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'Object.defineProperty({}, "prop", { value: 1 });'
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected in the code.');
    });

    test('should block Object.getPrototypeOf', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'Object.getPrototypeOf({});'
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected in the code.');
    });

    test('should block Object.setPrototypeOf', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'Object.setPrototypeOf({}, null);'
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected in the code.');
    });
  });

  describe('Security Tests - AST Node Blocking', () => {
    test('should block ImportExpression', async () => {
      const result = await executeSandboxedCodeTool.handler({
        code: 'import("fs")'
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('A disallowed pattern was detected in the code.');
    });
  });
});
