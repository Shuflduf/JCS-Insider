import { Client, Databases } from "node-appwrite";

class MenuItem {
  public name: string;
  public weekday: string;
  public category: string;
  public price: number;
}

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("jcsinsider");

const databases = new Databases(client);

export async function getMenu() {
  const result = await databases.listDocuments("main", "items");
  console.log(result);
}
