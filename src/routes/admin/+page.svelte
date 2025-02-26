<script>
    import { cubicIn, cubicInOut, cubicOut } from "svelte/easing";
    import { Tween } from "svelte/motion";
    import { fade } from "svelte/transition";

    let password = $state("");
    let isAuthenticated = $state(false);
    let isTransitioning = $state(false);
    let isReady = $derived(() => isAuthenticated && !isTransitioning);
    const correctPassword = "password";

    let sideWidth = new Tween(0, {
        duration: 700,
        easing: cubicInOut,
    });
    sideWidth.set(400);

    function checkPassword() {
        if (password === correctPassword) {
            isTransitioning = true;
            sideWidth.set(0);
            setTimeout(() => {
                isAuthenticated = true;
                isTransitioning = false;
                console.log("Authenticated");
            }, 700);
        } else {
            alert("Incorrect password");
        }
    }
</script>

<div
    class="flex items-center justify-center min-h-screen {isAuthenticated
        ? 'bg-gray-200'
        : 'bg-gray-300'}"
>
    {#if isAuthenticated}
        <div class="flex w-full" transition:fade>
            <div class="flex-1" style="max-width: {sideWidth.current}px"></div>

            <div
                class="flex-1 text-center flex flex-col justify-center h-screen p-4"
            >
                <h1 class="text-4xl font-bold mb-4">Admin Page</h1>
                <p class="text-lg">Welcome to the admin page</p>
            </div>

            <div class="flex-1" style="max-width: {sideWidth.current}px"></div>
        </div>
    {:else}
        <div class="flex w-full">
            <div class="flex-1" style="max-width: {sideWidth.current}px"></div>

            <div
                class="flex-1 {isReady()
                    ? ''
                    : 'bg-gray-200 shadow-md'} text-center flex flex-col justify-center h-screen p-4 min-w-96"
            >
                <div
                    class="transition-opacity duration-700"
                    class:opacity-0={isTransitioning}
                >
                    {#if !isAuthenticated || isTransitioning}
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            bind:value={password}
                            class="border border-gray-300 p-2 rounded w-64 mb-4"
                        />
                        <button
                            onclick={checkPassword}
                            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-20"
                        >
                            Submit
                        </button>
                    {/if}
                </div>
            </div>

            <div class="flex-1" style="max-width: {sideWidth.current}px"></div>
        </div>
    {/if}
</div>
