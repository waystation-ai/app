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
    isAI: z.boolean(),
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
      { isAI: true, content: "Can you process all the customer feedback from last week and organize it in Monday?" },
      { isAI: false, content: "I'll analyze the feedback and update our Customer Feedback board. Would you like me to categorize by priority or feature type?" },
      { isAI: true, content: "Let's categorize by feature type" },
      { isAI: false, content: "Processing feedback and creating categorized items in Monday. I'll also prepare a summary of key trends for our next team meeting." }
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
      { isAI: true, content: "Can you summarize today's #product-team discussions and share the key points with #engineering?" },
      { isAI: false, content: "I'll analyze the product team channel and create a summary. Would you like me to focus on technical requirements?" },
      { isAI: true, content: "Yes, and highlight any upcoming deadlines" },
      { isAI: false, content: "I've posted a summary to #engineering highlighting the technical requirements and deadlines. I've also added reminders for the critical milestones." }
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
      { isAI: true, content: "Can you find all product specs from Q1 and summarize the key features we planned?" },
      { isAI: false, content: "Searching through the product specification documents you've shared. Would you like me to organize features by priority or timeline?" },
      { isAI: true, content: "Let's see them by priority" },
      { isAI: false, content: "I've analyzed the spec documents you provided and created a summary of key features, sorted by priority. I can share this as a new document or update the existing product roadmap." }
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
      { isAI: true, content: "Can you check my emails from last week and identify any urgent client requests?" },
      { isAI: false, content: "I'll scan your recent emails. Would you like me to categorize them by priority or response time needed?" },
      { isAI: true, content: "Priority please, and flag any that need immediate response" },
      { isAI: false, content: "I've analyzed your emails and found 3 high-priority client requests. I've labeled them and drafted response templates for your review." }
    ]
  },
  asana: {
    name: 'Asana',
    description: 'Manage tasks, projects, and team collaboration in your Asana workspace.',
    bullets: [
      "Track project progress and milestone completion automatically",
      "Convert conversations and emails into structured tasks",
      "Keep teams aligned with smart project updates and summaries"
    ],
    chat: [
      { isAI: true, content: "Can you create tasks for all the action items from today's meeting?" },
      { isAI: false, content: "I'll review the meeting notes. Would you like these organized by project or deadline?" },
      { isAI: true, content: "Let's organize them by project" },
      { isAI: false, content: "I've created 8 tasks across 3 projects, assigned them to the relevant team members, and added the context from our meeting notes." }
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
      { isAI: true, content: "Can you schedule our quarterly review and invite the whole team?" },
      { isAI: false, content: "I'll help set that up. Would you like me to find the best time based on everyone's calendar?" },
      { isAI: true, content: "Yes, and make it a 2-hour slot" },
      { isAI: false, content: "I've scheduled the quarterly review for next Tuesday at 10 AM, sent calendar invites, and included the Q3 report in the meeting details." }
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
      { isAI: true, content: "Can you check our current sprint and highlight any blockers?" },
      { isAI: false, content: "I'll analyze the sprint board. Would you like to focus on high-priority items or all blocked tasks?" },
      { isAI: true, content: "Show me high-priority blockers first" },
      { isAI: false, content: "I found 3 high-priority blocked issues. I've tagged the relevant team leads and created a summary for our daily standup." }
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
      { isAI: true, content: "Can you analyze our sales data from Q4 and create a summary report?" },
      { isAI: false, content: "I'll examine the sales base. Would you like to focus on revenue trends or customer segments?" },
      { isAI: true, content: "Let's look at customer segments first" },
      { isAI: false, content: "I've analyzed the data and created a new view showing key customer segments, their growth rates, and potential opportunities. I've also added charts to visualize the trends." }
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
      { isAI: true, content: "Can you identify leads that haven't been contacted in the last month?" },
      { isAI: false, content: "I'll search through our contacts. Would you like to filter by lead score or industry?" },
      { isAI: true, content: "Filter by lead score, focus on high-value prospects" },
      { isAI: false, content: "I found 12 high-scoring leads needing follow-up. I've created a smart list and drafted personalized email templates based on their recent interactions." }
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
      { isAI: true, content: "Can you organize our product backlog and prioritize this month's features?" },
      { isAI: false, content: "I'll review the backlog. Should I prioritize based on customer impact or development effort?" },
      { isAI: true, content: "Let's prioritize by customer impact" },
      { isAI: false, content: "I've reorganized the backlog, tagged high-impact features, and created a new board for this month's sprint with estimated story points." }
    ]
  },
  teams: {
    name: 'Microsoft Teams',
    description: 'Collaborate, chat, and manage meetings in Microsoft Teams.',
    bullets: [
      "Coordinate team communications and meeting schedules intelligently",
      "Generate summaries from chats and channel discussions",
      "Automate updates and notifications across teams"
    ],
    chat: [
      { isAI: true, content: "Can you summarize the key decisions from our project channels this week?" },
      { isAI: false, content: "I'll analyze the discussions. Would you like to focus on technical decisions or project timelines?" },
      { isAI: true, content: "Technical decisions please" },
      { isAI: false, content: "I've compiled the technical decisions from 5 channels and created a summary document. I've also flagged items that need further discussion in our next architecture review." }
    ]
  },
  office: {
    name: 'Microsoft Office',
    description: 'Create, edit, and collaborate on Office documents and spreadsheets.',
    bullets: [
      "Extract insights and data from documents automatically",
      "Generate reports and presentations from your data",
      "Keep documents and spreadsheets synchronized"
    ],
    chat: [
      { isAI: true, content: "Can you analyze our Q4 sales spreadsheets and create a presentation for the board?" },
      { isAI: false, content: "I'll examine the sales data. Would you like to emphasize growth trends or regional performance?" },
      { isAI: true, content: "Focus on growth trends" },
      { isAI: false, content: "I've created a presentation highlighting key growth metrics, with charts showing trend lines and projections. I've also added notes identifying the main drivers of growth." }
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
      { isAI: true, content: "Can you help schedule our team's 1:1 meetings for next month?" },
      { isAI: false, content: "I'll check everyone's availability. Would you like 30-minute or 1-hour slots?" },
      { isAI: true, content: "30-minute slots, and try to group them on the same days" },
      { isAI: false, content: "I've scheduled all 1:1s for Tuesdays and Thursdays, found optimal times for each team member, and sent calendar invites with prep agenda templates." }
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
      { isAI: true, content: "Can you collect pricing data from our competitor's websites?" },
      { isAI: false, content: "I'll scan their product pages. Would you like to focus on specific product categories?" },
      { isAI: true, content: "Yes, just the enterprise plans" },
      { isAI: false, content: "I've gathered pricing data for enterprise plans from 5 competitors, created a comparison spreadsheet, and highlighted key differentiators in our offering." }
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
      { isAI: true, content: "Can you set up our weekly team syncs for next quarter?" },
      { isAI: false, content: "I'll help schedule those. Would you like to keep the same time slots or find new ones based on team availability?" },
      { isAI: true, content: "Let's find new times that work better for our remote team" },
      { isAI: false, content: "I've analyzed everyone's calendars and time zones, found optimal slots, and scheduled the meetings with rotating discussion topics and prep materials." }
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
      { isAI: true, content: "Can you analyze our last campaign's performance and prepare next month's newsletter?" },
      { isAI: false, content: "I'll review the metrics. Should we focus on improving open rates or click-through rates?" },
      { isAI: true, content: "Let's improve click-through rates" },
      { isAI: false, content: "I've analyzed the data and drafted a new newsletter with optimized CTAs, personalized content blocks, and A/B test variants based on successful patterns." }
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
      { isAI: true, content: "Can you analyze our pipeline and highlight deals we might close this quarter?" },
      { isAI: false, content: "I'll examine the opportunities. Would you like to focus on deal size or closing probability?" },
      { isAI: true, content: "Let's look at high-probability deals first" },
      { isAI: false, content: "I've identified 8 high-probability opportunities worth $1.2M. I've created a detailed report and suggested next actions for each deal." }
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
      { isAI: true, content: "Can you update our project timeline based on this week's progress?" },
      { isAI: false, content: "I'll review the updates. Should I adjust resource allocations or just delivery dates?" },
      { isAI: true, content: "Let's look at both to optimize the schedule" },
      { isAI: false, content: "I've updated the timeline, rebalanced team workloads, and flagged potential bottlenecks. I've also created a summary of changes for stakeholders." }
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
