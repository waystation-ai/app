"use client";
import Link from "next/link";
import { IconBrandAppleFilled, IconBrandWindowsFilled } from '@tabler/icons-react';
import { useTrackEvent } from '@/lib/utils/track-event';
import platform from 'platform-detect';

export const downloadWin = "https://github.com/waystation-ai/launcher/releases/download/app-v0.2.16/WayStation_0.2.16_x64-setup.exe";
export const downloadMac = "https://github.com/waystation-ai/launcher/releases/download/app-v0.2.16/WayStation_0.2.16_universal.dmg";

interface DownloadButtonProps {
  className?: string;
  buttonText?: string
  iconSize?: number;
}

export function DownloadButton({ className = "getstarted-btn",  iconSize = 18 }: DownloadButtonProps) {
  const trackEvent = useTrackEvent();

  return (
    <Link href={platform.windows ? downloadWin : downloadMac} onClick={() => trackEvent('download', {'platform': "mac"})} className={`flex items-center justify-center gap-2 ${className}`}>
      {platform.windows? <IconBrandWindowsFilled size={iconSize} className="mb-1" /> : <IconBrandAppleFilled size={iconSize} className="mb-1" /> }
      <span>{platform.windows? 'Download for Windows' : 'Download for MacOS'}</span>
    </Link>
  );
}
