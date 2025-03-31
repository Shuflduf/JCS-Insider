<script lang="ts">
    import { getMenu, type MenuData } from "./admin/appwrite";

    let menu: Promise<MenuData> = $state(getMenu());
</script>

<h1 class="justify-center">JCS Insider</h1>
<p>Test</p>

{#await menu}
    <p>Loading...</p>
{:then data}
    <pre>{JSON.stringify(data, null, 2)}</pre>
{:catch error}
    <p>{error.message}</p>
{/await}