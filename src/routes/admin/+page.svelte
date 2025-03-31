<script lang="ts">
  import { onMount } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import { fade } from "svelte/transition";
  import { getMenu, updateMenu } from "./appwrite";
  import type { MenuData } from "./appwrite";
  import Col from "$lib/col.svelte";
  import Row from "$lib/row.svelte";
  import Toast from "$lib/toast.svelte";

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

  onMount(async () => {
    items = await getMenu();
    console.log(items);
  });

  let sideWidth = new Tween(0, {
    duration: 700,
    easing: cubicInOut,
  });
  sideWidth.set(400);

  let showToast = $state(false);
  let toastMessage = $state("");
  let toastType = $state<"success" | "error">("success");
  let isLoading = $state(false);

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

  async function saveMenu() {
    isLoading = true;
    try {
      await updateMenu(items);
      items = await getMenu();
      toastMessage = "Menu saved successfully";
      toastType = "success";
    } catch (error) {
      toastMessage = "Error saving menu";
      toastType = "error";
      console.error("Error saving menu:", error);
    } finally {
      showToast = true;
      setTimeout(() => (showToast = false), 3000);
      isLoading = false;
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
      (_, index) => index !== itemIndex,
    );
    items = items; // trigger reactivity
  }

  function newItem(day: string, category: string) {
    items[day][category].push({ name: "", price: undefined });
    items = items; // trigger reactivity
  }

  function newCategory(day: string) {
    items[day]["New Category"] = [];
    items = items; // trigger reactivity
  }
</script>

<div
  class="flex items-center justify-center min-h-screen {isAuthenticated
    ? 'bg-gray-200'
    : 'bg-gray-300'}"
>
  {#if isAuthenticated}
    <div
      class="flex w-full h-screen overflow-hidden relative {isLoading
        ? 'pointer-events-none'
        : ''}"
      transition:fade
    >
      {#if isLoading}
        <div
          class="absolute inset-0 bg-white/50 z-50 flex items-center justify-center"
        >
          <div class="animate-pulse z-50"></div>
        </div>
      {/if}
      <button
        class="fixed z-20 top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        onclick={saveMenu}
      >
        Save
      </button>
      <div class="flex-1 relative h-full overflow-x-auto">
        <div class="flex gap-4 p-4 min-w-max">
          {#each Object.keys(items) as day}
            <Col class="h-full flex flex-col min-w-[300px]">
              <h1
                class="text-center font-bold text-2xl pb-4 sticky top-0 bg-gray-200"
              >
                {day}
              </h1>
              <div class="overflow-y-auto">
                {#each Object.keys(items[day]) as category}
                  <Col>
                    <div
                      class="flex justify-center w-full gap-2 items-center sticky top-0 bg-gray-200 z-10"
                    >
                      <input
                        type="text"
                        placeholder="Category Name"
                        class="border border-gray-300 p-2 rounded font-bold text-lg"
                        value={category}
                        oninput={(e) => {
                          const newCategory = e.currentTarget.value;
                          if (newCategory !== category) {
                            items[day][newCategory] = items[day][category];
                            delete items[day][category];
                            items = items;
                          }
                        }}
                      />
                      <button
                        onclick={() => newItem(day, category)}
                        class="m-2 p-2 min-w-24 rounded flex items-center justify-center bg-blue-500 text-white hover:bg-blue-700"
                      >
                        New Item</button
                      >
                    </div>
                    {#each items[day][category] as item}
                      <div
                        class="bg-white rounded-lg shadow-md mb-4 p-4 relative w-full"
                      >
                        <input
                          type="text"
                          placeholder="Name"
                          class="border border-gray-300 p-2 rounded w-full mb-4"
                          bind:value={item.name}
                        />
                        <Row>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            class="border border-gray-300 p-2 rounded w-full mb-4"
                            bind:value={item.price}
                          />
                          <button
                            class="bg-red-500 text-white px-4 py-2 h-min rounded hover:bg-red-700"
                            onclick={() =>
                              deleteItem(
                                day,
                                category,
                                items[day][category].indexOf(item),
                              )}
                          >
                            Delete
                          </button>
                        </Row>
                      </div>
                    {/each}
                  </Col>
                {/each}
                <button
                  onclick={() => newCategory(day)}
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  New Category
                </button>
              </div>
            </Col>
          {/each}
        </div>
      </div>
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
  {#if showToast}
    <Toast message={toastMessage} type={toastType} />
  {/if}
</div>
