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

    <div class="flex justify-evenly">
        {#each Object.entries(data) as [weekday, dayData]}
            <div
                class="w-1/4 text-center text-3xl font-bold flex flex-col flex-wrap"
            >
                {weekday}
                {#each Object.entries(dayData) as [categoryName, categoryData]}
                    <p class="font-normal">{categoryName}</p>
                    {#each Object.entries(categoryData) as [_, item]}
                        <p class="font-normal text-base">
                            {item.name} (${item.price})
                        </p>
                    {/each}
                {/each}
            </div>
        {/each}
    </div>
{:catch error}
    <p>{error.message}</p>
{/await}
