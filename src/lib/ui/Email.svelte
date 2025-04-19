<script lang="ts">
	import { onMount } from 'svelte';

	let email = $state<string | undefined>(undefined);

	onMount(() => {
		email = atob('Y3N0YXJAZ3JvdXBzLnJlZWQuZWR1');
	});
</script>

{#if email !== undefined}
	<a href="mailto:{email}">{email}</a>
{/if}

<style>
	a {
		color: rgb(19, 131, 206);
		text-decoration: underline dotted rgb(19, 131, 206);
	}
</style>
