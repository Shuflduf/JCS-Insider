<script lang="ts">
  import { onMount } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import { fade } from "svelte/transition";
  import { getMenu } from "./appwrite";
  import Settings from "./Settings.svelte";

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

  let password = $state("");
  let isAuthenticated = $state(false);
  let isTransitioning = $state(false);
  let isReady = $derived(() => isAuthenticated && !isTransitioning);
  const correctPassword = "password";

  let items = $state<MenuData>({});
  let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let categories: string[] = $state(["Food Time"]);
  let isSettingsOpen = $state(false);

  onMount(async () => {
    const weekdays = await fetch("/api/menu");
    const jsonWeekdays = await weekdays.json();
    categories = jsonWeekdays["elements"];
    items = await getMenu();
    console.log(items);
  });

  let sideWidth = new Tween(0, {
    duration: 700,
    easing: cubicInOut,
  });
  sideWidth.set(400);

  function checkPassword() {
    if (password === correctPassword) {
      isTransitioning = true;
      sideWidth.set(0);
      setTimeout(() => {
        isAuthenticated = true;
        isTransitioning = false;
        console.log("Authenticated");
      }, 700);
    } else {
      alert("Incorrect password");
    }
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    checkPassword();
  }

  function deleteItem(day: string, category: string, itemIndex: number) {
    if (!items[day]) return;
    if (!items[day][category]) return;

    items[day][category] = items[day][category].filter(
      (_, index) => index !== itemIndex
    );
    items = items; // trigger reactivity
  }

  function firstCap(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  async function handleCategorySave(newCategories: string[]) {
    try {
      const response = await fetch("/api/menu", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newValues: newCategories }),
      });

      if (response.ok) {
        categories = newCategories;
      } else {
        alert("Failed to update categories");
      }
    } catch (error) {
      console.error("Error updating categories:", error);
      alert("Failed to update categories");
    }
  }
</script>

<div
  class="flex items-center justify-center min-h-screen {isAuthenticated
    ? 'bg-gray-200'
    : 'bg-gray-300'}"
>
  {#if isAuthenticated}
    <div class="flex w-full h-screen" transition:fade>
      <div class="flex-1" style="max-width: {sideWidth.current}px"></div>

      <div class="flex-1 flex gap-4 p-4 relative">
        <button
          class="fixed bottom-8 right-8 p-3 rounded-full hover:bg-gray-200 bg-white shadow-lg text-xl"
          onclick={() => (isSettingsOpen = true)}
        >
          ⚙️
        </button>

        {#each days as day}
          <div class="flex-1 flex flex-col h-full">
            <h2
              class="text-xl font-bold mb-4 sticky top-0 bg-white p-2 shadow-sm"
            >
              {day}
            </h2>
            <div class="flex-1 overflow-y-auto">
              {#each categories as category}
                <div class="mb-6">
                  <h3 class="text-lg font-semibold mb-3 text-gray-700">
                    {firstCap(category)}
                  </h3>
                  {#if items[day]?.[category]}
                    {#each items[day][category] as item, itemIndex}
                      <div
                        class="bg-white rounded-lg shadow-md mb-4 p-4 relative"
                      >
                        <button
                          class="absolute top-0 right-2 text-gray-500 hover:text-red-500"
                          onclick={() => deleteItem(day, category, itemIndex)}
                        >
                          ×
                        </button>
                        <p>{item.name}</p>
                        <p class="text-sm text-gray-600">${item.price}</p>
                      </div>
                    {/each}
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <div class="flex-1" style="max-width: {sideWidth.current}px"></div>
    </div>
  {:else}
    <div class="flex w-full">
      <div class="flex-1" style="max-width: {sideWidth.current}px"></div>

      <div
        class="flex-1 {isReady()
          ? ''
          : 'bg-gray-200 shadow-md'} text-center flex flex-col justify-center h-screen p-4 min-w-96"
      >
        <div
          class="transition-opacity duration-700"
          class:opacity-0={isTransitioning}
        >
          {#if !isAuthenticated || isTransitioning}
            <form onsubmit={handleSubmit}>
              <input
                type="password"
                id="password"
                placeholder="Password"
                bind:value={password}
                class="border border-gray-300 p-2 rounded w-64 mb-4"
              />
              <button
                type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-20"
              >
                Submit
              </button>
            </form>
          {/if}
        </div>
      </div>

      <div class="flex-1" style="max-width: {sideWidth.current}px"></div>
    </div>
  {/if}
</div>

<Settings
  bind:isOpen={isSettingsOpen}
  {categories}
  onSave={handleCategorySave}
/>

<!-- ai because im idiot -->
<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .overflow-y-auto::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .overflow-y-auto {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
