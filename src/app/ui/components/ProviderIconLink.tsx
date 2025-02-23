import Image from 'next/image';
import {ProviderIconProps} from './ProviderIcon';
import { getProviderConfig } from '@/app/lib/config/oauth-providers';
import Link from 'next/link';


export function ProviderIconLink({ provider, width = 40, height = 40 }: ProviderIconProps) {
  const config = getProviderConfig(provider);
  return (
    <Link href={`/connect/chatgpt/${provider}`}>
      <Image 
        src={`/images/tools/${provider}.svg`}
        width={width}
        height={height}
        alt={config.name}
        className="provider-icon inline"
      />
    </Link>
  );
}
