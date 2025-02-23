import Image from 'next/image';
import {ProviderIconProps} from './ProviderIcon';
import { getProviderConfig } from '@/app/lib/config/oauth-providers';
import Link from 'next/link';

export interface ProviderIconLinkProps extends ProviderIconProps {
  app?: string;
}

export function ProviderIconLink({ provider, app = "chatgpt", width = 40, height = 40 }: ProviderIconLinkProps) {
  const config = getProviderConfig(provider);
  return (
    <Link href={`/connect/${app}/${provider}`}>
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
