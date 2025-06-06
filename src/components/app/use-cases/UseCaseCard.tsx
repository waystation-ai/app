import Link from 'next/link';
import { UseCase } from './utils';
import RichText from './RichText';
import { processUseCaseAppLinks, ProcessedTextSegment } from '@/lib/utils/appLinkProcessor';

interface UseCaseCardProps {
  useCase: UseCase;
}

export default function UseCaseCard({ useCase }: UseCaseCardProps) {
  // Process the useCase to handle app links
  const processedUseCase = processUseCaseAppLinks(useCase);
  
  // Create a truncated version of the summary
  let summaryText = '';
  const truncatedSegments: ProcessedTextSegment[] = [];
  
  // Calculate total length and create truncated segments
  for (const segment of processedUseCase.summary) {
    // For app links, we just count the display name length
    const segmentLength = segment.type === 'app-link' && segment.appLink 
      ? segment.appLink.displayName.length 
      : segment.content.length;
      
    // Check if adding this segment would exceed our limit
    if (summaryText.length + segmentLength > 150) {
      // If it's a text segment, we can truncate it
      if (segment.type === 'text') {
        const remainingLength = 150 - summaryText.length;
        if (remainingLength > 0) {
          // Add a truncated version of this segment
          truncatedSegments.push({
            type: 'text' as const,
            content: segment.content.substring(0, remainingLength) + '...'
          });
        }
      }
      break;
    }
    
    // Add the full segment
    truncatedSegments.push(segment);
    summaryText += segment.type === 'app-link' && segment.appLink 
      ? segment.appLink.displayName 
      : segment.content;
  }
  
  // If we didn't need to truncate, use the full segments
  const summarySegments = useCase.summary.length > 150 
    ? truncatedSegments 
    : processedUseCase.summary;

  return (
    <Link href={`/ai/${useCase.id}`} className="group block">
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-aurora-blue hover:scale-105">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {useCase.title}
        </h3>
        
        {/* Summary */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
          <RichText segments={summarySegments} />
        </p>
        
        {/* Key Benefit */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-start">
            <span className="text-aurora-green mr-2 mt-1 text-sm">•</span>
            <span className="text-sm text-gray-700 leading-relaxed">
              <RichText segments={processedUseCase.bullet_points[0]} />
            </span>
          </div>
        </div>
        
        {/* Read More Indicator */}
        <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:text-blue-800 transition-colors">
          <span>Learn more</span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
