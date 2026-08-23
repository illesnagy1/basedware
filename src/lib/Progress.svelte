<script lang="ts">
  let scrolled = $state(0);
</script>

<svelte:window
  onscroll={() => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  }}
/>

<div class="bg-pink fixed left-0 z-50 h-2" style="width: {scrolled}%"></div>
