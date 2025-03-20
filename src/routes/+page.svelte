<script lang="ts">
    import { onMount } from "svelte";
    import { getMenu, type MenuData } from "./admin/appwrite";

    let menu: MenuData = $state({});
    onMount(async () => {
        menu = await getMenu();
    });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#if menu}
    <pre>{JSON.stringify(menu, null, 2)}</pre>
{:else}
    <p>Loading...</p>
{/if}