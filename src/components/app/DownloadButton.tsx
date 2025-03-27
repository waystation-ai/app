"use client";
import Link from "next/link";
import { IconBrandAppleFilled, IconBrandWindowsFilled } from '@tabler/icons-react';
import { useTrackEvent } from '@/lib/utils/track-event';
import platform from 'platform-detect';
import { useState, useEffect } from "react";

export const fallbackVersion = "0.2.18";

export const getDownloadUrl = (version: string, isWindows: boolean) => {
  return isWindows 
    ? `https://github.com/waystation-ai/launcher/releases/download/app-v${version}/WayStation_${version}_x64-setup.exe`
    : `https://github.com/waystation-ai/launcher/releases/download/app-v${version}/WayStation_${version}_universal.dmg`;
};

interface DownloadButtonProps {
  className?: string;
  iconSize?: number;
}

export function DownloadButton({ className = "getstarted-btn", iconSize = 18 }: DownloadButtonProps) {
  const trackEvent = useTrackEvent();
  const [version, setVersion] = useState<string>(fallbackVersion);
  
  useEffect(() => {
    fetch("/api/launcher-version")
      .then(response => response.json())
      .then(data => {
        if (data.version) {
          setVersion(data.version);
        }
      })
      .catch(error => {
        console.error("Error fetching version:", error);
        // Fallback to hardcoded version already set
      });
  }, []);

  const downloadUrl = getDownloadUrl(version, platform.windows);
  const platformName = platform.windows ? "Windows" : "MacOS";

  return (
    <Link href={downloadUrl} onClick={() => trackEvent('download', {'platform': platformName.toLowerCase()})} className={`flex items-center justify-center gap-2 ${className}`}>
      {platform.windows? <IconBrandWindowsFilled size={iconSize} className="mb-0" /> : <IconBrandAppleFilled size={iconSize} className="mb-1" /> }
      <span>{`Download for ${platformName}`}</span>
    </Link>
  );
}
