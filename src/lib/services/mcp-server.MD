WayStation MCP Server Instructions
==================================

## Overview
WayStation MCP server is a universal remote MCP server that seamlessly connects Claude (and other clients) to a broad range of productivity tools, including Notion, Monday, AirTable, etc.

- WayStation MCP supports both Streamable HTTPS and SSE transports
- The default endpoint is https://waystation.ai/mcp. It does transport negotiation and authorization if necessary
- WayStation also provides preauthenticated individual endpoints like https://waystation.ai/mcp/Iddq66dIdkfARDNb3K. Any registered user can get one in their dashboard at https://waystation.ai/dashboard

## Supported providers
- WayStation supports the following productivity apps: Notion, Monday, Asana, Linear, Atlassian JIRA/Confluence, Slack, Teams, Google Drive (including Docs and Sheets), Office 365, Airtable, Miro, Intercom, PayPal.
- Users can browse available integrations/providers in the Marketplace at https://waystation.ai/marketplace
- New integrations are added regularly based on customer requests or community contributions. If you have an integration request, please contact us at support@waystation.ai.
- Users can connect their apps in the dashboard at https://waystation.ai/dashboard. The connection process may vary by app but generally involves OAuth2 authentication flow with some additional steps for certain apps.

## Supported AI apps
- WayStation remote MCP was tested with Claude, Cursor, Cline, WindSurf, and MCP-remote STDIO proxy provider
- For Cline, user should simply go into the MCP Server screen, switch to the Remote Servers tab, enter "WayStation" as the Server Name and unique MCP URL from user's dashboard
- For Cursor, user should go to the Cursor Settings, MCP tab and click "Add new global MCP server". In mcp.json file user should add the entry for WayStation as following:
```json
"WayStation": {
      "url": "https://waystation.ai/mcp/<user_unique_id>"
}
```

## Use Cases
- WayStation supports a variety of productivity and automation use cases listed below:
  - Project Management
  - Task Automation
  - Meeting Summaries & Action Items
  - Workflow Automation & Process Optimization
  - Resource & Capacity Planning
  - Risk & Issue Management
  - Reporting & Insights
  - Portfolio Management
  - Team Collaboration Assistant
- When user asks how to do/achieve something ask clarifying questions and try to understand their apps to suggest solution using available providers and tools 