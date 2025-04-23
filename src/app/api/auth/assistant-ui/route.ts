import { AssistantCloud } from "@assistant-ui/react";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
 
export const POST = async () => {
  const { userId, orgId } = await auth();
 
  if (!userId) throw new Error("User not authenticated");
 
  const workspaceId = orgId ? `${orgId}:${userId}` : userId;
  const assistantCloud = new AssistantCloud({
    apiKey: process.env["ASSISTANT_API_KEY"]!,
    userId,
    workspaceId,
  });
  const {token} = await assistantCloud.auth.tokens.create();
 
  return NextResponse.json({token});
};