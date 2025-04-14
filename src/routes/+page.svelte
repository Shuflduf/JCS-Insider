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

    <table>
        <thead class="border-2"
            ><tr>
                <th class="border-2"> </th>
                {#each Object.entries(data) as [key, item]}
                    <th class="border-2"> {key} </th>
                {/each}
            </tr>

            <tr>
                {#each Object.entries(Object.entries(data)) as [key, item]}
                    <td>{JSON.stringify(item[1].Main)}</td>
                {/each}
            </tr>
        </thead>
    </table>
{:catch error}
    <p>{error.message}</p>
{/await}
