import { z } from 'zod';
import { defineTool } from '../core/types';
import * as vm from 'node:vm';

interface SandboxResult {
  content: string;
  logs: string;
}

async function executeCodeInSandbox(code: string): Promise<SandboxResult> {
  const consoleLogs: string[] = [];
  let executionResult: unknown = undefined;

  // Create a secure sandbox with limited functionality
  const sandbox = {
    console: {
      log: (...args: unknown[]) => {
        const line = args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
        ).join(' ');
        consoleLogs.push(line);
      },
      error: (...args: unknown[]) => {
        const line = 'ERROR: ' + args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
        ).join(' ');
        consoleLogs.push(line);
      },
      warn: (...args: unknown[]) => {
        const line = 'WARN: ' + args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
        ).join(' ');
        consoleLogs.push(line);
      },
      info: (...args: unknown[]) => {
        const line = 'INFO: ' + args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
        ).join(' ');
        consoleLogs.push(line);
      }
    },
    
    // Allow basic JavaScript globals
    Math: Math,
    Date: Date,
    JSON: JSON,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    isFinite: isFinite,
    
    // Block dangerous APIs
    fetch: undefined,
    XMLHttpRequest: undefined,
    WebSocket: undefined,
    eval: undefined,
    Function: undefined,
    require: undefined,
    process: undefined,
    Buffer: undefined,
    global: undefined,
    setTimeout: undefined,
    setInterval: undefined,
    setImmediate: undefined
  };

  try {
    // Create a secure context
    const context = vm.createContext(sandbox);
    
    // Create and run the script with timeout
    const script = new vm.Script(code, { 
      filename: 'sandboxed-code.js'
    });
    
    executionResult = script.runInContext(context, {
      timeout: 30000, // 30 second timeout
      breakOnSigint: true
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    consoleLogs.push(`ERROR: ${errorMessage}`);
  }

  // Determine output content - separate console logs from return values
  let content: string;
  
  if (executionResult !== undefined && executionResult !== null) {
    // If script returned a value, use that as content
    content = typeof executionResult === 'string' 
      ? executionResult 
      : JSON.stringify(executionResult, null, 2);
  } else {
    // If no return value, provide clear messaging
    content = 'Code executed successfully (no return value)';
  }

  return {
    content,
    logs: consoleLogs.join('\n') // Console logs always go to logs field
  };
}

export const executeSandboxedCode = defineTool({
  id: 'executeSandboxedCode',
  summary: 'Execute JavaScript code in a secure sandbox environment',
  description: 'Runs JavaScript code safely with timeout protection and security restrictions. Perfect for data processing, calculations, and algorithm testing.',
  method: 'POST',
  path: '/tools/sandbox/execute_code',
  parameters: z.object({
    code: z.string().describe('JavaScript code to execute in the sandbox')
  }),
  responses: {
    '200': {
      description: 'Code executed successfully',
      schema: z.object({
        content: z.string().describe('The main output or result from the code execution'),
        logs: z.string().describe('Console logs captured during execution')
      })
    }
  },
  handler: async ({ params }) => {
    return await executeCodeInSandbox(params.code);
  }
});
