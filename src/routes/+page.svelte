<script lang="ts">
    import { onMount } from "svelte";
    import type { ScrapedData } from "./api/scraper/+server";

    let scrapedMenu: Promise<ScrapedData> | null = $state(null);
    onMount(async () => {
        let scraperData = await fetch("/api/scraper");
        scrapedMenu = scraperData.json();
        console.log(await scrapedMenu);
    });
</script>

<h1 class="justify-center text-center text-4xl font-bold">JCS Insider</h1>

{#if !scrapedMenu}
    <div class="flex justify-center items-center h-80 w-full">
        <h1 class="w-full text-3xl text-center">Loading Menu...</h1>
    </div>
{:else}
    {#await scrapedMenu}
        <p>Loading...</p>
    {:then data}
        <div class="flex justify-evenly menu-table">
            {#each Object.entries(data) as [weekday, dayData]}
                <div
                    class="w-1/4 text-center text-3xl font-bold flex flex-col flex-wrap days"
                >
                    <h1 class="weekday">{weekday}</h1>
                    {#each Object.entries(dayData) as [categoryName, categoryData]}
                        <h2 class="font-normal rows">{categoryName}</h2>
                        <p class="font-normal text-base items mb-4">
                            {categoryData}
                        </p>
                    {/each}
                </div>
            {/each}
        </div>
    {:catch error}
        <p>{error.message}</p>
    {/await}
{/if}

<div
    class="min-h-screen bg-gradient-to-b from-yellow-400 via-red-600 to-black text-white py-8 px-4"
>
    <h1 class="text-5xl font-extrabold text-center mb-4 drop-shadow-md">
        JCS Menu
    </h1>

    {#await menu}
        <p class="text-center text-xl">Loading menu...</p>
    {:then data}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {#each Object.entries(data) as [weekday, dayData]}
                <div class="bg-white text-black rounded-xl p-5 shadow-xl">
                    <h2
                        class="text-2xl font-bold text-center border-b-2 border-black pb-2 mb-4"
                    >
                        {weekday}
                    </h2>

                    {#each Object.entries(dayData) as [categoryName, categoryData]}
                        <div class="mb-4">
                            <h3 class="text-lg font-semibold text-red-700 mb-2">
                                {categoryName}
                            </h3>

                            <ul class="space-y-1">
                                {#each Object.entries(categoryData) as [_, item]}
                                    <li
                                        class="flex justify-between text-sm border-b border-gray-300 py-1"
                                    >
                                        <span>{item.name}</span>
                                        <span class="text-gray-600"
                                            >${item.price}</span
                                        >
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {:catch error}
        <p class="text-center text-red-200">{error.message}</p>
    {/await}
</div>
