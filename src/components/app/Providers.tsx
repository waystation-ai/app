import { ProviderIconLink } from './ProviderIconLink';
import { registry } from '@/marketplace';

interface ProvidersProps {
  className: string;
  width?: number;
  height?: number;
}

export default function Providers({ className,  width, height }: ProvidersProps) {
  return (
    <div className={className}>
      {registry.getVetoedProviders().map((provider) => (
        <ProviderIconLink 
          key={provider.id}
          provider={provider.id} 
          width={width} 
          height={height} 
        />
      ))}
    </div>
  );
}
