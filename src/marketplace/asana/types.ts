import { Resource } from "../core/types";

export interface AsanaTask extends Resource  {
  completed: boolean;
  due_on?: string;
  assignee?: Record<string, unknown>;
};

export type AsanaProject = Resource;

export type AsanaTaskResource = AsanaTask & {
  resource_type: 'task';
};

export type AsanaProjectResource = AsanaProject & {
  resource_type: 'project';
};

export type AsanaResource = AsanaTaskResource | AsanaProjectResource;