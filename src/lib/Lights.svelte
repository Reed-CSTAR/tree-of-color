<script lang="ts" module>
	const lightCount = 100;
	const strips = 5;
</script>

<script lang="ts">
	import PaneHeader from "./PaneHeader.svelte";

	let { lights }: { lights: Uint8Array | undefined } = $props();
</script>

<div class="lightsWrapper">
	<PaneHeader onclear={() => lights = undefined}>
		Lights
	</PaneHeader>
	<div class="lights">
		{#if lights}
			{#each Array(strips)
				.fill(0)
				.map((_, i) => i) as strip}
				<div class="strip">
					{#each Array(lightCount)
						.fill(0)
						.map((_, i) => i) as light}
						{@const r = lights[(strip * lightCount + light) * 3]}
						{@const g = lights[(strip * lightCount + light) * 3 + 1]}
						{@const b = lights[(strip * lightCount + light) * 3 + 2]}
	
						<div class="light" style="background-color: rgb({r}, {g}, {b})"></div>
					{/each}
				</div>
			{/each}
		{:else}
			<h2>lets play with lights!</h2>
			<p>
				Check out the examples at the top right, press Run to run the Python <br />
				script (and see some colors!), and press Stop to stop the script. <br /><br />
	
				The tree itself will have 5 strips with 100 LEDs each!
			</p>
		{/if}
	</div>
</div>

<style lang="scss">
	.light {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.lightsWrapper {
		height: 100%;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.strip {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 0.5rem;
		justify-content: start;
		gap: 2px;
	}

	.lights {
		display: flex;
		flex-wrap: wrap;
		padding: 2rem;
		background-color: #121212;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		color: white;
		height: 100%;

		p {
			text-align: center;
		}

		a {
			color: aquamarine;
		}
	}
</style>
