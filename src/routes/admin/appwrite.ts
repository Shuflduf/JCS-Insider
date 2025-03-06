import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("jcsinsider");

const databases = new Databases(client);

interface MenuItem {
  name: string;
  price: number;
}

interface MenuCategory {
  [category: string]: MenuItem[];
}

interface MenuData {
  [day: string]: MenuCategory;
}

export async function getMenu(): Promise<MenuData> {
  try {
    const result = await databases.listDocuments("main", "items");
    console.log(result);

    const final: MenuData = {};

    for (const item of result.documents) {
      if (!final[item.weekday]) {
        final[item.weekday] = {};
      }

      if (!final[item.weekday][item.category]) {
        final[item.weekday][item.category] = [];
      }

      final[item.weekday][item.category].push({
        name: item.name,
        price: item.price,
      });
    }
    return final;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
}
