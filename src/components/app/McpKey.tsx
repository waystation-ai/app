"use server";

import { auth } from "@clerk/nextjs/server";
import { CopyBox } from "./CopyBox";

export async function McpKey() {
  const { getToken } = await auth();
  const template = 'mcp';
  const token = await getToken({ template });

  return <CopyBox text={token} />;
}