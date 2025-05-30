'use client';

import clsx from 'clsx';
import { useState } from 'react';

function CopyIcon() {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

interface CopyBoxProps {
  text?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function CopyBox({ text, className, icon }: CopyBoxProps) {
  const [copied, setCopied] = useState(false);


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={"relative shadow-[0px_2px_16px_0px_rgba(0,0,0,0.08)]" + (className ? ` ${className}` : ' text-sm')}>
      <pre className={clsx("font-mono bg-gray-50 pr-20 rounded-lg border border-gray-200 break-all", {
        "p-4": !icon,
        "p-3 pl-3 flex items-start gap-3": icon
      })}>
        {icon && (
          <span className="flex-shrink-0 mt-0.5 text-gray-600">
            {icon}
          </span>
        )}
        <code className={icon ? "flex-1" : ""}>{text}</code>
      </pre>
      <button
        type="button"
        className={clsx("absolute top-1/2 -translate-y-1/2 right-2 p-2 rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400", {
          "text-green-600": copied,
          "text-gray-500": !copied,
        })}
        onClick={copyToClipboard}
        aria-label="Copy to clipboard"
      >
        <CopyIcon />
      </button>
    </div>
  );
}
