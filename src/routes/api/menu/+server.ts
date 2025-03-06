import type { RequestHandler } from "./$types";
import { Client, Databases } from "node-appwrite";
import { APPWRITE_TOKEN } from "$env/static/private";

export const GET: RequestHandler = async (event) => {
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("jcsinsider")
    .setKey(APPWRITE_TOKEN);

  const databases = new Databases(client);

  const result = await databases.getAttribute("main", "items", "category");

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PATCH: RequestHandler = async ({ request }) => {
  const { newValues }: { newValues: string[] } = await request.json();
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("jcsinsider")
    .setKey(APPWRITE_TOKEN);

  const databases = new Databases(client);

  const result = await databases.updateEnumAttribute(
    "main",
    "items",
    "category",
    newValues,
    false,
    "bake"
  );

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
};
