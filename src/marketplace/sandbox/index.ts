import { registerProvider } from '../core/registry';
import { executeSandboxedCode } from './execute-code';

export const sandboxProvider = registerProvider({
  id: 'sandbox',
  name: 'Code Sandbox',
  description: 'Execute JavaScript code in a secure sandbox environment',
  
  requiresOAuth: false,
  
  bullets: [
    "Execute JavaScript code safely in a sandboxed environment",
    "Built-in console logging and output capture",
    "Timeout protection and security restrictions",
    "Perfect for data processing and algorithm testing"
  ],
  chat: [
    { role: 'user', content: "Can you help me calculate the factorial of 5?" },
    { role: 'agent', content: "I'll write and execute JavaScript code to calculate the factorial of 5 for you." }
  ],
  
  tools: [
    executeSandboxedCode
  ]
});
