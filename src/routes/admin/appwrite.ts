import { Client, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("jcsinsider");

const databases = new Databases(client);

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export interface MenuData {
  [weekday: string]: {
    [category: string]: {
      name: string;
      price: number | undefined
    }[];
  };
}

interface MenuItem {
  weekday: string,
  category: string,
  name: string,
  price: number,
}

export async function updateMenu(newMenu: MenuData) {
  let items: MenuItem[] = [];
  for (const weekday in newMenu) {
    for (const category in newMenu[weekday]) {
      for (const item of newMenu[weekday][category]) {
        items.push({
          weekday,
          category,
          name: item.name,
          price: item.price ?? 0,
        });
      }
    }
  }

  try {
    const result = await databases.listDocuments("main", "items");
    console.log(result);

    for (const item of result.documents) {
      await databases.deleteDocument("main", "items", item.$id);
    }
  } catch (error) {
    console.error("Error deleting documents:", error);
  }

  try {
    for (const item of items) {
      await databases.createDocument("main", "items", ID.unique(), {
        weekday: item.weekday,
        category: item.category,
        name: item.name,
        price: item.price,
      });
    }
  } catch (error) {
    console.error("Error creating documents:", error);
  }
}

export async function getMenu(): Promise<MenuData> {
  try {
    const result = await databases.listDocuments("main", "items");
    console.log(result);

    const final: MenuData = {};

    for (const weekday of WEEKDAYS) {
      final[weekday] = {};
    }

    for (const item of result.documents) {
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
