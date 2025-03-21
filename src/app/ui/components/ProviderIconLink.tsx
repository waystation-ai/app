import Image from 'next/image';
import {ProviderIconProps} from './ProviderIcon';
import { getProviderConfig } from '@/app/lib/services/provider-config';
import Link from 'next/link';

export interface ProviderIconLinkProps extends ProviderIconProps {
  app?: string;
}

export function ProviderIconLink({ provider, app = undefined, width = 40, height = 40 }: ProviderIconLinkProps) {
  const config = getProviderConfig(provider);
  return (
    <Link href={app ? `/connect/${app}/${provider}` : `/connect/${provider}`}>
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
