<script lang="ts">
  let {
    isOpen = $bindable(false),
    categories: parentCategories = ["FOOD"],
    onSave,
  } = $props<{
    isOpen?: boolean;
    categories?: string[];
    onSave: (categories: string[]) => void;
  }>();

  let localCategories = $state<string[]>([]);

  $effect(() => {
    if (isOpen) {
      // Create a new array to avoid modifying parent's array
      localCategories = [...parentCategories];
    }
  });

  function addCategory() {
    localCategories = [...localCategories, "NEW CATEGORY"];
  }

  function updateCategory(index: number, value: string) {
    const newCategories = [...localCategories];
    newCategories[index] = value;
    localCategories = newCategories;
  }

  function handleSave() {
    onSave(localCategories);
    isOpen = false;
  }

  function handleClose() {
    isOpen = false;
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white p-6 rounded-lg shadow-xl relative max-w-md w-full mx-4"
    >
      <button
        class="absolute top-0 right-2 text-gray-500 hover:text-gray-700"
        onclick={handleClose}
      >
        ×
      </button>
      <h2 class="text-xl font-bold mb-4">Update Categories</h2>
      {#each localCategories as category, index}
        <div class="mb-4">
          <input
            type="text"
            class="border border-gray-300 p-2 rounded-lg w-full"
            value={category}
            oninput={(e) =>
              updateCategory(index, (e.target as HTMLInputElement).value)}
          />
        </div>
      {/each}
      <button
        onclick={addCategory}
        class="border border-gray-300 p-2 rounded-lg w-full"
      >
        + Add Category
      </button>
      <div class="flex justify-end mt-4 gap-2">
        <button
          onclick={handleClose}
          class="border border-gray-300 px-4 py-2 rounded-lg w-full"
        >
          Cancel
        </button>
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
          onclick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
{/if}
