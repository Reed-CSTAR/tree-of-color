<script lang="ts" module>
	const lightCount = 100;
	const strips = 5;
</script>

<script lang="ts">
	import Email from "./Email.svelte";

	import PaneHeader from "./PaneHeader.svelte";

	interface Props {
		lights: Uint8Array | undefined;
		frameCount?: number;
	}

	let { lights, frameCount }: Props = $props();
</script>

<div class="lightsWrapper">
	<PaneHeader onclear={() => lights = undefined}>
		Lights
		{#if frameCount}
			(frame {frameCount})
		{:else if lights !== undefined}
			(nothing is running!)
		{/if}
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
				Check out the examples at the top right, press
				<!-- TODO: i love hardcoded colors! -->
				<span style:color="rgb(234, 255, 150)">Run</span> to run the Python <br />
				script (and see some colors!), and press
				<span style:color="rgb(212, 66, 64)">Stop</span> to stop the script. <br /><br />
	
				The tree itself will have 5 strips with 100 LEDs each. When you run <br />
				the python code, each strip will be boxed in the visualization. <br /><br />

				Once you are ready to share your creation, or have questions, <br />email us:
				<Email />
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
		border: 1px solid rgba(255, 255, 255, 0.3);
		padding: 0.25rem;
	}

	.lights {
		display: flex;
		flex-wrap: wrap;
		padding: 1rem;
		background-color: #121212;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		color: white;
		height: 100%;

		h2 {
			margin-top: 0;
		}

		p {
			text-align: center;
			margin-bottom: 0;
		}

		a {
			color: aquamarine;
		}
	}
</style>
