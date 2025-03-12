import { z } from 'zod';

export const OAuthProviderSchema = z.object({
  name: z.string(),
  description: z.string(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  authorizationUrl: z.string().url().optional(),
  tokenUrl: z.string().url().optional(),
  scopes: z.array(z.string()).optional(),
  redirectUri: z.string().url().optional(),
  bullets: z.array(z.string()).optional(),
  chat: z.array(z.object({
    role: z.enum(['user', 'agent']),
    content: z.string()
  })).optional(),
});

export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
}

const baseRedirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`;

export const providers: Record<string, OAuthProvider> = {
  monday: {
    name: 'Monday',
    description: 'Access and manage your Monday.com boards, items, and updates seamlessly.',
    clientId: process.env.MONDAY_CLIENT_ID || '',
    clientSecret: process.env.MONDAY_CLIENT_SECRET || '',
    authorizationUrl: 'https://auth.monday.com/oauth2/authorize',
    tokenUrl: 'https://auth.monday.com/oauth2/token',
    scopes: [
      'me:read',
      'boards:read',
      'boards:write',
      'workspaces:read',
      'updates:read',
      'updates:write'
    ],
    redirectUri: `${baseRedirectUri}/monday/callback`,
    bullets: [
      "Automate routine tasks and updates across your Monday boards",
      "Transform requests and feedback into organized board items",
      "Generate progress reports and insights from your Monday data"
    ],
    chat: [
      { role: 'user', content: "Can you process all the customer feedback from last week and organize it in Monday?" },
      { role: 'agent', content: "I'll analyze the feedback and update our Customer Feedback board. Would you like me to categorize by priority or feature type?" },
      { role: 'user', content: "Let's categorize by feature type" },
      { role: 'agent', content: "Processing feedback and creating categorized items in Monday. I'll also prepare a summary of key trends for our next team meeting." }
    ]
  },
  slack: {
    name: 'Slack',
    description: 'Send messages, access channels, and manage files in your Slack workspace.',
    clientId: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    authorizationUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: [
      'channels:read',
      'channels:history',
      'groups:read',
      'groups:history',
      'chat:write',
      'files:read',
      'users:read'
    ],
    redirectUri: `${baseRedirectUri}/slack/callback`,
    bullets: [
      "Share updates and insights across your team channels automatically",
      "Coordinate responses to messages and threads intelligently",
      "Keep teams in sync with smart notifications and summaries"
    ],
    chat: [
      { role: 'user', content: "Can you summarize today's #product-team discussions and share the key points with #engineering?" },
      { role: 'agent', content: "I'll analyze the product team channel and create a summary. Would you like me to focus on technical requirements?" },
      { role: 'user', content: "Yes, and highlight any upcoming deadlines" },
      { role: 'agent', content: "I've posted a summary to #engineering highlighting the technical requirements and deadlines. I've also added reminders for the critical milestones." }
    ]
  },
  gdrive: {
    name: 'Google Drive',
    description: 'Browse, search, and manage your selected Google Drive files.',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/drive.file'
    ],
    redirectUri: `${baseRedirectUri}/gdrive/callback`,
    bullets: [
      "Select specific documents to analyze with AI assistance",
      "Extract insights from spreadsheets and presentations securely",
      "Maintain full control over which files can be accessed"
    ],
    chat: [
      { role: 'user', content: "Can you find all product specs from Q1 and summarize the key features we planned?" },
      { role: 'agent', content: "Searching through the product specification documents you've shared. Would you like me to organize features by priority or timeline?" },
      { role: 'user', content: "Let's see them by priority" },
      { role: 'agent', content: "I've analyzed the spec documents you provided and created a summary of key features, sorted by priority. I can share this as a new document or update the existing product roadmap." }
    ]
  },
  gmail: {
    name: 'Gmail',
    description: 'Read emails, send messages, and manage labels in your Gmail account.',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    //authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.labels'
    ],
    redirectUri: `${baseRedirectUri}/gmail/callback`,
    bullets: [
      "Process and organize emails intelligently with smart filters and labels",
      "Draft and send personalized responses automatically",
      "Extract insights and action items from your email communications"
    ],
    chat: [
      { role: 'user', content: "Can you check my emails from last week and identify any urgent client requests?" },
      { role: 'agent', content: "I'll scan your recent emails. Would you like me to categorize them by priority or response time needed?" },
      { role: 'user', content: "Priority please, and flag any that need immediate response" },
      { role: 'agent', content: "I've analyzed your emails and found 3 high-priority client requests. I've labeled them and drafted response templates for your review." }
    ]
  },
  zoom: {
    name: 'Zoom',
    description: 'Schedule, manage, and enhance your Zoom meetings and webinars.',
    bullets: [
      "Schedule and organize meetings with smart participant coordination",
      "Generate meeting summaries and action items automatically",
      "Track attendance and engagement across your meetings"
    ],
    chat: [
      { role: 'user', content: "Can you schedule our quarterly review and invite the whole team?" },
      { role: 'agent', content: "I'll help set that up. Would you like me to find the best time based on everyone's calendar?" },
      { role: 'user', content: "Yes, and make it a 2-hour slot" },
      { role: 'agent', content: "I've scheduled the quarterly review for next Tuesday at 10 AM, sent calendar invites, and included the Q3 report in the meeting details." }
    ]
  },
  jira: {
    name: 'Jira',
    description: 'Track issues, manage projects, and streamline workflows in Jira.',
    bullets: [
      "Create and update issues based on team communications",
      "Track sprint progress and generate status reports",
      "Automate workflow transitions and notifications"
    ],
    chat: [
      { role: 'user', content: "Can you check our current sprint and highlight any blockers?" },
      { role: 'agent', content: "I'll analyze the sprint board. Would you like to focus on high-priority items or all blocked tasks?" },
      { role: 'user', content: "Show me high-priority blockers first" },
      { role: 'agent', content: "I found 3 high-priority blocked issues. I've tagged the relevant team leads and created a summary for our daily standup." }
    ]
  },
  airtable: {
    name: 'Airtable',
    description: 'Access and manage your Airtable bases, tables, and records seamlessly.',
    clientId: process.env.AIRTABLE_CLIENT_ID || '',
    clientSecret: process.env.AIRTABLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://airtable.com/oauth2/v1/authorize',
    tokenUrl: 'https://airtable.com/oauth2/v1/token',
    scopes: [
      'data.records:read',
      'data.records:write',
      'schema.bases:read'
    ],
    redirectUri: `${baseRedirectUri}/airtable/callback`,
    bullets: [
      "Sync and update records automatically across your bases",
      "Transform data into structured insights and reports",
      "Automate workflows between Airtable and other tools"
    ],
    chat: [
      { role: 'user', content: "Can you analyze our sales data from Q4 and create a summary report?" },
      { role: 'agent', content: "I'll examine the sales base. Would you like to focus on revenue trends or customer segments?" },
      { role: 'user', content: "Let's look at customer segments first" },
      { role: 'agent', content: "I've analyzed the data and created a new view showing key customer segments, their growth rates, and potential opportunities. I've also added charts to visualize the trends." }
    ]
  },
  asana: {
    name: 'Asana',
    description: 'Access and manage your Asana workspaces, projects, and tasks seamlessly.',
    clientId: process.env.ASANA_CLIENT_ID || '',
    clientSecret: process.env.ASANA_CLIENT_SECRET || '',
    authorizationUrl: 'https://app.asana.com/-/oauth_authorize',
    tokenUrl: 'https://app.asana.com/-/oauth_token',
    scopes: [
      'default',
      'projects:read',
      'projects:write',
      'tasks:read',
      'tasks:write',
      'workspaces:read'
    ],
    redirectUri: `${baseRedirectUri}/asana/callback`,
    bullets: [
      "Track project progress and milestone completion automatically",
      "Convert conversations and emails into structured tasks",
      "Keep teams aligned with smart project updates and summaries"
    ],
    chat: [
      { role: 'user', content: "Can you create tasks for all the action items from today's meeting?" },
      { role: 'agent', content: "I'll review the meeting notes. Would you like these organized by project or deadline?" },
      { role: 'user', content: "Let's organize them by project" },
      { role: 'agent', content: "I've created 8 tasks across 3 projects, assigned them to the relevant team members, and added the context from our meeting notes." }
    ]
  },
  hubspot: {
    name: 'HubSpot',
    description: 'Manage contacts, deals, and marketing campaigns in your HubSpot account.',
    bullets: [
      "Track and nurture leads through automated workflows",
      "Generate personalized content for marketing campaigns",
      "Analyze customer interactions and engagement patterns"
    ],
    chat: [
      { role: 'user', content: "Can you identify leads that haven't been contacted in the last month?" },
      { role: 'agent', content: "I'll search through our contacts. Would you like to filter by lead score or industry?" },
      { role: 'user', content: "Filter by lead score, focus on high-value prospects" },
      { role: 'agent', content: "I found 12 high-scoring leads needing follow-up. I've created a smart list and drafted personalized email templates based on their recent interactions." }
    ]
  },
  trello: {
    name: 'Trello',
    description: 'Organize projects and track tasks with Trello boards and cards.',
    bullets: [
      "Create and organize cards from team discussions",
      "Track deadlines and progress across multiple boards",
      "Automate task assignments and status updates"
    ],
    chat: [
      { role: 'user', content: "Can you organize our product backlog and prioritize this month's features?" },
      { role: 'agent', content: "I'll review the backlog. Should I prioritize based on customer impact or development effort?" },
      { role: 'user', content: "Let's prioritize by customer impact" },
      { role: 'agent', content: "I've reorganized the backlog, tagged high-impact features, and created a new board for this month's sprint with estimated story points." }
    ]
  },
  teams: {
    name: 'Microsoft Teams',
    description: 'Collaborate, chat, and manage meetings in Microsoft Teams.',
    clientId: process.env.OFFICE_CLIENT_ID || '',
    clientSecret: process.env.OFFICE_CLIENT_SECRET || '',
    authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopes: [
      'User.Read',
      'Team.ReadBasic.All',
      'Channel.ReadBasic.All',
      'ChannelMessage.Send',
      'offline_access'
    ],
    redirectUri: `${baseRedirectUri}/teams/callback`,
    bullets: [
      "Coordinate team communications and meeting schedules intelligently",
      "Generate summaries from chats and channel discussions",
      "Automate updates and notifications across teams"
    ],
    chat: [
      { role: 'user', content: "Can you summarize the key decisions from our project channels this week?" },
      { role: 'agent', content: "I'll analyze the discussions. Would you like to focus on technical decisions or project timelines?" },
      { role: 'user', content: "Technical decisions please" },
      { role: 'agent', content: "I've compiled the technical decisions from 5 channels and created a summary document. I've also flagged items that need further discussion in our next architecture review." }
    ]
  },
  office: {
    name: 'Office 365',
    description: 'Create, edit, and collaborate on Office documents and spreadsheets.',
    clientId: process.env.OFFICE_CLIENT_ID || '',
    clientSecret: process.env.OFFICE_CLIENT_SECRET || '',
    authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopes: [
      'Files.Read.All',
      'offline_access'
    ],
    redirectUri: `${baseRedirectUri}/office/callback`,
    bullets: [
      "Extract insights and data from documents automatically",
      "Generate reports and presentations from your data",
      "Keep documents and spreadsheets synchronized"
    ],
    chat: [
      { role: 'user', content: "Can you analyze our Q4 sales spreadsheets and create a presentation for the board?" },
      { role: 'agent', content: "I'll examine the sales data. Would you like to emphasize growth trends or regional performance?" },
      { role: 'user', content: "Focus on growth trends" },
      { role: 'agent', content: "I've created a presentation highlighting key growth metrics, with charts showing trend lines and projections. I've also added notes identifying the main drivers of growth." }
    ]
  },
  notion: {
    name: 'Notion',
    description: 'Access and manage your Notion databases, pages, and content.',
    clientId: process.env.NOTION_CLIENT_ID || '',
    clientSecret: process.env.NOTION_CLIENT_SECRET || '',
    authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl: 'https://api.notion.com/v1/oauth/token',
    scopes: [
      'read_user',
      'read_databases',
      'write_databases',
      'read_pages',
      'write_pages',
      'read_blocks',
      'write_blocks'
    ],
    redirectUri: `${baseRedirectUri}/notion/callback`,
    bullets: [
      "Access and manage your Notion databases and pages",
      "Create and update content in your Notion workspace",
      "Search across your Notion content and organize information"
    ],
    chat: [
      { role: 'user', content: "Can you summarize all our product specs in Notion and create a feature comparison table?" },
      { role: 'agent', content: "I'll analyze your Notion documents. Would you like to focus on current features or include the roadmap items too?" },
      { role: 'user', content: "Let's include roadmap items as well" },
      { role: 'agent', content: "I've created a comprehensive comparison table in Notion with current features and roadmap items, color-coded by development status and priority." }
    ]
  },
  outlook: {
    name: 'Outlook',
    description: 'Manage emails, calendar events, and contacts in Outlook.',
    bullets: [
      "Organize and prioritize emails intelligently",
      "Schedule meetings with smart calendar management",
      "Generate response drafts and follow-ups automatically"
    ],
    chat: [
      { role: 'user', content: "Can you help schedule our team's 1:1 meetings for next month?" },
      { role: 'agent', content: "I'll check everyone's availability. Would you like 30-minute or 1-hour slots?" },
      { role: 'user', content: "30-minute slots, and try to group them on the same days" },
      { role: 'agent', content: "I've scheduled all 1:1s for Tuesdays and Thursdays, found optimal times for each team member, and sent calendar invites with prep agenda templates." }
    ]
  },
  chrome: {
    name: 'Chrome',
    description: 'Automate and enhance your browser workflows with Chrome integration.',
    bullets: [
      "Automate repetitive browser tasks and workflows",
      "Extract and analyze data from web applications",
      "Synchronize information across browser sessions"
    ],
    chat: [
      { role: 'user', content: "Can you collect pricing data from our competitor's websites?" },
      { role: 'agent', content: "I'll scan their product pages. Would you like to focus on specific product categories?" },
      { role: 'user', content: "Yes, just the enterprise plans" },
      { role: 'agent', content: "I've gathered pricing data for enterprise plans from 5 competitors, created a comparison spreadsheet, and highlighted key differentiators in our offering." }
    ]
  },
  gmeet: {
    name: 'Google Meet',
    description: 'Schedule and manage video meetings with Google Meet.',
    bullets: [
      "Schedule and coordinate video meetings efficiently",
      "Generate meeting summaries and action items",
      "Track attendance and participation analytics"
    ],
    chat: [
      { role: 'user', content: "Can you set up our weekly team syncs for next quarter?" },
      { role: 'agent', content: "I'll help schedule those. Would you like to keep the same time slots or find new ones based on team availability?" },
      { role: 'user', content: "Let's find new times that work better for our remote team" },
      { role: 'agent', content: "I've analyzed everyone's calendars and time zones, found optimal slots, and scheduled the meetings with rotating discussion topics and prep materials." }
    ]
  },
  mailchimp: {
    name: 'Mailchimp',
    description: 'Create and manage email marketing campaigns in Mailchimp.',
    bullets: [
      "Create and optimize email campaigns automatically",
      "Analyze subscriber engagement and behavior",
      "Generate personalized content for different segments"
    ],
    chat: [
      { role: 'user', content: "Can you analyze our last campaign's performance and prepare next month's newsletter?" },
      { role: 'agent', content: "I'll review the metrics. Should we focus on improving open rates or click-through rates?" },
      { role: 'user', content: "Let's improve click-through rates" },
      { role: 'agent', content: "I've analyzed the data and drafted a new newsletter with optimized CTAs, personalized content blocks, and A/B test variants based on successful patterns." }
    ]
  },
  salesforce: {
    name: 'Salesforce',
    description: 'Manage customer relationships and sales processes in Salesforce.',
    bullets: [
      "Update and enrich customer records automatically",
      "Track sales pipeline and generate forecasts",
      "Automate follow-ups and task assignments"
    ],
    chat: [
      { role: 'user', content: "Can you analyze our pipeline and highlight deals we might close this quarter?" },
      { role: 'agent', content: "I'll examine the opportunities. Would you like to focus on deal size or closing probability?" },
      { role: 'user', content: "Let's look at high-probability deals first" },
      { role: 'agent', content: "I've identified 8 high-probability opportunities worth $1.2M. I've created a detailed report and suggested next actions for each deal." }
    ]
  },
  smartsheet: {
    name: 'Smartsheet',
    description: 'Manage projects and automate workflows with Smartsheet.',
    bullets: [
      "Update project timelines and dependencies automatically",
      "Generate status reports and resource allocations",
      "Track milestones and deliverables across teams"
    ],
    chat: [
      { role: 'user', content: "Can you update our project timeline based on this week's progress?" },
      { role: 'agent', content: "I'll review the updates. Should I adjust resource allocations or just delivery dates?" },
      { role: 'user', content: "Let's look at both to optimize the schedule" },
      { role: 'agent', content: "I've updated the timeline, rebalanced team workloads, and flagged potential bottlenecks. I've also created a summary of changes for stakeholders." }
    ]
  }
};

// Validate provider configurations
Object.entries(providers).forEach(([key, provider]) => {
  try {
    OAuthProviderSchema.parse(provider);
  } catch (error) {
    console.error(`Invalid provider configuration for ${key}:`, error);
    throw error;
  }
});

export type ProviderName = keyof typeof providers;

export function getProviderConfig(provider: string): OAuthProvider {
  const config = providers[provider];
  if (!config) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return config;
}
