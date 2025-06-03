import Link from "next/link";
import Image from "next/image";
import { ProcessedTextSegment } from "@/lib/utils/appLinkProcessor";

interface RichTextProps {
  segments: ProcessedTextSegment[];
  className?: string;
}

export default function RichText({ segments, className = "" }: RichTextProps) {
  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'app-link' && segment.appLink) {
          return (
            <Link key={index} href={`/connect/${segment.appLink.provider}`} className="font-bold">
              <span className="whitespace-nowrap items-center">
                <Image
                  src={segment.appLink.icon}
                  alt={segment.appLink.displayName}
                  width={16}
                  height={16}
                  className="inline-flex"
                />
                <span className="ml-1">{segment.appLink.displayName}</span>
              </span>
            </Link>
          );
        }
        
        return (
          <span key={index}>{segment.content}</span>
        );
      })}
    </span>
  );
}
