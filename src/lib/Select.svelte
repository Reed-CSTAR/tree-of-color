<script lang="ts">
    interface Props {
        options: [value: string, display: string][];
        value: string;
        onchange: (newValue: string) => void
    }

    let { options, value = $bindable(), onchange }: Props = $props();
</script>

<div class="select">
    <select bind:value={value} onchange={() => onchange(value)}>
        {#each options as [value, display]}
            <option value={value}>{display}</option>
        {/each}
    </select>
</div>

<style>
    .select {
        height: 100%;
        display: flex;
        align-items: center;
    }
</style>