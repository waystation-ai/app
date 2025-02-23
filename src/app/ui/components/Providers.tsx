import { ProviderIconLink } from './ProviderIconLink';

interface ProvidersProps {
  className: string;
  width?: number;
  height?: number;
}

export default function Providers({ className, width, height }: ProvidersProps) {
  return (
    <div className={className}>
      <ProviderIconLink provider="gdrive" width={width} height={height} />
      <ProviderIconLink provider="office" width={width} height={height}  />
      <ProviderIconLink provider="slack" width={width} height={height}  />
      <ProviderIconLink provider="teams" width={width} height={height}  />
      <ProviderIconLink provider="jira" width={width} height={height}  />
      <ProviderIconLink provider="monday" width={width} height={height}  />
      <ProviderIconLink provider="asana" width={width} height={height}  />
      <ProviderIconLink provider="chrome" width={width} height={height}  />
      <ProviderIconLink provider="gmail" width={width} height={height}  />
      <ProviderIconLink provider="outlook" width={width} height={height}  />
      <ProviderIconLink provider="zoom" width={width} height={height}  />
      <ProviderIconLink provider="gmeet" width={width} height={height} />
      <ProviderIconLink provider="hubspot" width={width} height={height}  />
      <ProviderIconLink provider="mailchimp" width={width} height={height}  />
      <ProviderIconLink provider="salesforce" width={width} height={height}  />
      <ProviderIconLink provider="smartsheet" width={width} height={height}  />
      <ProviderIconLink provider="trello" width={width} height={height}  />
      <ProviderIconLink provider="airtable" width={width} height={height}  />
    </div>
  );
}
