import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProviderConfig } from "@/lib/services/provider-config";
import { storeConnectionString, removeDbConnection } from "@/lib/db";
import { isNativeProvider, AuthType } from "@/marketplace/core/types";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { provider: providerId } = await params;

    await removeDbConnection(session.userId, providerId);

    return NextResponse.json({ message: "Connection deleted" });
  } catch (error) {
    console.error("Error deleting connection:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { provider: providerId } = await params;
    const provider = getProviderConfig(providerId);

    const body = await request.json();
    const { connectionString } = body;

    if (!connectionString) {
      return new NextResponse("Connection string is required", { status: 400 });
    }

    if (
      isNativeProvider(provider) &&
      provider.auth &&
      provider.auth.type === AuthType.ConnectionString
    ) {
      await storeConnectionString(
        session.userId,
        provider.id,
        connectionString,
        `${provider.id} connection`
      );
    } else {
      return new NextResponse("Unsupported authentication type", {
        status: 400,
      });
    }

    return NextResponse.json({ message: "Connection successful" });
  } catch (error) {
    console.error("Error saving connection string:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
