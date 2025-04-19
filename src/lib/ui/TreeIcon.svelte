<script lang="ts">
	import Icon from '@iconify/svelte';
	import tree from '@iconify-icons/iconoir/tree';

	const colors: string[] = ['#28965A', '#FEFAE0', '#DDA15E'];

	let iconColor = $state(0);
</script>

<button class="logo" onclick={() => (iconColor = (iconColor + 1) % colors.length)}>
	<Icon icon={tree} color={colors[iconColor]} width="100%" height="100%" />
</button>

<style>
	.logo {
		width: calc(68px - 1rem);
		height: calc(68px - 1rem);
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		padding: 0;
		border: none;
		cursor: pointer;
	}
</style>
