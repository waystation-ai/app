export async function GET() {
  const response = await fetch(`https://clerk.${process.env.APP_DOMAIN}/.well-known/openid-configuration`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return Response.json(await response.json());
}

