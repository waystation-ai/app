import { z } from 'zod';
import { createContext, Script } from 'node:vm';
import * as acorn from 'acorn';
import { simple } from 'acorn-walk';
import { Node as AcornNode } from 'acorn';

interface SandboxResult {
  success: boolean;
  result: string | null;
  error?: string;
  logs: string;
}

// Helper function to create console log handlers
const createLogHandler = (logs: string[], prefix = '') => {
  return (...args: unknown[]) => {
    const message = args
      .map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)))
      .join(' ');
    logs.push(prefix ? `${prefix} ${message}` : message);
  };
};

// AST validation function
function validateCode(code: string) {
  if (!code.trim() || code.trim().startsWith('//')) {
    return;
  }
  try {
    // Wrap code in an async function expression to allow top-level return and await.
    const wrappedCode = `(async function() { ${code} })`;
    const ast = acorn.parse(wrappedCode, { ecmaVersion: 2024, sourceType: 'module' });

    let isInvalid = false;
    const forbiddenNodes = new Set(['ImportExpression']);
    const forbiddenIdentifiers = new Set(['require', 'process', 'global', 'globalThis', 'Buffer']);
    const forbiddenProperties = new Set(['__proto__', 'constructor', 'prototype']);

    simple(ast, {
      ImportExpression: (node: AcornNode) => { if (forbiddenNodes.has(node.type)) isInvalid = true; },
      // Disallow access to forbidden global identifiers
      Identifier(node: acorn.Identifier) {
        if (forbiddenIdentifiers.has(node.name)) {
          isInvalid = true;
        }
      },
      // Disallow access to forbidden properties
      MemberExpression(node: acorn.MemberExpression) {
        if (node.property && 'name' in node.property && forbiddenProperties.has(node.property.name)) {
          isInvalid = true;
        }
        if (node.object && 'name' in node.object && node.object.name === 'Object' && node.property && 'name' in node.property) {
          if (['create', 'defineProperty', 'getPrototypeOf', 'setPrototypeOf'].includes(node.property.name)) {
            isInvalid = true;
          }
        }
      },
      CallExpression(node: acorn.CallExpression) {
        if (node.callee && 'name' in node.callee && (node.callee.name === 'eval' || node.callee.name === 'Function')) {
          isInvalid = true;
        }
      },
      NewExpression(node: acorn.NewExpression) {
        if (node.callee && 'name' in node.callee && node.callee.name === 'Function') {
          isInvalid = true;
        }
      }
    });

    if (isInvalid) {
      throw new Error('A disallowed pattern was detected in the code.');
    }
  } catch (error) {
    // Re-throw parsing errors as a security failure
    throw new Error('Code validation failed: ' + (error instanceof Error ? error.message : String(error)));
  }
}


// Static sandbox configuration
const sandboxConfig = Object.freeze({
  // Safe-listed Math and JSON
  Math: Object.create(null, Object.getOwnPropertyDescriptors(Math)),
  JSON: Object.create(null, Object.getOwnPropertyDescriptors(JSON)),
  
  // Safe-listed functions
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  
  // A safer Date constructor
  Date: class SafeDate extends Date {
    constructor(...args: ConstructorParameters<typeof Date>) {
      super(...args);
      Object.defineProperty(this, 'constructor', { value: undefined });
    }
  },

  // Block dangerous APIs
  eval: undefined,
  Function: undefined,
  require: undefined,
  process: undefined,
  Buffer: undefined,

  // Explicitly deny everything else by not including it.
  // The context will be created with only the properties defined above.
});


async function executeCodeInSandbox(code: string): Promise<SandboxResult> {
  const consoleLogs: string[] = [];
  
  try {
    // 1. Validate code using AST before execution
    validateCode(code);

    // 2. Create a secure sandbox with limited functionality
    const sandbox = {
      ...sandboxConfig,
      console: {
        log: createLogHandler(consoleLogs),
        error: createLogHandler(consoleLogs, 'ERROR:'),
        warn: createLogHandler(consoleLogs, 'WARN:'),
        info: createLogHandler(consoleLogs, 'INFO:'),
      },
    };
    
    const context = createContext(sandbox);

    // 3. Wrap code for execution
    const wrappedCode = `
      'use strict';
      (function() {
        return (function() {
          ${code}
        }).call(null);
      })()
    `;

    const script = new Script(wrappedCode, {
      filename: 'sandboxed-code.js',
    });

    const executionResult = script.runInContext(context, {
      timeout: 30000, // 30 second timeout
      breakOnSigint: true,
    });

    // Format the successful result
    const content =
      executionResult === undefined
        ? 'Code executed successfully (no return value).'
        : JSON.stringify(executionResult, null, 2);

    return {
      success: true,
      result: content,
      logs: consoleLogs.join('\n'),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    consoleLogs.push(`ERROR: ${errorMessage}`);

    return {
      success: false,
      result: null,
      error: errorMessage,
      logs: consoleLogs.join('\n'),
    };
  }
}

// Built-in tool definition for direct use in chat API
export const executeSandboxedCodeTool = {
  id: 'executeSandboxedCode',
  summary: 'Execute JavaScript code in a secure sandbox environment',
  description: 'Runs JavaScript code safely with timeout protection and security restrictions. Perfect for data processing, calculations, and algorithm testing. For the execution to return a value, the code must use a `return` statement at the top level.',
  parameters: z.object({
    code: z.string().describe('JavaScript code to execute in the sandbox. For example, to compute a factorial: `const factorial = n => n <= 1 ? 1 : n * factorial(n - 1); return factorial(7);`'),
  }),
  handler: async (params: { code: string }) => {
    return await executeCodeInSandbox(params.code);
  },
};
