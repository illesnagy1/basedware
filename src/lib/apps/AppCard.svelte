<script lang="ts">
  import Button from '$lib/Button.svelte'
  import Card from '$lib/Card.svelte'
  import type { Application } from './index';

  interface Props {
    app: Application;
  }

  let { app }: Props = $props();
</script>

<Card>
  <img
    src={app.icon}
    alt={app.name}
    class="size-32 object-contain"
  />
  <h4 class="timeline-title">{app.name}</h4>
  <div class="flex flex-row items-center gap-2 mt-1 align-center">
    {#each app.platforms as platform}
      <platform.icon size={32} />
    {/each}
  </div>
  <p class="timeline-text text-gray-500 mt-1">
    {app.description}
  </p>
  <Button
    href={app.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    Download
  </Button>
</Card>
