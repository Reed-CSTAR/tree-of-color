<script lang="ts" module>
	const lightCount = 100;
	const strips = 5;
</script>

<script lang="ts">
	let { lights }: { lights: Uint8Array | undefined } = $props();
</script>

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
		<h2>it is up to you to control these lights.</h2>
		<p>
			Check out the examples, press Run to run the Python <br />
			script (and see some colors!), and press Stop to stop the script.
		</p>
		<p>
			<b>Note:</b> Lights are not as they appear, since they are on a tree. <br />
			There are {strips} continuous strips with no guaranteed layout.
		</p>
		<p>
			<i>Don't want to use Python?</i> <a href="https://github.com/Reed-CSTAR/tree-of-color/blob/main/py/README.md">The program spec is here</a>.
		</p>
	{/if}
</div>

<style lang="scss">
	.light {
		width: 10px;
		height: 10px;
		border-radius: 50%;
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
		height: 100%;
		color: white;

		p {
			text-align: center;
		}

		a {
			color: aquamarine;
		}
	}
</style>
