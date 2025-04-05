<script lang="ts" module>
    const lightCount = 100;
    const strips = 5;
</script>

<script lang="ts">
    let { lights } : { lights: Uint8Array | undefined } = $props()
</script>

<div class="lights">
    {#if lights}
        {#each Array(strips).fill(0).map((_, i) => i) as strip} 
            {#each Array(lightCount).fill(0).map((_, i) => i) as light}
                {@const r = lights[(strip * lightCount + light) * 3]}
                {@const g = lights[(strip * lightCount + light) * 3 + 1]}
                {@const b = lights[(strip * lightCount + light) * 3 + 2]}

                <div class="square" style="background-color: rgb({r}, {g}, {b})"></div>
            {/each}
        {/each}
    {/if}
</div>

<style>
    .square {
        width: 10px;
        height: 10px;
    }

    .lights {
        display: flex;
        flex-wrap: wrap;
    }
</style>
