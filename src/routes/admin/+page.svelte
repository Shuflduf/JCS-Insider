<script>
	import { cubicOut } from "svelte/easing";
	import { Tween } from "svelte/motion";

	let password = $state("");
	let isAuthenticated = $state(false);
	let isTransitioning = $state(false);
	let isReady = $derived(() => isAuthenticated && !isTransitioning);
	const correctPassword = "password";

	let bgPadding = new Tween(16, {
		duration: 700,
		easing: cubicOut,
	});
	bgPadding.set(16);

	function checkPassword() {
		if (password === correctPassword) {
		// if (true) {
			isTransitioning = true;
			bgPadding.set(900);
			setTimeout(() => {
				isAuthenticated = true;
				isTransitioning = false;
			}, 700);
		} else {
			alert("Incorrect password");
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen {isAuthenticated ? "bg-gray-200" : "bg-gray-300"}">
	<div
		class="{isReady() ? "" : "bg-gray-200 shadow-md"} text-center flex flex-col justify-center h-screen"
		style="padding-left: {isReady() ? "0" : bgPadding.current}px; padding-right: {isReady() ? "0" : bgPadding.current}px"
	>
		<div class="transition-opacity duration-700" class:opacity-0={isTransitioning}>
			{#if (!isAuthenticated || isTransitioning)}
				<label for="password" class="block text-xl font-bold mb-2"
					>Enter Password:</label
				>
				<input
					type="password"
					id="password"
					bind:value={password}
					class="border border-gray-300 p-2 rounded w-full mb-4"
				/>
				<button
					onclick={checkPassword}
					class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
					>Submit</button
				>
			{:else if !isTransitioning}
				<div class="bg-white p-8 rounded shadow-md text-center max-w-md">
					<h1 class="text-2xl font-bold mb-4">Welcome to the admin page!</h1>
					<p class="break-all">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</p>
				</div>
			{/if}
		</div>
	</div>
</div>
