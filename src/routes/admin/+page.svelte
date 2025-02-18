<script>
	let password = "";
	let isAuthenticated = false;
	const correctPassword = "your_password_here";

	function checkPassword() {
		if (password === correctPassword) {
			isAuthenticated = true;
		} else {
			alert("Incorrect password");
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-300">
	<div
		class="bg-gray-200 px-16 rounded shadow-md text-center flex flex-col justify-center h-screen"
	>
		{#if !isAuthenticated}
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
				on:click={checkPassword}
				class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
				>Submit</button
			>
		{:else}
			<div class="bg-white p-8 rounded shadow-md text-center">
				<h1 class="text-2xl font-bold mb-4">Admin Panel</h1>
				<p>
					Welcome to the admin panel. Here you can manage the
					application.
				</p>
			</div>
		{/if}
	</div>
</div>
