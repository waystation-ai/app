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

export default function PartnersRow() {
  return (
    <div className="mt-auto bg-white/20 backdrop-blur-md py-6 px-4">
      <p className="text-center text-gray-800 text-lg mb-8 sm:mb-10">Seamlessly integrate with your favorite tools</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-8 sm:gap-6 max-w-5xl mx-auto">
        <IconBrandGoogleDrive 
          className="h-12 w-12 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Google Drive"
        />
        <IconBrandOffice
          className="h-12 w-12 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Microsoft Office"
        />
        <IconBrandSlack 
          className="h-12 w-12 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Slack"
        />
        <IconBrandTeams
          className="h-12 w-12 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Teams"
        />
        <IconBrandAsana 
          className="h-12 w-12 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Jira"
        />
        <IconBrandMonday
          className="h-12 w-12 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Monday.com"
        />
        <IconBrandChrome 
          className="h-12 w-12 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Browser"
        />
        <IconBrandTrello 
          className="h-12 w-12 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300 stroke-cyan-400" 
          aria-label="Asana"
        />
      </div>
    </div>
  );
}
