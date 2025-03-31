<script lang="ts">
    import { fade } from "svelte/transition";

    export let message: string;
    export let type: "success" | "error" = "success";
</script>

<div
    transition:fade
    class="fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg z-50 {type ===
    'success'
        ? 'bg-green-500'
        : 'bg-red-500'} text-white"
>
    {message}
</div>
