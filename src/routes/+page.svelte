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
