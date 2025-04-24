<script lang="ts">
    import { onMount } from "svelte";
    import { getMenu, type MenuData } from "./admin/appwrite";

    let menu: Promise<MenuData> = $state(getMenu());

    onMount(async () => {
        fetch("/api/scraper");
    });
</script>

<h1 class="justify-center text-center">JCS Insider</h1>
<p>Test</p>

{#await menu}
    <p>Loading...</p>
{:then data}
    <p>{JSON.stringify(data)}</p>

    <div class="flex justify-evenly  menu-table">
        {#each Object.entries(data) as [weekday, dayData]}
            <div
                class="w-1/4 text-center text-3xl font-bold flex flex-col flex-wrap days"
            >
                {weekday}
                {#each Object.entries(dayData) as [categoryName, categoryData]}
                    <h1 class="font-normal rows">{categoryName}</h1>
                    {#each Object.entries(categoryData) as [_, item]}
                        <h1 class="font-normal text-base items">
                            {item.name} (${item.price})
                        </h1>
                    {/each}
                {/each}
            </div>
        {/each}
    </div>
{:catch error}
    <p>{error.message}</p>
{/await}
