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
            <div class="strip">
                {#each Array(lightCount).fill(0).map((_, i) => i) as light}
                    {@const r = lights[(strip * lightCount + light) * 3]}
                    {@const g = lights[(strip * lightCount + light) * 3 + 1]}
                    {@const b = lights[(strip * lightCount + light) * 3 + 2]}

                    <div class="light" style="background-color: rgb({r}, {g}, {b})"></div>
                {/each}
            </div>
        {/each}
    {/if}
</div>

<style>
    .light {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }

    .strip {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0.5rem;
        gap: 2px;
    }

    .lights {
        display: flex;
        flex-wrap: wrap;
        padding: 3rem;
        margin: 1rem;
    }
</style>
