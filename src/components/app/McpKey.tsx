import { auth } from "@clerk/nextjs/server";
import { McpKeyDisplay } from "./CopyBox";

export async function McpKey() {
  const { getToken } = await auth();
  const template = 'mcp';
  const token = await getToken({ template });

  return <McpKeyDisplay text={token} />;
}