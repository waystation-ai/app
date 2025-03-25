"use client";
import Link from "next/link";
import { IconBrandAppleFilled } from '@tabler/icons-react';
import { useTrackEvent } from '@/lib/utils/track-event';

export const downloadUrl = "https://github.com/waystation-ai/launcher/releases/download/app-v0.2.15/WayStation_0.2.15_universal.dmg";

interface DownloadButtonProps {
  className?: string;
  buttonText?: string
  iconSize?: number;
}

export function DownloadButton({ className = "getstarted-btn",  iconSize = 18 }: DownloadButtonProps) {
  const trackEvent = useTrackEvent();

  return (
    <Link href={downloadUrl} onClick={() => trackEvent('download', {'platform': "mac"})} className={`flex items-center justify-center gap-2 ${className}`}>
      <IconBrandAppleFilled size={iconSize} className="mb-1" /> 
      <span>Download for MacOS</span>
    </Link>
  );
}
