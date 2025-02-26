<script lang="ts">
    import { cubicInOut } from "svelte/easing";
    import { Tween } from "svelte/motion";
    import { fade } from "svelte/transition";

    let password = $state("");
    let isAuthenticated = $state(false);
    let isTransitioning = $state(false);
    let isReady = $derived(() => isAuthenticated && !isTransitioning);
    const correctPassword = "password";
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    type Item = { name: string, height: number };
    type Day = {
        Breakfast: Item[];
        Lunch: Item[];
        Bake: Item[];
    }

    // the following was ai generated because I'm lazy
    const items: { [key: string]: Day } = {
        Monday: {
            Breakfast: [
                { name: "Eggs Benedict", height: 80 },
                { name: "Pancakes", height: 70 },
            ],
            Lunch: [
                { name: "Caesar Salad", height: 90 },
                { name: "Club Sandwich", height: 85 },
            ],
            Bake: [
                { name: "Croissant", height: 60 },
                { name: "Muffin", height: 65 },
            ]
        },
        Tuesday: {
            Breakfast: [
                { name: "Omelette", height: 75 },
                { name: "French Toast", height: 70 },
            ],
            Lunch: [
                { name: "Soup & Sandwich", height: 85 },
                { name: "Cobb Salad", height: 90 },
            ],
            Bake: [
                { name: "Danish", height: 60 },
                { name: "Scone", height: 65 },
            ]
        },
        Wednesday: {
            Breakfast: [
                { name: "Bagel", height: 70 },
                { name: "Smoothie", height: 60 },
            ],
            Lunch: [
                { name: "BLT Sandwich", height: 85 },
                { name: "Chicken Salad", height: 90 },
            ],
            Bake: [
                { name: "Brownie", height: 60 },
                { name: "Cupcake", height: 65 },
            ]
        },
        Thursday: {
            Breakfast: [
                { name: "Waffles", height: 75 },
                { name: "Fruit Salad", height: 70 },
            ],
            Lunch: [
                { name: "Grilled Cheese", height: 85 },
                { name: "Tomato Soup", height: 90 },
                { name: "Tomato Soup", height: 90 },
                { name: "Tomato Soup", height: 90 },
                { name: "Tomato Soup", height: 90 },
                { name: "Tomato Soup", height: 90 },
                { name: "Tomato Soup", height: 90 },
            ],
            Bake: [
                { name: "Cookie", height: 60 },
                { name: "Pie", height: 65 },
            ]
        },
        Friday: {
            Breakfast: [
                { name: "Breakfast Burrito", height: 80 },
                { name: "Yogurt Parfait", height: 70 },
            ],
            Lunch: [
                { name: "Fish Tacos", height: 90 },
                { name: "Quinoa Salad", height: 85 },
            ],
            Bake: [
                { name: "Cheesecake", height: 60 },
                { name: "Donut", height: 65 },
            ]
        },
    };

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
        <div class="flex w-full h-screen" transition:fade>
            <div class="flex-1" style="max-width: {sideWidth.current}px"></div>

            <div class="flex-1 flex gap-4 p-4">
                {#each days as day}
                    <div class="flex-1 flex flex-col h-full">
                        <h2 class="text-xl font-bold mb-4 sticky top-0 bg-white p-2 shadow-sm">{day}</h2>
                        <div class="flex-1 overflow-y-auto">
                            {#each ['Breakfast', 'Lunch', 'Bake'] as category (category as keyof Day)}
                                <div class="mb-6">
                                    <h3 class="text-lg font-semibold mb-3 text-gray-700">{category}</h3>
                                    {#each items[day][category as keyof Day] as item}
                                        <div 
                                            class="bg-white rounded-lg shadow-md mb-4 p-4" 
                                            style="min-height: {item.height}px"
                                        >
                                            <p>{item.name}</p>
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
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

<!-- ai because im idiot -->
<style>
    /* Hide scrollbar for Chrome, Safari and Opera */
    .overflow-y-auto::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .overflow-y-auto {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style>
