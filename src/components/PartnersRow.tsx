export default function PartnersRow() {
  return (
    <div className="mt-auto bg-white/20 backdrop-blur-md py-6 px-4">
      <p className="text-center text-gray-800 text-lg mb-8 sm:mb-10">Seamlessly integrate with your favorite tools</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-8 sm:gap-6 max-w-5xl mx-auto">
        <img 
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
          alt="Google Docs" 
          className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
        />
        <img 
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" 
          alt="Slack" 
          className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
        />
        <img 
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" 
          alt="Jira" 
          className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
        />
        <img 
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg" 
          alt="Browser" 
          className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
        />
        <img 
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg" 
          alt="Asana" 
          className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
        />
        <img 
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg" 
          alt="Monday.com" 
          className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
        />
        <img 
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" 
          alt="Zendesk" 
          className="h-8 w-8 mx-auto opacity-60 hover:opacity-100 transition-opacity duration-300" 
        />
      </div>
    </div>
  );
}
