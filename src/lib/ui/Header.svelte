<script lang="ts">
	import Select from '$lib/components/Select.svelte';
	import toast from 'svelte-french-toast';
	import TreeIcon from './TreeIcon.svelte';
	import Icon from '@iconify/svelte';
	import share from '@iconify-icons/codicon/live-share';
	import github from '@iconify-icons/codicon/github';
	import vim from '@iconify-icons/vscode-icons/file-type-vim';
	import { examples } from '$lib/examples';

	interface Props {
		vimMode: boolean;
		example: string;
		onexamplechange?: (newValue: string) => void;
	}

	let { vimMode = $bindable(), example = $bindable(), onexamplechange: onchange }: Props = $props();
</script>

<header>
	<div class="left">
		<div class="logoContainer">
			<TreeIcon />
		</div>
		<h1>Tree of Color</h1>
	</div>
	<div class="right">
		<Select bind:value={example} options={examples} {onchange} />
		<div class="iconAlign">
			<button
				class="smallIcon"
				title="Share"
				onclick={() => {
					navigator.clipboard.writeText(location.href);
					toast.success('Copied share link to clipboard!');
				}}
			>
				<Icon icon={share} color="white" width="100%" height="100%" />
			</button>
		</div>
		<div class="iconAlign">
			<a class="smallIcon" href="https://github.com/Reed-CSTAR/tree-of-color" target="_blank">
				<Icon icon={github} color="white" width="100%" height="100%" />
			</a>
		</div>
		<div class="iconAlign">
			<button class="smallIcon" onclick={() => (vimMode = !vimMode)} title="Vim Mode">
				<Icon icon={vim} color="white" width="100%" height="100%" />
			</button>
		</div>
	</div>
</header>

<style lang="scss">
	header {
		background-color: #1e1e1e;
		border-bottom: 1px solid #252525;
		padding: 0.75rem 0.5rem;
		display: flex;
		justify-content: space-between;

		.left {
			display: flex;
			align-items: center;
		}

		h1 {
			margin: 0;
			color: #d4d4d4;
			font-weight: 400;
			margin-left: calc(0.5rem + 4px);
		}
	}

	.right {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
	}

	.iconAlign {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.smallIcon {
		width: calc(4 * (68px - 1rem) / 5);
		height: calc(4 * (68px - 1rem) / 5);
		background-color: rgba(0, 0, 0, 0);
		border: none;
		padding: 0;
		display: inline-block;
		cursor: pointer;
	}
</style>
