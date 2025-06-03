export interface AppLink {
  provider: string;
  displayName: string;
  icon: string;
}

export interface ProcessedTextSegment {
  type: 'text' | 'app-link';
  content: string;
  appLink?: AppLink;
}



/**
 * Processes text containing app link markup [app:provider](Display Name)
 * Returns an array of text segments and app links for rendering
 */
export function processAppLinks(text: string): ProcessedTextSegment[] {
  const segments: ProcessedTextSegment[] = [];
  const appLinkRegex = /\[app:([^\]]+)\]\(([^)]+)\)/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = appLinkRegex.exec(text)) !== null) {
    // Add text before the app link
    if (match.index > lastIndex) {
      const textContent = text.slice(lastIndex, match.index);
      if (textContent) {
        segments.push({
          type: 'text',
          content: textContent
        });
      }
    }
    
    // Add the app link
    const provider = match[1];
    const displayName = match[2];
    // Generate icon path dynamically from provider name
    
    segments.push({
      type: 'app-link',
      content: match[0], // Original markup for fallback
      appLink: {
        provider,
        displayName,
        icon: `/images/tools/${provider}.svg`
      }
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      segments.push({
        type: 'text',
        content: remainingText
      });
    }
  }
  
  return segments;
}

export interface ProcessedUseCase {
  id: string;
  title: string;
  summary: ProcessedTextSegment[];
  call_to_action: ProcessedTextSegment[];
  bullet_points: ProcessedTextSegment[][];
  integration_recipe: ProcessedTextSegment[];
}

/**
 * Processes a use case object to convert app link markup in summary and integration_recipe fields only
 */
export function processUseCaseAppLinks(useCase: { id: string; title: string; summary: string; call_to_action: string; bullet_points: string[]; integration_recipe: string }): ProcessedUseCase {
  return {
    ...useCase,
    summary: processAppLinks(useCase.summary),
    call_to_action: [{ type: 'text', content: useCase.call_to_action }],
    bullet_points: useCase.bullet_points.map((point: string) => [{ type: 'text', content: point }]),
    integration_recipe: processAppLinks(useCase.integration_recipe)
  };
}
