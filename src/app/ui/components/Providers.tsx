import { ProviderIconLink } from './ProviderIconLink';

interface ProvidersProps {
  className: string;
  app?: string;
  width?: number;
  height?: number;
}

export default function Providers({ className, app = "chatgpt", width, height }: ProvidersProps) {
  return (
    <div className={className}>
      <ProviderIconLink app={app} provider="gdrive" width={width} height={height} />
      <ProviderIconLink app={app} provider="office" width={width} height={height}  />
      <ProviderIconLink app={app} provider="slack" width={width} height={height}  />
      <ProviderIconLink app={app} provider="teams" width={width} height={height}  />
      <ProviderIconLink app={app} provider="jira" width={width} height={height}  />
      <ProviderIconLink app={app} provider="monday" width={width} height={height}  />
      <ProviderIconLink app={app} provider="asana" width={width} height={height}  />
      <ProviderIconLink app={app} provider="chrome" width={width} height={height}  />
      <ProviderIconLink app={app} provider="gmail" width={width} height={height}  />
      <ProviderIconLink app={app} provider="outlook" width={width} height={height}  />
      <ProviderIconLink app={app} provider="zoom" width={width} height={height}  />
      <ProviderIconLink app={app} provider="gmeet" width={width} height={height} />
      <ProviderIconLink app={app} provider="hubspot" width={width} height={height}  />
      <ProviderIconLink app={app} provider="mailchimp" width={width} height={height}  />
      <ProviderIconLink app={app} provider="salesforce" width={width} height={height}  />
      <ProviderIconLink app={app} provider="smartsheet" width={width} height={height}  />
      <ProviderIconLink app={app} provider="trello" width={width} height={height}  />
      <ProviderIconLink app={app} provider="airtable" width={width} height={height}  />
    </div>
  );
}
