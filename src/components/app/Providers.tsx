import { ProviderIconLink } from './ProviderIconLink';
import { registry } from '@/marketplace/main';

interface ProvidersProps {
  className: string;
  app?: string;
  width?: number;
  height?: number;
}

export default function Providers({ className, app = undefined, width, height }: ProvidersProps) {
  return (
    <div className={className}>
      {registry.getAllProviders().map((provider) => (
        <ProviderIconLink 
          key={provider.id}
          app={app} 
          provider={provider.id} 
          width={width} 
          height={height} 
        />
      ))}
    </div>
  );
}
