<script lang="ts">
  import { onMount } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import { fade } from "svelte/transition";
  import { getMenu } from "./appwrite";
  import type { MenuData } from "./appwrite";

  let password = $state("");
  let isAuthenticated = $state(false);
  let isTransitioning = $state(false);
  let isReady = $derived(() => isAuthenticated && !isTransitioning);
  const correctPassword = "password";

  let items: MenuData = $state({
    Monday: {
      Breakfast: [
        { name: "Egg", price: 5 },
        { name: "Bread", price: 2 },
      ],
      Lunch: [
        { name: "Rice", price: 3 },
        { name: "Chicken", price: 7 },
      ],
    },
  });
  let isSettingsOpen = $state(false);

  onMount(async () => {
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
        {#each Object.keys(items) as day}
          {#each Object.keys(items[day]) as category}
            {#each items[day][category] as item}
              <div
                class="bg-white rounded-lg shadow-md mb-4 p-4 relative w-full"
              >
                <p>{item.name}</p>
                <p class="text-sm text-gray-600">${item.price}</p>
              </div>
            {/each}
          {/each}
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
