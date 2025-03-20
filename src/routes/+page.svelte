<script lang="ts">
    import { onMount } from "svelte";
    import { getMenu, type MenuData } from "./admin/appwrite";

    let menu: MenuData = $state({});
    onMount(async () => {
        menu = await getMenu();
    });
</script>

<h1 class="justify-center">JCS Insider</h1>
<p>Test</p>

{#if menu}
    <pre>{JSON.stringify(menu, null, 2)}</pre>
{:else}
    <p>Loading...</p>
{/if}
