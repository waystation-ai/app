
// Import all providers
import './notion';
import './monday';
import './asana';
import './slack';
import './airtable';
import './gdrive';
import './office';
import './teams';
import './miro';
import './jira';
import './wrike';
import './clickup';
import './linear';
import './gmail';
import './gsheets';
import './mailchimp';
import './zoom';
import './hubspot';
import './trello';
import './outlook';
import './chrome';
import './gmeet';
import './salesforce';
import './smartsheet';
import './postgres';

import './remote-mcps';

export {registry} from './core/registry';
export type { Provider } from '@/marketplace/core/types';


// This file serves as the main entry point for all tools
// It imports and registers all providers, making them available to the system
