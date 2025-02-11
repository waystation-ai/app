import { 
  IconBrandGoogleDrive,
  IconBrandOffice, 
  IconBrandSlack,
  IconBrandTeams,
  IconBrandMonday, 
  IconBrandAsana, 
  IconBrandChrome, 
  IconBrandTrello
} from '@tabler/icons-react';

export default function Partners() {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-3">
        <IconBrandGoogleDrive 
          className="h-10 w-10 opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Google Drive"
        />
        <IconBrandOffice
          className="h-10 w-10 opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Microsoft Office"
        />
        <IconBrandSlack 
          className="h-10 w-10 opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Slack"
        />
        <IconBrandTeams
          className="h-10 w-10 opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Teams"
        />
        <IconBrandAsana 
          className="h-10 w-10 opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Jira"
        />
        <IconBrandMonday
          className="h-10 w-10 opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Monday.com"
        />
        <IconBrandChrome 
          className="h-10 w-10 opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Browser"
        />
        <IconBrandTrello 
          className="h-10 w-10 opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Asana"
        />
      </div>
    </div>
  );
}
